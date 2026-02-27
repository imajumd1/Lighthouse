# Final Deployment Steps - Connect Frontend to Backend

## ✅ Current Status

- ✅ Backend deployed: `https://lighthouse-backend-fc77.onrender.com`
- ✅ Frontend deployed: `https://lighthouse-kl7m.onrender.com`
- ✅ Code updated to use environment variables
- ⏳ Need to connect them together

## 🚀 Final Steps to Fix

### Step 1: Set Frontend Environment Variable in Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click on your **Frontend service** (`lighthouse-kl7m`)
3. Go to **"Environment"** tab
4. Click **"Add Environment Variable"**
5. Add:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://lighthouse-backend-fc77.onrender.com/api/v1`
6. Click **"Save Changes"**

### Step 2: Update Backend CORS Settings

1. Go to your **Backend service** (`lighthouse-backend-fc77`)
2. Go to **"Environment"** tab
3. Find or add `CORS_ORIGINS` variable
4. Set value to:
   ```
   http://localhost:3000,https://lighthouse-kl7m.onrender.com
   ```
5. Click **"Save Changes"**

### Step 3: Commit and Push Code Changes

```bash
cd Lighthouse-fa269e70

# Add the updated files
git add frontend/context/AppContext.tsx frontend/.env.production

# Commit
git commit -m "Fix: Configure frontend to use deployed backend API"

# Push to trigger automatic deployment
git push origin main
```

### Step 4: Manually Redeploy (If Needed)

If auto-deploy doesn't trigger:

**Backend:**
1. Go to backend service in Render
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

**Frontend:**
1. Go to frontend service in Render
2. Click **"Manual Deploy"** → **"Clear build cache & deploy"**
   - ⚠️ Use "Clear build cache" to ensure environment variables are picked up

### Step 5: Verify Backend is Working

Test these URLs in your browser:

1. **Backend Health:**
   ```
   https://lighthouse-backend-fc77.onrender.com/healthz
   ```
   Should return: `{"status":"ok","database":"connected"}`

2. **Backend API Docs:**
   ```
   https://lighthouse-backend-fc77.onrender.com/docs
   ```
   Should show FastAPI documentation with all endpoints

3. **Trends Health:**
   ```
   https://lighthouse-backend-fc77.onrender.com/api/trends/health
   ```
   Should return trends service status

4. **Trends Discovery (POST):**
   Open browser console and run:
   ```javascript
   fetch('https://lighthouse-backend-fc77.onrender.com/api/trends/discover?top_n=5', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' }
   })
   .then(r => r.json())
   .then(data => console.log(data))
   .catch(err => console.error(err));
   ```
   Should return trends data

### Step 6: Test Frontend

1. Visit `https://lighthouse-kl7m.onrender.com/`
2. Open browser console (F12)
3. Look for these messages:
   ```
   [AppContext] Fetching trends from scraping API...
   [AppContext] API URL: https://lighthouse-backend-fc77.onrender.com/api/trends/discover
   [AppContext] ✅ Fetched trends from API: X trends
   ```
4. Trending articles should now appear on the homepage!

## 🔍 Troubleshooting

### If backend returns 404 on /api/trends/discover

Check backend logs for errors:
1. Go to Render Dashboard → Backend Service → Logs
2. Look for:
   - Import errors
   - Missing `OPENAI_API_KEY` error
   - Any startup errors

**Most common fix:** Add `OPENAI_API_KEY` environment variable to backend service.

### If you see CORS errors in frontend console

1. Verify `CORS_ORIGINS` in backend includes: `https://lighthouse-kl7m.onrender.com`
2. Redeploy backend after changing CORS
3. Hard refresh frontend (Ctrl+Shift+R)

### If frontend still shows mock data

1. Check browser console for the API URL being used
2. Verify `NEXT_PUBLIC_API_URL` is set in frontend service
3. Clear build cache and redeploy frontend
4. Check Network tab to see if request is going to correct URL

### If backend is slow (30-60 seconds)

This is normal for Render free tier:
- Backend spins down after 15 minutes of inactivity
- First request wakes it up (takes 30-60 seconds)
- Subsequent requests are fast
- Consider upgrading to paid tier for always-on service

## ✅ Expected Result

After completing these steps:

1. **Frontend loads:** `https://lighthouse-kl7m.onrender.com/`
2. **Trending articles appear** (not the same 10 mock articles)
3. **Console shows:** `✅ Fetched trends from API: X trends`
4. **No errors** in browser console
5. **Articles are fresh** from the scraping API

## 📋 Quick Checklist

- [ ] `NEXT_PUBLIC_API_URL` set in frontend Render environment
- [ ] Value is: `https://lighthouse-backend-fc77.onrender.com/api/v1`
- [ ] `CORS_ORIGINS` in backend includes frontend URL
- [ ] Code changes committed and pushed
- [ ] Frontend redeployed with cleared cache
- [ ] Backend `/healthz` returns success
- [ ] Backend `/docs` shows API documentation
- [ ] Frontend console shows correct API URL
- [ ] Trending articles appear on homepage

## 🎉 Success Indicators

You'll know it's working when:
- ✅ Homepage shows trending articles
- ✅ Articles have recent dates
- ✅ Content changes when scraper runs
- ✅ No "Failed to fetch" errors in console
- ✅ Network tab shows successful API calls to backend

That's it! Once you set the `NEXT_PUBLIC_API_URL` environment variable in your frontend Render service and redeploy, everything should work.
