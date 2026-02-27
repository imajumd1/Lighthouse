# Frontend Deployment Fix - Trending Articles Not Showing

## 🚨 Issue
Trending articles are not appearing on the deployed site (https://lighthouse-kl7m.onrender.com/) because the frontend is trying to fetch from `localhost:8000` instead of the production backend URL.

## 🔍 Root Cause
The [`AppContext.tsx`](frontend/context/AppContext.tsx) file had a hardcoded `http://localhost:8000` URL for fetching trends, which only works in local development.

## ✅ Fix Applied

### 1. Updated AppContext.tsx
Modified the trends fetching logic to use environment variables:

```typescript
// Get API base URL from environment or default to localhost
const API_BASE_URL = typeof window !== 'undefined'
  ? (window as any).NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8000'
  : 'http://localhost:8000';

// Use dynamic URL in fetch
const response = await fetch(`${API_BASE_URL}/api/trends/discover?top_n=10&lookback_days=7`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### 2. Created Production Environment File
Created `.env.production` with the correct backend URL:

```bash
NEXT_PUBLIC_API_URL=https://lighthouse-kl7m.onrender.com/api/v1
```

## 🚀 Deployment Steps

### For Vercel Deployment

1. **Set Environment Variable in Vercel Dashboard:**
   - Go to your Vercel project settings
   - Navigate to "Environment Variables"
   - Add:
     - **Name:** `NEXT_PUBLIC_API_URL`
     - **Value:** `https://lighthouse-kl7m.onrender.com/api/v1`
     - **Environment:** Production (and Preview if needed)

2. **Redeploy:**
   ```bash
   # Commit the changes
   git add frontend/context/AppContext.tsx frontend/.env.production
   git commit -m "Fix: Use environment variable for API URL in production"
   git push origin main
   ```

3. **Verify:**
   - Check Vercel deployment logs
   - Visit your deployed site
   - Open browser console and look for: `[AppContext] API URL: https://lighthouse-kl7m.onrender.com/api/trends/discover`
   - Trending articles should now appear

### For Render Frontend Deployment

If you're deploying the frontend on Render:

1. **Set Environment Variable:**
   - Go to Render Dashboard → Your Frontend Service
   - Navigate to "Environment" tab
   - Add:
     - **Key:** `NEXT_PUBLIC_API_URL`
     - **Value:** `https://lighthouse-kl7m.onrender.com/api/v1`

2. **Trigger Redeploy:**
   - Click "Manual Deploy" → "Deploy latest commit"

### For Other Platforms (Netlify, AWS, etc.)

Set the environment variable `NEXT_PUBLIC_API_URL=https://lighthouse-kl7m.onrender.com/api/v1` in your platform's environment configuration.

## 🔍 Troubleshooting

### Issue: Still seeing "No trends found"

**Check 1: Verify Environment Variable**
```bash
# In browser console on deployed site
console.log(window.NEXT_PUBLIC_API_URL)
```
Should output: `https://lighthouse-kl7m.onrender.com/api/v1`

**Check 2: Check Network Tab**
- Open browser DevTools → Network tab
- Look for request to `/api/trends/discover`
- Verify it's going to `https://lighthouse-kl7m.onrender.com` (not localhost)

**Check 3: CORS Issues**
If you see CORS errors in console:
```bash
# Update backend CORS settings in backend/main.py
origins = [
    "http://localhost:3000",
    "https://your-frontend-domain.vercel.app",  # Add your frontend URL
    "https://lighthouse-kl7m.onrender.com",
]
```

**Check 4: Backend Health**
Test the backend directly:
```bash
curl -X POST https://lighthouse-kl7m.onrender.com/api/trends/discover?top_n=10&lookback_days=7
```

Should return JSON with trends data.

### Issue: Environment variable not loading

**Next.js requires `NEXT_PUBLIC_` prefix** for client-side variables:
- ✅ `NEXT_PUBLIC_API_URL` - Works in browser
- ❌ `API_URL` - Only works server-side

**Rebuild required:**
Environment variables are baked into the build. After changing them, you must:
1. Clear build cache (if available)
2. Trigger a new deployment

## 📋 Files Modified

- ✅ `frontend/context/AppContext.tsx` - Added dynamic API URL
- ✅ `frontend/.env.production` - Created production config
- ✅ `frontend/.env.local` - Already existed for local dev

## 🎯 Expected Behavior

### Before Fix
- Frontend tries to fetch from `http://localhost:8000/api/trends/discover`
- Request fails (localhost not accessible in production)
- Falls back to mock data (10 hardcoded trends)
- Console shows: `❌ Error fetching trends from API`

### After Fix
- Frontend fetches from `https://lighthouse-kl7m.onrender.com/api/trends/discover`
- Request succeeds
- Real trends from scraping API are displayed
- Console shows: `✅ Fetched trends from API: X trends`

## 🔗 Related Files

- [`frontend/context/AppContext.tsx`](frontend/context/AppContext.tsx) - Main context with API calls
- [`frontend/lib/api.ts`](frontend/lib/api.ts) - API client (already uses env vars correctly)
- [`frontend/.env.local`](frontend/.env.local) - Local development config
- [`frontend/.env.production`](frontend/.env.production) - Production config

## ✨ Testing Locally

To test the production configuration locally:

```bash
cd frontend

# Build with production env
npm run build

# Start production server
npm start

# Visit http://localhost:3000
# Should fetch from production backend
```

## 📞 Still Having Issues?

1. **Check backend is running:**
   ```bash
   curl https://lighthouse-kl7m.onrender.com/api/trends/health
   ```

2. **Verify environment variable in build logs:**
   Look for `NEXT_PUBLIC_API_URL` in your deployment platform's build logs

3. **Check browser console:**
   Should see `[AppContext] API URL: https://lighthouse-kl7m.onrender.com/api/trends/discover`

4. **Test API directly:**
   ```bash
   curl -X POST "https://lighthouse-kl7m.onrender.com/api/trends/discover?top_n=10&lookback_days=7" \
     -H "Content-Type: application/json"
   ```

The fix ensures the frontend dynamically uses the correct API URL based on the environment, allowing it to work in both local development and production deployments.
