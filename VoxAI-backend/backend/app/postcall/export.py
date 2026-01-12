import logging
from typing import Optional
from datetime import datetime

from app.storage.database import async_session_maker
from app.storage.sessions import get_call_session, get_call_transcript

logger = logging.getLogger(__name__)


async def export_call_transcript(call_id: str) -> dict:
    """
    Export call session and transcript as structured JSON.
    
    Args:
        call_id: Call identifier
        
    Returns:
        Dictionary with call data and messages (never raises exceptions)
    """
    try:
        logger.debug(f"[CALL {call_id}] Exporting call transcript")
        
        # Fetch call session and transcript from database
        async with async_session_maker() as session:
            call_session = await get_call_session(session, call_id)
            
            if not call_session:
                logger.warning(f"[CALL {call_id}] Call session not found for export")
                return _get_empty_export(call_id, "Call session not found")
            
            transcript_events = await get_call_transcript(session, call_id)
        
        # Format messages
        messages = _format_messages(transcript_events)
        
        # Build export
        export = {
            "call_id": call_id,
            "profile": call_session.profile,
            "status": call_session.status,
            "started_at": _iso_timestamp(call_session.started_at),
            "ended_at": _iso_timestamp(call_session.ended_at),
            "messages": messages
        }
        
        logger.info(f"[CALL {call_id}] Transcript exported successfully ({len(messages)} messages)")
        return export
        
    except Exception as e:
        logger.error(f"[CALL {call_id}] Error exporting transcript: {type(e).__name__}: {str(e)}")
        return _get_empty_export(call_id, f"Export error: {type(e).__name__}")


def _format_messages(transcript_events) -> list:
    """
    Format transcript events as exportable messages.
    
    Args:
        transcript_events: List of TranscriptEvent objects
        
    Returns:
        Sorted list of message dictionaries
    """
    messages = []
    
    for event in transcript_events:
        message = {
            "turn_id": event.turn_id,
            "role": event.role,  # "user" or "assistant"
            "text": event.text,
            "timestamp": _iso_timestamp(event.created_at)
        }
        messages.append(message)
    
    # Sort by turn_id, then timestamp
    messages.sort(key=lambda m: (m["turn_id"], m["timestamp"]))
    
    return messages


def _iso_timestamp(dt: Optional[datetime]) -> Optional[str]:
    """
    Convert datetime to ISO 8601 string.
    
    Args:
        dt: Datetime object or None
        
    Returns:
        ISO formatted string or None
    """
    if dt is None:
        return None
    
    return dt.isoformat()


def _get_empty_export(call_id: str, error: str) -> dict:
    """
    Return an empty export with error information.
    
    Args:
        call_id: Call identifier
        error: Error message
        
    Returns:
        Empty export dictionary with error field
    """
    return {
        "call_id": call_id,
        "profile": None,
        "status": None,
        "started_at": None,
        "ended_at": None,
        "messages": [],
        "error": error
    }
