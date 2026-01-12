from pydantic import BaseModel
from typing import Optional, Any, Dict


class TranscriptData(BaseModel):
    """Vapi transcript object from webhook."""
    text: Optional[str] = None
    isFinal: Optional[bool] = True


class CallData(BaseModel):
    """Vapi call object from webhook."""
    id: Optional[str] = None


class VapiWebhookPayload(BaseModel):
    """
    Vapi webhook payload schema with validation.
    Handles transcript, call.ended, and other events.
    """
    event: Optional[str] = None
    call: Optional[CallData] = None
    transcript: Optional[TranscriptData] = None
    metadata: Optional[Dict[str, Any]] = None

    class Config:
        extra = "allow"  # Allow extra fields from Vapi without failing
