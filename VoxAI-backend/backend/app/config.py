import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

VAPI_API_KEY = os.getenv("VAPI_API_KEY")
VAPI_BASE_URL = os.getenv("VAPI_BASE_URL", "https://api.vapi.ai")
VAPI_ASSISTANT_ID = os.getenv("VAPI_ASSISTANT_ID")

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")

ENV = os.getenv("ENV", "dev")
