# VoxAI Demo Checklist

Use this checklist to ensure everything is ready before your live demo.

---

## Pre-Demo Setup (30 minutes before)

### Backend Configuration
- [ ] Navigate to `VoxAI-backend/backend/`
- [ ] Verify `.env` file exists with all required variables:
  - [ ] `GEMINI_API_KEY` set
  - [ ] `VAPI_API_KEY` set
  - [ ] `VAPI_ASSISTANT_ID` set
  - [ ] `TWILIO_ACCOUNT_SID` set
  - [ ] `TWILIO_AUTH_TOKEN` set
  - [ ] `TWILIO_PHONE_NUMBER` set (E.164 format: +1234567890)
- [ ] Run: `pip install -r requirements.txt` (if first time)
- [ ] Start backend: `uvicorn app.main:app --reload --port 8000`
- [ ] Verify backend console shows: "VoxAI backend starting up"
- [ ] Test: Open `http://localhost:8000/` in browser - should show JSON

### Frontend Configuration
- [ ] Navigate to `Voxai-operations-console/`
- [ ] Verify `.env.local` exists with `VITE_API_URL=http://localhost:8000`
- [ ] Run: `npm install` (if first time)
- [ ] Start frontend: `npm run dev`
- [ ] Verify frontend console shows: "Local: http://localhost:3000/"
- [ ] Test: Open `http://localhost:3000/` in browser - should load login page

### Browser Setup
- [ ] Use Chrome or Firefox (recommended)
- [ ] Open Developer Tools (F12)
- [ ] Clear browser cache
- [ ] Check Console tab for errors (should be none)
- [ ] Check Network tab - verify no CORS errors

---

## Demo Flow Checklist

### 1. Login
- [ ] Open `http://localhost:3000/`
- [ ] Select organization type (Government/Company/Custom)
- [ ] Click "Access Console"
- [ ] Should redirect to Dashboard

### 2. Dashboard Overview
- [ ] Verify top bar shows backend status indicator
- [ ] Should show green "VoxAI backend running" or "Backend online"
- [ ] Verify 4 stat cards display numbers:
  - [ ] Total Calls
  - [ ] Active Sessions
  - [ ] Complaints Detected
  - [ ] Success Rate
- [ ] Scroll down to Agent Persona Settings section
- [ ] Verify Agent Identity card on right shows profile info

**Talking Points:**
- "The dashboard shows real-time system health and statistics"
- "Backend is connected and operational (green status indicator)"
- "Agent configuration is managed here for different scenarios"

### 3. Outbound Gateway (CRITICAL DEMO PATH)
- [ ] Click "Outbound Gateway" in sidebar
- [ ] Page should load without errors
- [ ] Verify form fields are visible:
  - [ ] Target Phone Number input
  - [ ] Opening Message (TTS Prompt) textarea
- [ ] Verify "Gateway Ready" indicator at top right

**Demo Actions:**
- [ ] Enter test phone number (e.g., `+19258439886`)
- [ ] Verify opening message is pre-filled or enter custom message
- [ ] Click "Initiate Outbound Call" button
- [ ] Watch for loading state ("Establishing Link...")
- [ ] Verify success response appears with:
  - [ ] "Call Dispatched Successfully" green banner
  - [ ] Call ID displayed
  - [ ] Remote Status shown
- [ ] If error occurs, verify clear error message shown (no silent fail)

**Talking Points:**
- "This is the outbound call initiation interface"
- "We send the phone number and opening message to Vapi"
- "Backend handles Twilio integration and call orchestration"
- "Success response shows call ID from Vapi service"

### 4. Call History (Mock Data)
- [ ] Click "Operational Logs" in sidebar
- [ ] Verify table displays call records
- [ ] Click on a call record
- [ ] Verify modal opens showing:
  - [ ] Transcript
  - [ ] Summary
  - [ ] Call details
- [ ] Close modal with X button

**Talking Points:**
- "Call history shows completed interactions"
- "Currently displaying mock data - backend endpoint pending"
- "Transcript and summary captured for each call"
- "Live call simulation shows real-time updates"

### 5. Complaints (Mock Data)
- [ ] Click "Incident Grievances" in sidebar
- [ ] Verify table displays complaint records
- [ ] Verify status badges (Open, In Progress, Escalated, Resolved)
- [ ] Click on a complaint
- [ ] Verify modal shows complaint details

**Talking Points:**
- "AI detects complaints and grievances during calls"
- "Escalation workflows trigger based on sentiment"
- "Currently displaying mock data for demonstration"

### 6. Knowledge Base (Mock Data)
- [ ] Click "Knowledge Registry" in sidebar
- [ ] Verify categories display
- [ ] Expand a category
- [ ] Verify documents list appears
- [ ] Click "Upload New Knowledge" button
- [ ] Verify modal opens

**Talking Points:**
- "Knowledge base feeds context to AI agent"
- "Documents organized by profile (Government/Company/Custom)"
- "Upload interface ready - backend integration pending"

### 7. Users Registry (Mock Data)
- [ ] Click "Citizen Registry" or "Customer Registry" in sidebar
- [ ] Verify page loads
- [ ] Click "Link Data Source" button
- [ ] Verify modal opens with source options

**Talking Points:**
- "User registry manages citizen/customer database"
- "CSV upload and Google Sheets integration supported"
- "Currently displaying mock data"

### 8. Navigation & Stability
- [ ] Click through all sidebar menu items rapidly
- [ ] Verify no crashes or console errors
- [ ] Verify smooth page transitions
- [ ] Verify backend status stays "online" throughout

---

## Error Scenarios to Test

### Backend Offline Scenario
- [ ] Stop backend server (Ctrl+C in backend terminal)
- [ ] Refresh frontend Dashboard
- [ ] Verify backend status shows "offline" or "Backend disconnected"
- [ ] Verify stats still display (fallback to mock data)
- [ ] Navigate to Outbound Calls
- [ ] Try to initiate call
- [ ] Verify clear error message (e.g., "Network error - could not reach backend")
- [ ] Restart backend
- [ ] Refresh Dashboard
- [ ] Verify backend status returns to "online"

### Invalid Phone Number
- [ ] Navigate to Outbound Gateway
- [ ] Enter invalid phone number (e.g., "123")
- [ ] Click "Initiate Outbound Call"
- [ ] Verify error message shown

---

## Console Monitoring

### Backend Console Should Show:
```
INFO:     VoxAI backend starting up
INFO:     Database initialized successfully
INFO:     Session cleanup loop started
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### Frontend Console Should Show:
```
No errors
```

### Browser Console Should NOT Show:
- ❌ CORS errors
- ❌ Network failed errors (when backend is running)
- ❌ Unhandled promise rejections
- ❌ React errors

### Browser Console MAY Show (Normal):
- ⚠️ "Stats endpoint unavailable, using mock data" (if backend down)
- ⚠️ "Profiles endpoint unavailable, using mock data" (if backend down)
- ℹ️ Component mount/unmount logs

---

## Backup Plans

### If Backend Won't Start:
1. Check `.env` file exists and has valid values
2. Run `pip install -r requirements.txt` again
3. Try different port: `uvicorn app.main:app --reload --port 8001`
4. Update frontend `.env.local`: `VITE_API_URL=http://localhost:8001`
5. Restart both servers

### If Frontend Won't Start:
1. Delete `node_modules/` folder
2. Run `npm install` again
3. Clear npm cache: `npm cache clean --force`
4. Try different port in `vite.config.ts`

### If CORS Errors Appear:
1. Verify backend CORS middleware is configured
2. Check backend console for startup messages
3. Restart backend server
4. Clear browser cache and cookies
5. Try incognito/private browsing mode

### If Outbound Call Fails:
1. Verify Vapi API key is valid
2. Check Vapi assistant ID is correct
3. Verify Twilio credentials
4. Check phone number format (must be E.164: +1234567890)
5. Review backend logs for specific error

---

## Post-Demo Notes

### What Worked:
- [ ] Backend API connectivity
- [ ] Dashboard stats loading
- [ ] Outbound call initiation
- [ ] Error handling
- [ ] Navigation between pages
- [ ] Mock data displays

### Issues Encountered:
- [ ] (Record any issues here)

### Questions from Audience:
- [ ] (Record questions here)

### Follow-up Items:
- [ ] Implement remaining backend endpoints (calls, complaints, etc.)
- [ ] Add authentication/authorization
- [ ] Connect knowledge base upload to backend
- [ ] Implement user CSV import endpoint
- [ ] Add WebSocket for real-time updates
- [ ] Replace mock data with actual database queries

---

## Quick Reference

**Backend URL:** `http://localhost:8000`  
**Frontend URL:** `http://localhost:3000`  
**API Docs:** `http://localhost:8000/docs` (FastAPI auto-generated)  

**Test Phone Number:** `+19258439886` (or your test number)  
**Test Opening Message:** "Hello, this is VoxAI calling regarding your recent inquiry."

---

## Success Criteria

✅ **Demo is successful if:**
1. Frontend loads without crashes
2. Backend status shows "online"
3. Dashboard displays stats
4. Outbound call can be initiated from UI
5. Success/error messages display correctly
6. Navigation works smoothly
7. No console errors during demo
8. Can explain mock vs. real data clearly

---

**Demo Ready:** YES ✅  
**Last Verified:** January 12, 2026  
**System Status:** STABLE

Good luck with your demo! 🚀
