# Render Deployment Fix

## Problem Diagnosis

### Error Summary
The build was failing with:
```
error: failed to create directory `/usr/local/cargo/registry/cache/index.crates.io-1949cf8c6b5b557f`
Caused by: Read-only file system (os error 30)
```

### Root Cause Analysis

**Primary Issue: Python 3.14 Incompatibility**

The Render environment was using Python 3.14, which is too new. The `pydantic-core` package (required by `pydantic==2.9.2`) doesn't have pre-compiled binary wheels for Python 3.14 yet.

**Why This Caused the Build to Fail:**

1. Without pre-built wheels, pip attempts to build `pydantic-core` from source
2. `pydantic-core` is written in Rust and requires the Rust toolchain (Cargo) to compile
3. During compilation, Cargo tries to write to its cache directory at `/usr/local/cargo/registry/`
4. Render's build environment has this directory mounted as read-only for security
5. The write operation fails with "Read-only file system (os error 30)"

**Secondary Contributing Factors:**
- Render's restricted filesystem permissions in build containers
- Missing or incomplete Rust toolchain configuration
- No fallback mechanism when binary wheels are unavailable

## Solution Implemented

### 1. Created `runtime.txt`

**File:** `backend/runtime.txt`
```
python-3.11.9
```

**Why This Fixes It:**
- Python 3.11 is a stable, well-supported version
- All dependencies in `requirements.txt` have pre-built binary wheels for Python 3.11
- No source compilation required → no Rust/Cargo needed → no filesystem write issues
- Faster build times (binary wheels install in seconds vs. minutes of compilation)

### 2. Verification Steps

After deploying with this fix, verify:

```bash
# Check Python version in Render logs
python --version  # Should show Python 3.11.9

# Verify pydantic-core installs from wheel
pip install pydantic-core==2.23.4 --verbose
# Should show: "Using cached pydantic_core-2.23.4-cp311-cp311-manylinux_*.whl"
```

## Deployment Instructions

### For Render Web Service

1. **Ensure `runtime.txt` is in the backend directory:**
   ```
   backend/runtime.txt
   ```

2. **Configure Render Service Settings:**
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python main.py`

3. **Environment Variables (Set in Render Dashboard):**
   ```
   MONGODB_URL=<your-mongodb-atlas-connection-string>
   SECRET_KEY=<your-secret-key>
   OPENAI_API_KEY=<your-openai-api-key>
   ```

4. **Deploy:**
   - Push changes to your Git repository
   - Render will automatically detect the new `runtime.txt` and rebuild

### Alternative: Using render.yaml

If you prefer infrastructure-as-code, create `render.yaml` in the project root:

```yaml
services:
  - type: web
    name: lighthouse-backend
    env: python
    region: oregon
    plan: free
    rootDir: backend
    buildCommand: pip install -r requirements.txt
    startCommand: python main.py
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.9
      - key: MONGODB_URL
        sync: false
      - key: SECRET_KEY
        generateValue: true
      - key: OPENAI_API_KEY
        sync: false
```

## Additional Optimizations

### 1. Pin All Dependencies

Consider pinning all transitive dependencies to avoid future compatibility issues:

```bash
# Generate a complete lock file
pip freeze > requirements-lock.txt
```

### 2. Add Build Cache

Speed up subsequent builds by caching pip packages:

**In Render Dashboard:**
- Enable "Auto-Deploy" for faster iterations
- Use "Build Cache" if available in your plan

### 3. Health Check Endpoint

Ensure your FastAPI app has a health check:

```python
# In main.py
@app.get("/health")
async def health_check():
    return {"status": "healthy"}
```

Configure in Render:
- **Health Check Path:** `/health`

### 4. Optimize Requirements

Consider splitting requirements for faster builds:

**requirements-base.txt:**
```
fastapi==0.115.0
uvicorn[standard]==0.32.0
motor==3.6.0
pydantic==2.9.2
pydantic-settings==2.6.0
```

**requirements.txt:**
```
-r requirements-base.txt
python-jose[cryptography]==3.3.0
passlib[argon2]==1.7.4
# ... rest of dependencies
```

## Troubleshooting

### If Build Still Fails

1. **Check Python Version in Logs:**
   ```
   Look for: "Python 3.11.9" in build output
   ```

2. **Verify runtime.txt Location:**
   - Must be in the same directory as requirements.txt
   - Must be named exactly `runtime.txt` (lowercase)

3. **Check for Typos:**
   - Format: `python-X.Y.Z` (with hyphens)
   - No extra spaces or newlines

4. **Clear Build Cache:**
   - In Render Dashboard: Manual Deploy → Clear build cache

### If Deployment Succeeds but App Crashes

1. **Check Environment Variables:**
   ```bash
   # In Render Shell
   echo $MONGODB_URL
   echo $SECRET_KEY
   ```

2. **Check Logs:**
   - Look for MongoDB connection errors
   - Verify all required env vars are set

3. **Test Locally with Same Python Version:**
   ```bash
   pyenv install 3.11.9
   pyenv local 3.11.9
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

## Why Not Use Docker?

While Docker would give more control, using Render's native Python support is simpler:

**Pros of Native Python:**
- ✅ Faster builds (no Docker layer caching needed)
- ✅ Automatic Python version management
- ✅ Built-in pip caching
- ✅ Simpler configuration

**When to Use Docker:**
- Need system-level dependencies (e.g., specific C libraries)
- Require exact environment replication
- Complex multi-service setup

## Success Indicators

After deploying, you should see:

```
==> Building...
==> Using Python 3.11.9
==> Installing dependencies from requirements.txt
Collecting fastapi==0.115.0
  Using cached fastapi-0.115.0-py3-none-any.whl
Collecting pydantic==2.9.2
  Using cached pydantic-2.9.2-py3-none-any.whl
Collecting pydantic-core==2.23.4
  Using cached pydantic_core-2.23.4-cp311-cp311-manylinux_2_17_x86_64.whl ✅
...
==> Build successful
==> Starting service
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:10000
```

Key indicator: **"Using cached pydantic_core-2.23.4-cp311-cp311-manylinux_*.whl"** (not building from source)

## Related Documentation

- [Render Python Version Docs](https://render.com/docs/python-version)
- [Pydantic Installation Guide](https://docs.pydantic.dev/latest/install/)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/render/)

## Summary

The fix is simple: **Use Python 3.11 instead of 3.14** by adding a `runtime.txt` file. This ensures all dependencies install from pre-built wheels, avoiding the Rust compilation issue entirely.
