import logging
from typing import Optional

from app.storage.database import async_session_maker
from app.storage.sessions import get_call_transcript
from app.agent.llm import call_llm_safe

logger = logging.getLogger(__name__)


async def generate_call_summary(call_id: str) -> dict:
    """
    Generate a summary of a completed call.
    
    Args:
        call_id: Call identifier
        
    Returns:
        Dictionary with summary fields (never raises exceptions)
    """
    try:
        logger.debug(f"[CALL {call_id}] Generating call summary")
        
        # Fetch transcript from database
        async with async_session_maker() as session:
            transcript_events = await get_call_transcript(session, call_id)
        
        if not transcript_events:
            logger.warning(f"[CALL {call_id}] No transcript found for summary")
            return _get_fallback_summary("No transcript available")
        
        # Format transcript as readable conversation
        conversation = _format_transcript(transcript_events)
        logger.debug(f"[CALL {call_id}] Formatted transcript ({len(transcript_events)} events)")
        
        # Generate summary using LLM
        summary = await _generate_llm_summary(call_id, conversation)
        
        logger.info(f"[CALL {call_id}] Call summary generated successfully")
        return summary
        
    except Exception as e:
        logger.error(f"[CALL {call_id}] Error generating summary: {type(e).__name__}: {str(e)}")
        return _get_fallback_summary(f"Error: {type(e).__name__}")


def _format_transcript(transcript_events) -> str:
    """
    Format transcript events as readable conversation.
    
    Args:
        transcript_events: List of TranscriptEvent objects
        
    Returns:
        Formatted conversation string
    """
    lines = []
    for event in transcript_events:
        role = "User" if event.role == "user" else "Agent"
        lines.append(f"{role}: {event.text}")
    
    return "\n".join(lines)


async def _generate_llm_summary(call_id: str, conversation: str) -> dict:
    """
    Use LLM to generate summary from conversation.
    
    Args:
        call_id: Call identifier
        conversation: Formatted conversation text
        
    Returns:
        Summary dictionary (with fallback if LLM fails)
    """
    prompt = f"""
You are a call summary analyzer. Based on the conversation below, provide a JSON summary with these fields:
- call_purpose (1 sentence)
- user_intent (1 sentence)
- agent_actions (list of key actions taken)
- outcome (brief outcome description)

Conversation:
{conversation}

Provide ONLY a valid JSON object with these fields, no additional text.
"""
    
    result = await call_llm_safe(prompt, timeout=30)
    
    if not result:
        logger.warning(f"[CALL {call_id}] LLM failed to generate summary, using fallback")
        return _get_fallback_summary("LLM timeout")
    
    # Try to parse LLM response as JSON
    try:
        import json
        summary = json.loads(result)
        
        # Validate required fields
        required_fields = {"call_purpose", "user_intent", "agent_actions", "outcome"}
        if not all(field in summary for field in required_fields):
            logger.warning(f"[CALL {call_id}] LLM response missing required fields, using fallback")
            return _get_fallback_summary("Incomplete LLM response")
        
        return summary
    except json.JSONDecodeError:
        logger.warning(f"[CALL {call_id}] LLM response not valid JSON, using fallback")
        return _get_fallback_summary("Invalid LLM response format")


def _get_fallback_summary(reason: str) -> dict:
    """
    Return a fallback summary when LLM generation fails.
    
    Args:
        reason: Reason for fallback
        
    Returns:
        Fallback summary dictionary
    """
    return {
        "call_purpose": "Call purpose could not be determined",
        "user_intent": "User intent could not be determined",
        "agent_actions": ["Call processed"],
        "outcome": f"Fallback summary ({reason})"
    }
