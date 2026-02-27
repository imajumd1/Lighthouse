# Complete Render Deployment Guide - Frontend + Backend

## 🚨 Current Issue

You have **only the frontend** deployed at `https://lighthouse-kl7m.onrender.com/`. The backend (FastAPI) is **not deployed**, which is why `/api/trends/discover` returns 404.

## ✅ Solution: Deploy Backend Separately

You need **TWO separate Render services**:
1. **Backend Service** (FastAPI/Python) - Runs the API
2. **Frontend Service** (Next.js) - Serves the website

## 🚀 Step-by-Step Deployment

### Part 1: Deploy Backend (FastAPI)

#### 1. Create New Web Service for Backend

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

**Service Settings:**
- **Name:** `lighthouse-backend` (or any name you prefer)
- **Region:** Same as frontend (for lower latency)
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** `Python 3`
- **Build Command:** `pip install --upgrade pip && pip install -r requirements.txt`
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

#### 2. Set Backend Environment Variables

In the backend service, add these environment variables:

| Key | Value | Notes |
|-----|-------|-------|
| `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Random 32+ char string | Generate with: `openssl rand -hex 32` |
| `OPENAI_API_KEY` | `sk-proj-...` | Your OpenAI API key |
| `APP_ENV` | `production` | Sets production mode |
| `CORS_ORIGINS` | `https://lighthouse-kl7m.onrender.com` | Your frontend URL |
| `PYTHON_VERSION` | `3.11.9` | Force Python 3.11.9 |

#### 3. Deploy Backend

Click **"Create Web Service"**. Render will:
- Build your backend
- Install dependencies
- Start the FastAPI server

**Your backend will be available at:** `https://lighthouse-backend.onrender.com` (or whatever name you chose)

#### 4. Verify Backend is Running

Visit these URLs (replace with your actual backend URL):
- `https://lighthouse-backend.onrender.com/` - Should show API info
- `https://lighthouse-backend.onrender.com/healthz` - Should return `{"status":"ok"}`
- `https://lighthouse-backend.onrender.com/docs` - Should show API documentation

### Part 2: Update Frontend Configuration

#### 1. Update Frontend Environment Variable

In your **existing frontend service** (`lighthouse-kl7m.onrender.com`):

1. Go to Render Dashboard → Frontend Service → Environment
2. Add/Update:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://lighthouse-backend.onrender.com/api/v1` (use your actual backend URL)

#### 2. Update Backend CORS

Go back to your **backend service** → Environment:

Update `CORS_ORIGINS` to include your frontend URL:
```
https://lighthouse-kl7m.onrender.com
```

#### 3. Redeploy Both Services

1. Backend: Click "Manual Deploy" → "Deploy latest commit"
2. Frontend: Click "Manual Deploy" → "Deploy latest commit"

### Part 3: Commit Code Changes

```bash
cd Lighthouse-fa269e70

# Add the frontend changes
git add frontend/context/AppContext.tsx frontend/.env.production

# Commit
git commit -m "Fix: Use environment variable for API URL to support separate backend deployment"

# Push
git push origin main
```

This will trigger automatic redeployment of both services.

## 🎯 Final Architecture

```
┌─────────────────────────────────────┐
│  Frontend (Next.js)                 │
│  https://lighthouse-kl7m.onrender.com│
│                                     │
│  - Serves website                   │
│  - Makes API calls to backend       │
└──────────────┬──────────────────────┘
               │
               │ API Calls
               │
               ▼
┌─────────────────────────────────────┐
│  Backend (FastAPI)                  │
│  https://lighthouse-backend.onrender.com│
│                                     │
│  - /api/trends/discover             │
│  - /api/chat                        │
│  - /api/v1/auth/*                   │
└─────────────────────────────────────┘
```

## 🔍 Verification Steps

### 1. Test Backend Directly

```bash
# Health check
curl https://lighthouse-backend.onrender.com/healthz

# Trends discovery
curl -X POST "https://lighthouse-backend.onrender.com/api/trends/discover?top_n=5" \
  -H "Content-Type: application/json"
```

Should return trends data (not 404).

### 2. Test Frontend

1. Visit `https://lighthouse-kl7m.onrender.com/`
2. Open browser console (F12)
3. Look for:
   ```
   [AppContext] API URL: https://lighthouse-backend.onrender.com/api/trends/discover
   [AppContext] ✅ Fetched trends from API: X trends
   ```

### 3. Check Network Tab

1. Open DevTools → Network tab
2. Refresh page
3. Look for request to `lighthouse-backend.onrender.com/api/trends/discover`
4. Status should be `200 OK`

## 🚨 Common Issues

### Issue: Backend goes to sleep (Free Tier)

**Symptom:** First request takes 30-60 seconds

**Solution:** 
- This is normal for Render free tier
- Backend spins down after 15 minutes of inactivity
- First request wakes it up
- Consider upgrading to paid tier for always-on service

### Issue: CORS errors

**Symptom:** Console shows "CORS policy" error

**Solution:**
1. Verify `CORS_ORIGINS` in backend includes frontend URL
2. Make sure there are no typos
3. Redeploy backend after changing CORS_ORIGINS

### Issue: Environment variable not loading

**Symptom:** Frontend still tries to call localhost

**Solution:**
1. Verify `NEXT_PUBLIC_API_URL` is set in frontend service
2. Clear build cache: Manual Deploy → "Clear build cache & deploy"
3. Environment variables are baked into build, so rebuild is required

## 📋 Deployment Checklist

### Backend Service
- [ ] Created new web service for backend
- [ ] Set root directory to `backend`
- [ ] Set build command: `pip install --upgrade pip && pip install -r requirements.txt`
- [ ] Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- [ ] Added all environment variables (MONGODB_URI, JWT_SECRET, OPENAI_API_KEY, etc.)
- [ ] Backend URL is accessible (e.g., `https://lighthouse-backend.onrender.com/`)
- [ ] `/healthz` endpoint returns success
- [ ] `/docs` endpoint shows API documentation

### Frontend Service
- [ ] Set `NEXT_PUBLIC_API_URL` to backend URL + `/api/v1`
- [ ] Committed code changes to Git
- [ ] Redeployed frontend service
- [ ] Frontend loads without errors
- [ ] Trending articles appear on homepage

### Integration
- [ ] Backend `CORS_ORIGINS` includes frontend URL
- [ ] Frontend can successfully call backend API
- [ ] No CORS errors in browser console
- [ ] Trends data loads from backend (not mock data)

## 💡 Alternative: Single Service with Proxy

If you want to keep everything on one domain, you could:

1. Deploy backend at `https://lighthouse-kl7m.onrender.com/`
2. Configure Next.js to proxy `/api/*` requests to the backend
3. This requires modifying `next.config.ts` with rewrites

However, **separate services is the recommended approach** for:
- Better separation of concerns
- Independent scaling
- Easier debugging
- Standard microservices architecture

## 📞 Need Help?

If you're still having issues after deploying the backend:

1. **Share backend URL** - What is your backend service URL?
2. **Check backend logs** - Any errors during startup?
3. **Test backend directly** - Does `/healthz` work?
4. **Check frontend console** - What errors do you see?

The key insight is that you need **two separate Render services** - one for frontend, one for backend. The frontend you have is working fine; you just need to deploy the backend separately.
