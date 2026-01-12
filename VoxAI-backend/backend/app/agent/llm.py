import asyncio
import logging
from typing import Optional
from langchain_google_genai import ChatGoogleGenerativeAI

logger = logging.getLogger(__name__)

MODEL_NAME = "gemini-2.5-pro"
LLM_TIMEOUT = 30  # seconds
LLM_MAX_RETRIES = 2


def get_llm():
    """Initialize Gemini LLM instance."""
    return ChatGoogleGenerativeAI(
        model=MODEL_NAME,
        temperature=0.3
    )


async def call_llm_safe(prompt: str, timeout: int = LLM_TIMEOUT) -> Optional[str]:
    """
    Safely call LLM with timeout, retry logic, and error handling.
    
    Returns:
        LLM output string on success, None on failure.
        NEVER raises exceptions - logs errors instead.
    """
    def _invoke():
        try:
            llm = get_llm()
            result = llm.invoke(prompt)
            return result.content
        except Exception as e:
            logger.error(f"LLM invoke error: {type(e).__name__}: {str(e)}")
            return None

    for attempt in range(LLM_MAX_RETRIES):
        try:
            result = await asyncio.wait_for(
                asyncio.to_thread(_invoke),
                timeout=timeout
            )
            if result is not None:
                return result
            logger.warning(f"LLM returned None (attempt {attempt + 1}/{LLM_MAX_RETRIES})")
        except asyncio.TimeoutError:
            logger.error(f"LLM timeout after {timeout}s (attempt {attempt + 1}/{LLM_MAX_RETRIES})")
        except Exception as e:
            logger.error(f"LLM call failed: {type(e).__name__}: {str(e)}")

    logger.error(f"LLM failed after {LLM_MAX_RETRIES} attempts - using fallback")
    return None


def get_fallback_intent(user_input: str) -> str:
    """Fallback intent when LLM fails."""
    return f"User said: {user_input[:50]}"


def get_fallback_decision() -> str:
    """Fallback decision when LLM fails."""
    return "respond_only"


def get_fallback_response(user_input: str) -> str:
    """Fallback response when LLM fails."""
    return "I'm experiencing a technical issue. Please try again in a moment."
