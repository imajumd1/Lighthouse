# Frontend Render Deployment Guide

## Issue
The live frontend at `https://lighthouse-kl7m.onrender.com/` is showing "No trends found" because it's trying to connect to the wrong backend API path.

## Root Cause
The frontend was configured to use `/api/v1` but the backend actually uses `/api` as the base path.

## Solution

### Step 1: Update Environment Variable in Render Dashboard

1. Go to your Render dashboard: https://dashboard.render.com/
2. Find your frontend service: `lighthouse-kl7m`
3. Click on the service to open its settings
4. Go to the **Environment** tab
5. Find or add the environment variable:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://lighthouse-backend-fc77.onrender.com/api`
   
   ⚠️ **Important**: Remove `/v1` from the end - it should be `/api` NOT `/api/v1`

6. Click **Save Changes**

### Step 2: Trigger Manual Redeploy

After updating the environment variable:

1. Go to the **Manual Deploy** section
2. Click **Deploy latest commit** or **Clear build cache & deploy**
3. Wait for the deployment to complete (usually 2-5 minutes)

### Step 3: Verify the Fix

Once deployed, visit: `https://lighthouse-kl7m.onrender.com/`

1. Open browser DevTools (F12) → Console tab
2. Look for logs like:
   ```
   [AppContext] Fetching trends from scraping API...
   [AppContext] API URL: https://lighthouse-backend-fc77.onrender.com/api/trends/discover
   ```
3. The frontend should now fetch trends from the backend

## Backend API Endpoints

Your backend is correctly configured at:
- **Base URL**: `https://lighthouse-backend-fc77.onrender.com`
- **API Endpoints**:
  - `/api/auth/*` - Authentication
  - `/api/chat/*` - AI Chat
  - `/api/trends/*` - Trends scraping and discovery
  - `/docs` - API documentation
  - `/healthz` - Health check

## Code Changes Already Made

The following files have been updated in the repository:

1. ✅ `frontend/lib/api.ts` - Updated API_BASE_URL
2. ✅ `frontend/context/AppContext.tsx` - Updated API_BASE_URL
3. ⚠️ `frontend/.env.production` - Updated but ignored by git (must be set in Render)

## Testing Locally

To test the changes locally before deploying:

```bash
cd Lighthouse-fa269e70/frontend
npm run dev
```

Then visit `http://localhost:3000` and check the browser console for API calls.

## Troubleshooting

### If trends still don't load:

1. **Check backend health**:
   - Visit: `https://lighthouse-backend-fc77.onrender.com/healthz`
   - Should return: `{"status":"ok","database":"connected"}`

2. **Check trends endpoint**:
   - Visit: `https://lighthouse-backend-fc77.onrender.com/api/trends/health`
   - Should return status about the scraping service

3. **Check CORS settings**:
   - The backend should allow requests from `https://lighthouse-kl7m.onrender.com`
   - Check backend environment variable: `CORS_ORIGINS`

4. **Check OpenAI configuration**:
   - The `/api/trends/discover` endpoint requires OpenAI API key
   - Verify `OPENAI_API_KEY` is set in backend environment variables

### If you see CORS errors:

Add your frontend URL to the backend's CORS_ORIGINS:

1. Go to backend service in Render dashboard
2. Add/update environment variable:
   - **Key**: `CORS_ORIGINS`
   - **Value**: `https://lighthouse-kl7m.onrender.com,https://lighthouse-backend-fc77.onrender.com`
3. Redeploy the backend

## Summary

✅ **Code changes**: Already pushed to GitHub
⚠️ **Action required**: Update `NEXT_PUBLIC_API_URL` in Render dashboard
🔄 **Next step**: Redeploy frontend on Render
