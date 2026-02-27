# 🚀 Quick Deploy to Render - TL;DR

## The Problem
Render is using Python 3.14 → pydantic-core has no wheels → Rust compilation fails → deployment fails

## The Fix (30 seconds)

### 1. Clear Build Cache
- Go to Render Dashboard
- Click **"Manual Deploy" → "Clear build cache & deploy"**

### 2. Push Changes
```bash
cd Lighthouse-fa269e70
git add .
git commit -m "Fix: Force Python 3.11.9 for Render"
git push origin main
```

### 3. Set Environment Variables (if not already set)
In Render Dashboard:
- `MONGODB_URL` = Your MongoDB connection string
- `SECRET_KEY` = Random secure string
- `OPENAI_API_KEY` = Your OpenAI key

### 4. Wait for Build
Watch for: **"Using Python 3.11.9"** in logs ✅

---

## What Changed?

✅ Downgraded `pydantic` from 2.9.2 → 2.8.2 (better wheel support)  
✅ Created `backend/.python-version` file  
✅ Created `backend/render.yaml` config  
✅ Kept `backend/runtime.txt` at Python 3.11.9

---

## Success Looks Like This

```
==> Using Python 3.11.9  ✅
Collecting pydantic==2.8.2
  Using cached pydantic-2.8.2-py3-none-any.whl  ✅
==> Build successful ✅
INFO:     Uvicorn running on http://0.0.0.0:10000
```

---

## Still Failing?

1. **Clear cache again** (most common fix)
2. **Check Python version** in logs (must be 3.11.9, not 3.14)
3. **Verify files exist:**
   - `backend/runtime.txt`
   - `backend/.python-version`
   - `backend/render.yaml`

See [`RENDER_DEPLOYMENT_GUIDE.md`](./RENDER_DEPLOYMENT_GUIDE.md) for detailed troubleshooting.
