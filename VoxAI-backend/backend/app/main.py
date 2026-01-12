from fastapi import FastAPI, Request, Body
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from app.voice.inbound_handler import handle_vapi_inbound
from app.utils.logger import setup_logging, get_logger
from app.storage.database import init_db, close_db
from app.storage.sessions import cleanup_stale_sessions
from contextlib import asynccontextmanager
import asyncio
import httpx
from app.config import VAPI_API_KEY, VAPI_ASSISTANT_ID, TWILIO_ACCOUNT_SID, TWILIO_PHONE_NUMBER, TWILIO_AUTH_TOKEN

# Initialize logging on startup
setup_logging()
logger = get_logger(__name__)


async def _cleanup_loop():
    """
    Background task: periodically cleanup stale call sessions.
    Runs every 60 minutes to mark abandoned calls.
    """
    try:
        while True:
            await asyncio.sleep(3600)  # Run every 60 minutes
            await cleanup_stale_sessions(timeout_minutes=1440)  # 24 hour timeout
    except asyncio.CancelledError:
        logger.info("Session cleanup loop cancelled")
        raise
    except Exception as e:
        logger.error(f"Session cleanup loop crashed: {type(e).__name__}: {str(e)}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("VoxAI backend starting up")

    try:
        await init_db()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(
            f"Failed to initialize database: {type(e).__name__}: {str(e)}"
        )
        raise

    # Start background cleanup task for orphaned call sessions
    cleanup_task = asyncio.create_task(_cleanup_loop())
    logger.info("Session cleanup loop started")

    yield

    logger.info("VoxAI backend shutting down")

    # Cancel cleanup task
    cleanup_task.cancel()
    try:
        await cleanup_task
    except asyncio.CancelledError:
        logger.debug("Cleanup task cancelled gracefully")

    # All background tasks are managed by inbound_handler per-call state

    try:
        await close_db()
        logger.info("Database connection closed")
    except Exception as e:
        logger.error(
            f"Failed to close database connection: {type(e).__name__}: {str(e)}"
        )


app = FastAPI(lifespan=lifespan)

# Configure CORS to allow frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Handle Pydantic validation errors globally.
    
    Returns HTTP 200 to prevent Vapi from retrying, while logging validation issues
    for visibility. This ensures operational transparency without disrupting webhooks.
    """
    logger.warning(
        f"Webhook validation error - Method: {request.method}, URL: {request.url}, "
        f"Errors: {exc.errors()}"
    )
    return {"status": "ok"}


@app.post("/vapi/inbound")
async def vapi_inbound(payload: dict = Body(...)):
    """
    DEDICATED ENDPOINT for real inbound phone calls from Vapi.
    
    Handles per-call session state, event routing (call.started, transcript, call.ended),
    and returns Vapi-compatible response format.
    
    Request format:
    {
        "event": "call.started | transcript | call.ended",
        "call": {
            "id": "unique-call-id-from-vapi"
        },
        "transcript": {
            "text": "user spoken text",
            "isFinal": true
        },
        "metadata": {
            "agent_profile": "government | private | custom",
            "custom_config": { ... }
        }
    }
    
    Response format depends on event type:
    - call.started: {} (empty)
    - call.ended: {} (empty)
    - transcript (final): {
        "type": "response.create",
        "response": {
            "instructions": "<agent response text>"
        }
      }
    """
    try:
        # REAL Vapi payload structure:
        # {
        #   "message": {"type": "speech-update|conversation-update", ...},
        #   "call": {"id": "...", ...}
        # }
        
        message = payload.get("message") or {}
        call = payload.get("call") or {}
        call_id = call.get("id")
        message_type = message.get("type")
        
        # Debug: Check if call is nested in message
        if not call_id and message:
            call = message.get("call") or {}
            call_id = call.get("id")
        
        logger.info(f"[VAPI_WEBHOOK] message_type={message_type}, call_id={call_id}, payload_keys={list(payload.keys())}")
        
        # Convert Vapi message types to our event format
        if message_type in ["speech-update", "conversation-update"]:
            event = "transcript"
            
            # Extract the last user message from the conversation
            if message_type == "speech-update":
                messages = message.get("artifact", {}).get("messages", [])
                field_key = "message"
            else:  # conversation-update
                messages = message.get("conversation", [])
                field_key = "content"
            
            transcript_text = ""
            if messages:
                for msg in reversed(messages):
                    if msg.get("role") == "user":
                        transcript_text = msg.get(field_key, "")
                        break
        else:
            event = None
            transcript_text = ""
        
        # Validate
        if not event or not call_id:
            logger.debug(f"[VAPI_WEBHOOK] Skipping - event={event}, call_id={call_id}")
            return {"status": "ok"}
        
        if not transcript_text:
            logger.debug(f"[VAPI_WEBHOOK] No transcript text found")
            return {"status": "ok"}
        
        logger.info(f"[VAPI_WEBHOOK] Processing transcript from {call_id}: {transcript_text[:50]}...")
        
        # Route to handler
        response = await handle_vapi_inbound(
            event=event,
            call_id=call_id,
            transcript_text=transcript_text,
            is_final=True,
            metadata=None,
        )
        
        # Return response
        return response or {"status": "ok"}
    
    except Exception as e:
        logger.error(f"Error handling Vapi inbound: {type(e).__name__}: {str(e)}")
        return {"status": "ok"}

@app.get("/")
def display():
    logger.debug("Health check endpoint accessed")
    return {"status": "VoxAI backend running"}


@app.post("/outbound/start")
async def start_outbound_call(payload: dict):
    """
    Expected payload:
    {
      "phoneNumber": "+919258439886",
      "openingMessage": "Hello, this is VoxAI calling you."
    }
    """
    
    phone_number = payload.get("phoneNumber") or payload.get("phone_number")
    opening_message = payload.get("openingMessage") or payload.get("opening_message")

    if not phone_number:
        return {"status": "error", "detail": "phoneNumber is required"}

    # ✅ CORRECT Vapi payload structure
    vapi_payload = {
        "assistantId": VAPI_ASSISTANT_ID,
        "phoneNumber": {
            "twilioPhoneNumber": TWILIO_PHONE_NUMBER.replace(" ", ""),  # Remove spaces
            "twilioAccountSid": TWILIO_ACCOUNT_SID,
            "twilioAuthToken": TWILIO_AUTH_TOKEN
        },
        "customer": {
            "number": phone_number  # Customer number (call TO)
        },
        "assistantOverrides": {
            "firstMessage": opening_message or "Hello from VoxAI."
        }
    }

    vapi_headers = {
        "Authorization": f"Bearer {VAPI_API_KEY}",
        "Content-Type": "application/json"
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.vapi.ai/call",  # ✅ Correct endpoint
                json=vapi_payload,
                headers=vapi_headers,
                timeout=15.0
            )
        
        logger.info(f"Vapi outbound call initiated to {phone_number}: {response.status_code}")
        
        if response.status_code != 200:
            return {
                "status": "failed",
                "vapi_response": response.json()
            }
        
        return {
            "status": "started",
            "vapi_response": response.json()
        }
    except Exception as e:
        logger.error(f"Failed to start call: {type(e).__name__}: {str(e)}")
        return {
            "status": "error",
            "error": str(e)
        }


@app.get("/stats")
async def get_stats():
    """
    Get system statistics for dashboard.
    Returns mock data for now - can be extended to pull from database.
    """
    try:
        # TODO: Replace with actual database queries
        return {
            "totalCalls": 1284,
            "activeSessions": 3,
            "complaintsDetected": 14,
            "successRate": "94.2%"
        }
    except Exception as e:
        logger.error(f"Error fetching stats: {type(e).__name__}: {str(e)}")
        return {
            "totalCalls": 0,
            "activeSessions": 0,
            "complaintsDetected": 0,
            "successRate": "0%"
        }


@app.get("/profiles")
async def get_profiles():
    """
    Get agent profiles.
    Returns mock data for now - can be extended to pull from database.
    """
    try:
        # TODO: Replace with actual database queries
        return [
            {
                "id": "p1",
                "name": "Alpha Core v2.4",
                "phoneNumber": "+1 (800) 555-0199",
                "status": "Active",
                "lastModified": "2024-03-14"
            },
            {
                "id": "p2",
                "name": "Citizen Support Beta",
                "phoneNumber": "+1 (800) 555-0122",
                "status": "Draft",
                "lastModified": "2024-03-12"
            }
        ]
    except Exception as e:
        logger.error(f"Error fetching profiles: {type(e).__name__}: {str(e)}")
        return []
