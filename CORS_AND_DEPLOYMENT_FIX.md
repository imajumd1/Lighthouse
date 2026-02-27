# Complete Fix: Trending Articles Not Showing

## 🚨 Critical Issues Found

### Issue 1: CORS Configuration
The backend is blocking requests from your frontend domain because it's not in the allowed CORS origins list.

### Issue 2: Environment Variable Configuration
The frontend needs the correct API URL set in Render's environment variables.

## ✅ Complete Solution

### Step 1: Update Backend CORS Origins in Render

1. **Go to Render Dashboard** → Your Backend Service
2. **Navigate to Environment tab**
3. **Add/Update the `CORS_ORIGINS` variable:**

```
CORS_ORIGINS=http://localhost:3000,https://lighthouse-kl7m.onrender.com,https://your-frontend-domain.onrender.com
```

**Important:** Replace `https://your-frontend-domain.onrender.com` with your actual frontend URL if it's different from the backend URL.

If your frontend is on the same domain as backend, use:
```
CORS_ORIGINS=http://localhost:3000,https://lighthouse-kl7m.onrender.com
```

4. **Save and redeploy** the backend service

### Step 2: Set Frontend Environment Variable in Render

1. **Go to Render Dashboard** → Your Frontend Service (if separate)
2. **Navigate to Environment tab**
3. **Add the `NEXT_PUBLIC_API_URL` variable:**

```
NEXT_PUBLIC_API_URL=https://lighthouse-kl7m.onrender.com/api/v1
```

4. **Save and redeploy** the frontend service

### Step 3: Verify Backend is Running

Check these endpoints in your browser:

1. **Health Check:**
   ```
   https://lighthouse-kl7m.onrender.com/healthz
   ```
   Should return: `{"status":"ok","database":"connected"}`

2. **Root Endpoint:**
   ```
   https://lighthouse-kl7m.onrender.com/
   ```
   Should return API info

3. **Trends Health:**
   ```
   https://lighthouse-kl7m.onrender.com/api/trends/health
   ```
   Should return trends service status

### Step 4: Test Trends API Directly

Open this URL in your browser (or use Postman):
```
https://lighthouse-kl7m.onrender.com/api/trends/sources
```

This should return information about configured trend sources.

## 🔍 Debugging Steps

### Check 1: Browser Console Errors

1. Open https://lighthouse-kl7m.onrender.com/
2. Open Developer Tools (F12)
3. Go to Console tab
4. Look for errors like:
   - `CORS policy: No 'Access-Control-Allow-Origin' header` → CORS issue
   - `Failed to fetch` → Network/API issue
   - `[AppContext] ❌ Error fetching trends` → API call failed

### Check 2: Network Tab

1. Open Developer Tools → Network tab
2. Refresh the page
3. Look for request to `/api/trends/discover`
4. Check:
   - **Request URL:** Should be `https://lighthouse-kl7m.onrender.com/api/trends/discover`
   - **Status:** Should be `200 OK` (not 404, 500, or CORS error)
   - **Response:** Should contain trends data

### Check 3: Backend Logs

1. Go to Render Dashboard → Backend Service → Logs
2. Look for:
   - Startup messages
   - CORS configuration logs
   - Any error messages
   - Incoming requests to `/api/trends/discover`

## 🎯 Expected Behavior After Fix

### Backend Logs Should Show:
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:10000
```

### Frontend Console Should Show:
```
[AppContext] Fetching trends from scraping API...
[AppContext] API URL: https://lighthouse-kl7m.onrender.com/api/trends/discover
[AppContext] ✅ Fetched trends from API: 10 trends
```

### Browser Should Display:
- Real trending articles (not the same 10 mock articles)
- Articles with recent dates
- Different content each time the scraper runs

## 🚨 Common Issues & Solutions

### Issue: "CORS policy" error in console

**Solution:**
1. Verify `CORS_ORIGINS` includes your frontend URL
2. Make sure there are no typos in the URL
3. Redeploy backend after changing CORS_ORIGINS
4. Clear browser cache and hard refresh (Ctrl+Shift+R)

### Issue: "Failed to fetch" error

**Solution:**
1. Check backend is running: Visit `https://lighthouse-kl7m.onrender.com/healthz`
2. Verify `NEXT_PUBLIC_API_URL` is set correctly
3. Check if backend went to sleep (Render free tier sleeps after inactivity)
4. Wait 30-60 seconds for backend to wake up, then refresh

### Issue: Still showing mock data

**Solution:**
1. Open browser console
2. Check if you see `⚠️ Falling back to MOCK_TRENDS`
3. This means the API call failed - check Network tab for the actual error
4. Verify environment variables are set correctly
5. Make sure you redeployed after setting environment variables

### Issue: Backend returns 404 for /api/trends/discover

**Solution:**
1. Check backend logs for startup errors
2. Verify `routers/trends.py` is included in `main.py`
3. Check if OpenAI API key is set (required for trends discovery)
4. Try the simpler endpoint first: `/api/trends/health`

## 📋 Environment Variables Checklist

### Backend Service (Render)
- ✅ `MONGODB_URI` - Your MongoDB connection string
- ✅ `JWT_SECRET` - Random secure string
- ✅ `OPENAI_API_KEY` - Your OpenAI API key
- ✅ `APP_ENV` - Set to `production`
- ✅ `CORS_ORIGINS` - Include your frontend URL
- ✅ `PORT` - Automatically set by Render

### Frontend Service (Render)
- ✅ `NEXT_PUBLIC_API_URL` - Backend URL with `/api/v1`

## 🔧 Alternative: Quick Test Without Frontend Redeploy

If you want to test without redeploying the frontend, you can temporarily modify the code in browser DevTools:

1. Open https://lighthouse-kl7m.onrender.com/
2. Open DevTools Console
3. Run:
```javascript
window.NEXT_PUBLIC_API_URL = 'https://lighthouse-kl7m.onrender.com/api/v1';
location.reload();
```

This will test if the API connection works. If trends appear, the issue is definitely the environment variable not being set.

## 📞 Still Not Working?

If after following all steps it still doesn't work, please check:

1. **What URL is your frontend deployed at?**
   - Is it the same as backend (`lighthouse-kl7m.onrender.com`)?
   - Or a different URL?

2. **What errors do you see in browser console?**
   - Copy the exact error message

3. **What do backend logs show?**
   - Any errors during startup?
   - Any incoming requests to `/api/trends/discover`?

4. **Can you access these URLs successfully?**
   - `https://lighthouse-kl7m.onrender.com/healthz`
   - `https://lighthouse-kl7m.onrender.com/api/trends/health`
   - `https://lighthouse-kl7m.onrender.com/api/trends/sources`

With this information, I can provide more specific guidance.
