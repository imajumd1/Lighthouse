# Render Deployment Guide - Complete Fix

## 🚨 Critical Issue: Python 3.14 + Pydantic Build Failure

### Error You're Seeing
```
error: failed to create directory `/usr/local/cargo/registry/cache/index.crates.io-1949cf8c6b5b557f`
Caused by: Read-only file system (os error 30)
💥 maturin failed
```

### Root Cause
Render is using Python 3.14, which doesn't have pre-compiled wheels for `pydantic-core`. This forces pip to compile from source using Rust, which fails due to read-only filesystem restrictions.

---

## ✅ Complete Solution (3-Part Fix)

### Changes Made

#### 1. **Downgraded Pydantic** (Better Compatibility)
```diff
# backend/requirements.txt
- pydantic==2.9.2
- pydantic-settings==2.6.0
+ pydantic==2.8.2
+ pydantic-settings==2.4.0
```

#### 2. **Created Python Version Files**
- `backend/runtime.txt` → `python-3.11.9`
- `backend/.python-version` → `3.11.9`

#### 3. **Created render.yaml Configuration**
Infrastructure-as-code file that explicitly sets Python 3.11.9

---

## 🚀 Deployment Steps

### Step 1: Clear Build Cache (CRITICAL!)

**You MUST do this first, or Render will keep using Python 3.14:**

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Select your web service
3. Click **"Manual Deploy"** dropdown
4. Select **"Clear build cache & deploy"**

### Step 2: Commit and Push Changes

```bash
cd Lighthouse-fa269e70

# Check what changed
git status

# Add all changes
git add backend/requirements.txt backend/runtime.txt backend/.python-version backend/render.yaml

# Commit
git commit -m "Fix: Force Python 3.11.9 and downgrade pydantic for Render compatibility"

# Push to your repository
git push origin main
```

### Step 3: Configure Environment Variables

In Render Dashboard, ensure these environment variables are set:

| Variable | Value | Notes |
|----------|-------|-------|
| `MONGODB_URL` | `mongodb+srv://...` | Your MongoDB Atlas connection string |
| `SECRET_KEY` | Random secure string | Generate with: `openssl rand -hex 32` |
| `OPENAI_API_KEY` | `sk-...` | Your OpenAI API key |
| `APP_ENV` | `production` | Already set in render.yaml |
| `PYTHON_VERSION` | `3.11.9` | Already set in render.yaml |

### Step 4: Verify Deployment Settings

In Render Dashboard → Your Service → Settings:

- **Root Directory:** `backend`
- **Build Command:** `pip install --upgrade pip && pip install -r requirements.txt`
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Step 5: Deploy

After pushing to Git, Render will auto-deploy. Watch the build logs for:

```
==> Using Python 3.11.9  ✅
==> Installing dependencies from requirements.txt
Collecting pydantic==2.8.2
  Using cached pydantic-2.8.2-py3-none-any.whl  ✅
Collecting pydantic-core
  Using cached pydantic_core-2.20.1-cp311-cp311-manylinux_2_17_x86_64.whl  ✅
```

**Key Success Indicator:** Look for "Using cached" with `.whl` files, NOT "Building wheel" or "maturin"

---

## 🔍 Troubleshooting

### Issue: Still seeing Python 3.14 in logs

**Solution:**
1. Clear build cache again (Step 1)
2. Verify `runtime.txt` is in the `backend/` directory
3. Check for typos in `runtime.txt` (must be exactly `python-3.11.9`)

### Issue: Build succeeds but app crashes

**Check these:**

1. **MongoDB Connection:**
   ```bash
   # In Render Shell
   echo $MONGODB_URL
   ```
   Should show your connection string

2. **Missing Environment Variables:**
   - Verify all variables from Step 3 are set
   - Check for typos in variable names

3. **Port Configuration:**
   - Start command MUST use `$PORT` (not hardcoded 8000)
   - Render assigns a dynamic port

### Issue: "Module not found" errors

**Solution:**
```bash
# In Render Shell, verify installation
pip list | grep -E "fastapi|pydantic|motor"
```

If packages are missing, rebuild with cleared cache.

---

## 📋 Files Created/Modified

### New Files
- ✅ `backend/.python-version` - Pyenv/build system fallback
- ✅ `backend/render.yaml` - Infrastructure-as-code config

### Modified Files
- ✅ `backend/requirements.txt` - Downgraded pydantic versions
- ✅ `backend/runtime.txt` - Already existed, kept at Python 3.11.9

---

## 🎯 Why This Works

| Problem | Solution | Result |
|---------|----------|--------|
| Python 3.14 too new | Force 3.11.9 via multiple methods | Stable Python version |
| No pydantic wheels | Downgrade to 2.8.2 | Pre-built wheels available |
| Rust compilation fails | Use wheels instead | No compilation needed |
| Config not applied | Clear build cache | Fresh build with new config |

---

## ✨ Expected Build Output

```
==> Building...
==> Using Python 3.11.9
==> Running 'pip install --upgrade pip && pip install -r requirements.txt'
Requirement already satisfied: pip in /opt/render/project/src/.venv/lib/python3.11/site-packages (25.3)
Collecting fastapi==0.115.0
  Using cached fastapi-0.115.0-py3-none-any.whl (94 kB)
Collecting pydantic==2.8.2
  Using cached pydantic-2.8.2-py3-none-any.whl (423 kB)
Collecting pydantic-core
  Using cached pydantic_core-2.20.1-cp311-cp311-manylinux_2_17_x86_64.whl (2.1 MB)
...
Successfully installed fastapi-0.115.0 pydantic-2.8.2 pydantic-core-2.20.1 ...
==> Build successful ✅
==> Starting service
INFO:     Started server process [1]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:10000 (Press CTRL+C to quit)
```

---

## 🔗 Quick Links

- [Render Python Docs](https://render.com/docs/python-version)
- [Pydantic Installation](https://docs.pydantic.dev/latest/install/)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/render/)

---

## 📞 Still Having Issues?

If deployment still fails after following all steps:

1. **Check the exact error message** in Render logs
2. **Verify Python version** in build output (should be 3.11.9)
3. **Confirm all files are committed** and pushed to Git
4. **Try manual deploy** with cleared cache one more time

The most common issue is forgetting to clear the build cache, which causes Render to use cached Python 3.14.
