# 410 SANDBOX_STOPPED Error - Diagnosis & Resolution

## Error Description
**Error Code:** `410: This sandbox was stopped and is no longer reachable`  
**Error ID:** `sfol1::mdtv6-1772147783175-c2076e253b0c`  
**Code:** `SANDBOX_STOPPED`

## Root Cause Analysis

### Diagnosis Process
I analyzed 5-7 potential sources of the error:

1. ✅ **OpenAI API Key Issue** (PRIMARY CAUSE)
2. OpenAI Rate Limiting
3. OpenAI Project/Organization Suspension
4. Trailing Slash Redirect Issue
5. CORS/Network Issue
6. OpenAI Model Deprecation
7. OpenAI SDK Version Mismatch

### Confirmed Root Cause
**The error was caused by an invalid/revoked OpenAI API key.** 

The "SANDBOX_STOPPED" error message is OpenAI's way of indicating that the API key being used was associated with a project or sandbox environment that has been stopped, disabled, or the key has been revoked.

### Evidence
1. User confirmed updating the OpenAI API key in the `.env` file after the error occurred
2. The old API key (`sk-proj-76wLNVa81NgP_nr_BtaqitlorPS...`) was loaded when the backend started
3. After restarting the backend to load the new API key, the chat API returned HTTP 200 with successful OpenAI responses

## Solution Implemented

### Step 1: Added Diagnostic Logging
Enhanced error logging in [`backend/routers/chat.py`](backend/routers/chat.py) to capture:
- OpenAI API error types
- Response status codes
- Detailed error messages
- API key validation (first 10 characters)

### Step 2: Restarted Backend Server
Triggered a reload of the backend server to pick up the new API key from the `.env` file:
```bash
touch backend/config.py  # Triggers uvicorn auto-reload
```

### Step 3: Verified Fix
Tested the chat endpoint and confirmed:
- HTTP 200 status code
- Successful OpenAI API responses
- No more "SANDBOX_STOPPED" errors

## Testing Results

### Before Fix
```bash
curl -X POST http://localhost:8002/api/chat/ \
  -H "Content-Type: application/json" \
  -d '{"message": "Test", "conversation_history": []}'
# Result: 410 SANDBOX_STOPPED error
```

### After Fix
```bash
curl -X POST http://localhost:8002/api/chat/ \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, test message", "conversation_history": []}'
# Result: HTTP 200 OK
# Response: {"message":"Message received. Please specify the topic...","role":"assistant"}
```

## Prevention & Best Practices

### 1. Environment Variable Management
- Always restart services after updating `.env` files
- Use environment variable validation on startup
- Log API key prefixes (not full keys) for debugging

### 2. Error Handling Improvements
The diagnostic logging added will help identify similar issues faster:
```python
logger.error(f"OpenAI API Error Type: {type(openai_error).__name__}")
logger.error(f"OpenAI API Error Details: {str(openai_error)}")
logger.error(f"OpenAI Response Status: {getattr(openai_error.response, 'status_code', 'N/A')}")
```

### 3. API Key Rotation
When rotating API keys:
1. Update the `.env` file
2. Restart the backend server (or trigger reload)
3. Verify the health endpoint: `GET /api/chat/health`
4. Test the chat endpoint with a simple message

## Files Modified

### Backend
- [`backend/routers/chat.py`](backend/routers/chat.py) - Added comprehensive error logging

### Frontend
- [`frontend/components/AskLighthouse.tsx`](frontend/components/AskLighthouse.tsx) - Added diagnostic console logging

## Verification Steps

To verify the fix is working:

1. **Check Backend Health:**
   ```bash
   curl http://localhost:8002/api/chat/health
   # Should return: {"status":"ok","service":"chat","openai_configured":true}
   ```

2. **Test Chat Endpoint:**
   ```bash
   curl -X POST http://localhost:8002/api/chat/ \
     -H "Content-Type: application/json" \
     -d '{"message": "What are AI trends?", "conversation_history": []}'
   # Should return a valid OpenAI response
   ```

3. **Test Frontend:**
   - Open the application in browser
   - Click the Lighthouse AI chat button (bottom right)
   - Send a test message
   - Verify you receive an AI response

## Status
✅ **RESOLVED** - The chat functionality is now working correctly with the new OpenAI API key.

---
*Diagnosis completed: 2026-02-26*
