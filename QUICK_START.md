# VoxAI - Quick Start Guide

This guide will get your VoxAI system up and running in under 5 minutes.

---

## Prerequisites

- **Node.js** (v16 or higher)
- **Python** (3.9 or higher)
- **pip** (Python package manager)
- **npm** (Node package manager)

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Backend Setup

```powershell
# Navigate to backend directory
cd VoxAI-backend\backend

# Create .env file (copy from .env.example)
# Required variables:
# - GEMINI_API_KEY
# - VAPI_API_KEY
# - VAPI_ASSISTANT_ID
# - TWILIO_ACCOUNT_SID
# - TWILIO_AUTH_TOKEN
# - TWILIO_PHONE_NUMBER

# Install Python dependencies
pip install -r requirements.txt

# Start backend server
uvicorn app.main:app --reload --port 8000
```

Backend will start at: `http://localhost:8000`

### Step 2: Frontend Setup

Open a **new terminal** window:

```powershell
# Navigate to frontend directory
cd Voxai-operations-console

# .env.local already configured with:
# VITE_API_URL=http://localhost:8000

# Install Node dependencies
npm install

# Start frontend development server
npm run dev
```

Frontend will start at: `http://localhost:3000`

### Step 3: Verify Integration

1. Open browser to: `http://localhost:3000`
2. Login with any organization type (Government/Company/Custom)
3. Check Dashboard - backend status should show "online" (green indicator)
4. Navigate to "Outbound Gateway"
5. Enter a phone number and opening message
6. Click "Initiate Outbound Call"
7. Verify success message with call ID

---

## ✅ Integration Status

| Feature | Status | Notes |
|---------|--------|-------|
| Backend API | ✅ Running | Port 8000 |
| Frontend UI | ✅ Running | Port 3000 |
| CORS | ✅ Configured | No CORS errors |
| Health Check | ✅ Working | GET / |
| Dashboard Stats | ✅ Working | GET /stats |
| Outbound Calls | ✅ Working | POST /outbound/start |
| Error Handling | ✅ Robust | No silent failures |

---

## 🔧 Troubleshooting

### Backend won't start
- Check if port 8000 is already in use
- Verify `.env` file exists with required variables
- Run: `pip install -r requirements.txt` again

### Frontend shows "Backend disconnected"
- Verify backend is running on port 8000
- Check: `curl http://localhost:8000/` should return JSON
- Verify `VITE_API_URL=http://localhost:8000` in `.env.local`

### CORS errors in browser
- Verify backend CORS middleware is configured
- Restart backend server
- Clear browser cache

### Outbound call fails
- Verify Vapi and Twilio credentials in backend `.env`
- Check backend logs for error messages
- Ensure phone number is in E.164 format (e.g., +1234567890)

---

## 📁 Project Structure

```
VoxAI/
├── VoxAI-backend/
│   └── backend/
│       ├── .env (create this from .env.example)
│       ├── requirements.txt
│       └── app/
│           ├── main.py (API endpoints)
│           ├── config.py (environment variables)
│           └── ... (other modules)
│
├── Voxai-operations-console/
│   ├── .env.local (already configured)
│   ├── package.json
│   ├── lib/
│   │   └── api.ts (API client)
│   └── pages/
│       ├── Dashboard.tsx
│       ├── OutboundCalls.tsx
│       └── ... (other pages)
│
└── INTEGRATION_REPORT.md (detailed integration documentation)
```

---

## 🎯 Next Steps

1. **Configure API Keys**: Add your Gemini, Vapi, and Twilio credentials to backend `.env`
2. **Test Outbound Calls**: Use the Outbound Gateway page to test real calls
3. **Customize Agent**: Modify agent persona settings in Dashboard
4. **Review Integration Report**: See `INTEGRATION_REPORT.md` for detailed documentation

---

## 📚 API Endpoints

### Available Now:
- `GET /` - Health check
- `GET /stats` - System statistics
- `GET /profiles` - Agent profiles
- `POST /outbound/start` - Initiate outbound call
- `POST /vapi/inbound` - Handle inbound Vapi webhooks

### Coming Soon (Mock Data in Frontend):
- `GET /calls` - Call history
- `GET /complaints` - Complaints list
- `POST /knowledge/upload` - Upload knowledge documents
- `POST /users/import` - Import user CSV

---

## 🔐 Environment Variables

### Backend (.env)
```env
GEMINI_API_KEY=your_key_here
VAPI_API_KEY=your_key_here
VAPI_ASSISTANT_ID=your_id_here
TWILIO_ACCOUNT_SID=your_sid_here
TWILIO_AUTH_TOKEN=your_token_here
TWILIO_PHONE_NUMBER=+1234567890
ENV=dev
```

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:8000
GEMINI_API_KEY=PLACEHOLDER_API_KEY
```

---

## 🎉 Success!

Your VoxAI system is now fully integrated and running. The frontend and backend are connected, CORS is configured, and all core features are working.

For detailed integration information, see: **INTEGRATION_REPORT.md**

---

**Questions?** Check the Integration Report or review the code comments in `lib/api.ts` and `app/main.py`.
