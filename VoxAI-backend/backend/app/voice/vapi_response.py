"""
Vapi-compatible response formatters.

Handles conversion of agent responses to Vapi's required format.
"""

from typing import Optional
from pydantic import BaseModel


class VapiResponse(BaseModel):
    """Vapi-compatible response format for instructions/text."""
    type: str = "response.create"
    response: dict
    
    class Config:
        extra = "forbid"


def create_vapi_instruction_response(instruction: str, hang_up: bool = False) -> dict:
    """
    Create a Vapi instruction response.
    
    This is the ONLY response type currently used by the inbound handler.
    The agent generates text, and this formatter packages it for Vapi.
    
    Args:
        instruction: The agent's response text to send to user
        hang_up: If True, include end call instruction
        
    Returns:
        Dict in Vapi format: {
            "type": "response.create",
            "response": {"instructions": "<text>"}
        }
        
        With hang_up=True, also includes "endCall": true
    """
    response_dict = {
        "instructions": instruction
    }
    
    if hang_up:
        response_dict["endCall"] = True
    
    return {
        "type": "response.create",
        "response": response_dict
    }

