# 🚀 How to Run the Lighthouse Frontend

## Current Situation

✅ **Backend is running:** http://localhost:8002  
❌ **Frontend is not running:** Node.js is required but not installed

---

## Option 1: Install Node.js (Recommended for Full App)

### Step 1: Install Node.js
Visit: https://nodejs.org/

Download and install the **LTS version** (Long Term Support)

### Step 2: Verify Installation
Open a new terminal and run:
```bash
node --version
npm --version
```

You should see version numbers like:
```
v20.x.x
10.x.x
```

### Step 3: Install Frontend Dependencies
```bash
cd Lighthouse-fa269e70/frontend
npm install
```

### Step 4: Start the Frontend
```bash
npm run dev
```

### Step 5: Access the App
Open your browser to: **http://localhost:3000**

---

## Option 2: Test Without Node.js (Quick Test)

You can test the backend API right now without installing Node.js!

### Method A: Use the Interactive Test Page
1. Open this file in your browser:
   ```
   Lighthouse-fa269e70/test_frontend_integration.html
   ```
2. Click "Check Backend Health"
3. Test signup, login, and other features

### Method B: Use the API Documentation
1. Open in your browser: http://localhost:8002/docs
2. This is an interactive Swagger UI
3. You can test all API endpoints directly

### Method C: Use curl Commands
```bash
# Test health check
curl http://localhost:8002/healthz

# Test signup
curl -X POST http://localhost:8002/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Test login
curl -X POST http://localhost:8002/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## What's Currently Working

✅ Backend API on port 8002  
✅ Database connected  
✅ Authentication endpoints  
✅ API documentation  
✅ Test tools  

❌ Frontend Next.js app (needs Node.js)

---

## Quick Install Node.js (macOS)

### Using Homebrew (if installed):
```bash
brew install node
```

### Using Official Installer:
1. Go to https://nodejs.org/
2. Download the macOS installer
3. Run the installer
4. Restart your terminal
5. Verify: `node --version`

---

## After Installing Node.js

```bash
# Navigate to frontend directory
cd Lighthouse-fa269e70/frontend

# Install dependencies (one time only)
npm install

# Start the development server
npm run dev
```

Then visit: **http://localhost:3000**

---

## Troubleshooting

### "npm: command not found"
- Node.js is not installed or not in your PATH
- Install Node.js from https://nodejs.org/
- Restart your terminal after installation

### "Port 3000 already in use"
- Another app is using port 3000
- Stop the other app or use a different port:
  ```bash
  npm run dev -- -p 3001
  ```

### Frontend shows errors
- Make sure backend is running on port 8002
- Check that you ran `npm install` first
- Clear browser cache and reload

---

## Summary

**To see the full app with UI:**
1. Install Node.js from https://nodejs.org/
2. Run `cd Lighthouse-fa269e70/frontend && npm install`
3. Run `npm run dev`
4. Visit http://localhost:3000

**To test the backend now (without Node.js):**
- Open `test_frontend_integration.html` in your browser
- Or visit http://localhost:8002/docs
