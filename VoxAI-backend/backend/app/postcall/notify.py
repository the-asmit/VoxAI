import logging
from typing import Optional

from app.postcall.summary import generate_call_summary

logger = logging.getLogger(__name__)


async def notify_post_call(call_id: str):
    """
    Post-call notification orchestrator.
    
    Generates summary, builds email payload (transcript-free),
    and sends notifications to email and frontend webhook.
    
    NEVER raises exceptions. Logs all errors and continues.
    
    Args:
        call_id: Call identifier
    """
    try:
        logger.info(f"[CALL {call_id}] Starting post-call notifications")
        
        # Step 1: Generate call summary
        summary = await generate_call_summary(call_id)
        logger.debug(f"[CALL {call_id}] Summary generated")
        
        # Step 2: Build email payload (transcript-free)
        email_payload = _build_email_payload(call_id, summary)
        logger.debug(f"[CALL {call_id}] Email payload built")
        
        # Step 3: Send email notification
        await _send_email(call_id, email_payload)
        
        # Step 4: Send webhook for frontend/dashboard
        await _send_webhook(call_id, summary)
        
        logger.info(f"[CALL {call_id}] Post-call notifications completed")
        
    except Exception as e:
        logger.error(f"[CALL {call_id}] Error in notify_post_call: {type(e).__name__}: {str(e)}")
        # Continue execution, never raise


def _build_email_payload(call_id: str, summary: dict) -> dict:
    """
    Build email-safe payload from summary.
    
    ONLY includes actionable items:
    - Call purpose (high-level)
    - Agent actions (key steps taken)
    - Outcome
    
    NEVER includes:
    - Full transcript
    - Turn-by-turn messages
    - Raw user speech
    - LLM output
    
    Args:
        call_id: Call identifier
        summary: Summary dict from generate_call_summary
        
    Returns:
        Email payload with subject and body
    """
    try:
        call_purpose = summary.get("call_purpose", "Call Completed")
        agent_actions = summary.get("agent_actions", [])
        outcome = summary.get("outcome", "Call ended")
        
        # Format actions as bullet list
        actions_text = "\n".join([f"• {action}" for action in agent_actions]) if agent_actions else "• No specific actions recorded"
        
        subject = f"Call Summary: {call_purpose}"
        
        body = f"""
Call Summary Notification

Call ID: {call_id}

Purpose: {call_purpose}

Actions Taken:
{actions_text}

Outcome: {outcome}

---
Full transcript and call details are available in your dashboard.
"""
        
        return {
            "subject": subject,
            "body": body
        }
        
    except Exception as e:
        logger.error(f"[CALL {call_id}] Error building email payload: {type(e).__name__}: {str(e)}")
        return {
            "subject": f"Call Summary: {call_id}",
            "body": f"Call {call_id} completed. Details available in dashboard."
        }


async def _send_email(call_id: str, payload: dict):
    """
    Send email notification.
    
    Stub implementation for now (logs only).
    In production, would integrate with email service (SendGrid, AWS SES, etc).
    
    NEVER includes transcript or detailed turn data.
    
    Args:
        call_id: Call identifier
        payload: Email payload with subject and body
    """
    try:
        logger.debug(f"[CALL {call_id}] Sending email notification")
        logger.debug(f"[CALL {call_id}] Email subject: {payload.get('subject', 'N/A')}")
        logger.debug(f"[CALL {call_id}] Email body preview: {payload.get('body', '')[:100]}...")
        
        # TODO: Production implementation
        # await email_service.send(
        #     to="recipient@example.com",
        #     subject=payload["subject"],
        #     body=payload["body"]
        # )
        
    except Exception as e:
        logger.error(f"[CALL {call_id}] Error sending email: {type(e).__name__}: {str(e)}")
        # Continue, don't raise


async def _send_webhook(call_id: str, summary: dict):
    """
    Send webhook notification for frontend/dashboard.
    
    Includes call_id and summary only. No transcript data.
    Frontend handles transcript downloads separately via dedicated API.
    
    Stub implementation for now (logs only).
    In production, would POST to webhook URL.
    
    Args:
        call_id: Call identifier
        summary: Call summary dict
    """
    try:
        logger.debug(f"[CALL {call_id}] Sending webhook notification to frontend")
        
        webhook_payload = {
            "event": "call.completed",
            "call_id": call_id,
            "summary": summary
        }
        
        logger.debug(f"[CALL {call_id}] Webhook payload: {webhook_payload}")
        
        # TODO: Production implementation
        # async with httpx.AsyncClient() as client:
        #     await client.post(
        #         "https://dashboard.example.com/webhooks/call-completed",
        #         json=webhook_payload,
        #         timeout=10
        #     )
        
    except Exception as e:
        logger.error(f"[CALL {call_id}] Error sending webhook: {type(e).__name__}: {str(e)}")
        # Continue, don't raise
