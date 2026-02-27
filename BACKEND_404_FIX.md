# Backend 404 Error Fix - /api/trends/discover

## 🚨 Issue
The endpoint `https://lighthouse-kl7m.onrender.com/api/trends/discover` returns 404, even though:
- The backend is running (root endpoint works)
- The `trends.py` router file exists in Git
- Dependencies are in `requirements.txt`

## 🔍 Root Cause
The trends router is likely failing to load due to:
1. Missing or incorrect `OPENAI_API_KEY` environment variable
2. Import error in the trends router or its dependencies
3. The router not being properly included in `main.py`

## ✅ Solution

### Step 1: Check Render Backend Logs

1. Go to **Render Dashboard** → Your Backend Service
2. Click on **"Logs"** tab
3. Look for errors during startup, especially:
   ```
   ERROR: Could not import module 'routers.trends'
   ImportError: ...
   ModuleNotFoundError: ...
   ```

### Step 2: Verify Environment Variables

Make sure these are set in Render Dashboard → Environment:

| Variable | Required | Example |
|----------|----------|---------|
| `MONGODB_URI` | ✅ Yes | `mongodb+srv://user:pass@cluster.mongodb.net/lighthouse` |
| `JWT_SECRET` | ✅ Yes | Any random string (32+ chars) |
| `OPENAI_API_KEY` | ✅ Yes | `sk-proj-...` (your OpenAI API key) |
| `APP_ENV` | ✅ Yes | `production` |
| `CORS_ORIGINS` | ✅ Yes | `http://localhost:3000,https://lighthouse-kl7m.onrender.com` |

**Critical:** The `OPENAI_API_KEY` is required for the trends service to initialize. Without it, the trends router will fail to load.

### Step 3: Check Available Endpoints

Visit `https://lighthouse-kl7m.onrender.com/docs` in your browser. This shows all available API endpoints.

**If `/api/trends/discover` is NOT listed:**
- The trends router failed to load
- Check backend logs for import errors
- Verify `OPENAI_API_KEY` is set

**If `/api/trends/discover` IS listed:**
- The router loaded successfully
- Try accessing it with the correct method (POST, not GET)

### Step 4: Test with Correct HTTP Method

The `/api/trends/discover` endpoint requires a **POST** request, not GET.

**Testing in browser (won't work):**
```
https://lighthouse-kl7m.onrender.com/api/trends/discover
```
This gives 405 Method Not Allowed (or 404 if router not loaded)

**Testing with curl (correct):**
```bash
curl -X POST "https://lighthouse-kl7m.onrender.com/api/trends/discover?top_n=10&lookback_days=7" \
  -H "Content-Type: application/json"
```

**Testing in browser console:**
```javascript
fetch('https://lighthouse-kl7m.onrender.com/api/trends/discover?top_n=10&lookback_days=7', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
})
.then(r => r.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

### Step 5: Verify OpenAI API Key

The trends service requires a valid OpenAI API key. Test it:

```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_OPENAI_API_KEY"
```

If this returns an error, your API key is invalid or expired.

### Step 6: Check Simpler Endpoints First

Test these endpoints to isolate the issue:

1. **Trends Health Check:**
   ```
   https://lighthouse-kl7m.onrender.com/api/trends/health
   ```
   Should return: `{"status":"ok","service":"trends_scraper",...}`

2. **Trends Sources:**
   ```
   https://lighthouse-kl7m.onrender.com/api/trends/sources
   ```
   Should return: Information about configured sources

If these also return 404, the entire trends router isn't loading.

## 🔧 Common Fixes

### Fix 1: Missing OPENAI_API_KEY

**Symptom:** Backend logs show:
```
ValidationError: 1 validation error for Settings
openai_api_key
  Field required
```

**Solution:**
1. Go to Render Dashboard → Environment
2. Add `OPENAI_API_KEY` with your OpenAI API key
3. Redeploy the service

### Fix 2: Invalid OpenAI API Key

**Symptom:** Backend starts but trends endpoints return errors

**Solution:**
1. Verify your OpenAI API key is valid
2. Check it has sufficient credits
3. Update in Render Dashboard → Environment
4. Redeploy

### Fix 3: Import Error

**Symptom:** Backend logs show import errors

**Solution:**
1. Check all dependencies are in `requirements.txt`
2. Verify no typos in import statements
3. Make sure all `__init__.py` files exist in:
   - `backend/routers/`
   - `backend/services/`
   - `backend/scrapers/`

### Fix 4: Router Not Included

**Symptom:** No errors in logs, but endpoints don't exist

**Solution:**
Verify `backend/main.py` includes:
```python
from routers import auth, chat, trends

app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(trends.router)  # This line must be present
```

## 🎯 Expected Behavior

### Successful Startup Logs:
```
INFO:     Started server process [1]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:10000
```

### Successful API Response:
```bash
curl -X POST "https://lighthouse-kl7m.onrender.com/api/trends/discover?top_n=10"
```

Should return:
```json
{
  "trends": [...],
  "count": 10,
  "parameters": {
    "top_n": 10,
    "lookback_days": 7
  }
}
```

## 📋 Debugging Checklist

- [ ] Backend logs show no import errors
- [ ] `OPENAI_API_KEY` is set in Render environment
- [ ] OpenAI API key is valid (test with curl)
- [ ] `/docs` endpoint shows `/api/trends/discover` in the list
- [ ] `/api/trends/health` returns success
- [ ] Using POST method (not GET) to test the endpoint
- [ ] CORS_ORIGINS includes frontend URL
- [ ] All dependencies in `requirements.txt` are installed

## 🚀 Quick Fix Commands

### Commit and Deploy Changes:
```bash
cd Lighthouse-fa269e70

# Commit frontend changes
git add frontend/context/AppContext.tsx frontend/.env.production
git commit -m "Fix: Use environment variable for API URL"

# Push to trigger Render deployment
git push origin main
```

### Test Backend After Deployment:
```bash
# Test health
curl https://lighthouse-kl7m.onrender.com/healthz

# Test trends health
curl https://lighthouse-kl7m.onrender.com/api/trends/health

# Test trends discovery (POST method)
curl -X POST "https://lighthouse-kl7m.onrender.com/api/trends/discover?top_n=5&lookback_days=7" \
  -H "Content-Type: application/json"
```

## 📞 Next Steps

1. **Check Render logs** for the exact error message
2. **Verify OPENAI_API_KEY** is set and valid
3. **Visit /docs** to see which endpoints are available
4. **Test with POST method** (not GET)
5. **Share the error message** from logs if still not working

The most common issue is missing `OPENAI_API_KEY` environment variable, which prevents the trends service from initializing.
