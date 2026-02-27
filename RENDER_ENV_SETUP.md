# Render Environment Variables Setup

## 🚨 Issue: Missing OPENAI_API_KEY

The error you're seeing:
```
pydantic_core._pydantic_core.ValidationError: 1 validation error for Settings
openai_api_key
  Field required [type=missing, input_value={...}, input_type=dict]
```

This means the `OPENAI_API_KEY` environment variable is **not set in Render**.

## Why Your Local .env File Doesn't Work on Render

- ✅ **Local Development:** Your `.env` file works locally
- ❌ **Render Deployment:** The `.env` file is NOT deployed (it's in `.gitignore` for security)
- ✅ **Solution:** Set environment variables in Render Dashboard

---

## 🔧 How to Fix: Add Environment Variables in Render

### Step 1: Go to Render Dashboard

1. Open [Render Dashboard](https://dashboard.render.com/)
2. Select your **backend web service** (lighthouse-backend or similar)
3. Click on **"Environment"** in the left sidebar

### Step 2: Add Required Environment Variables

Click **"Add Environment Variable"** and add each of these:

| Variable Name | Value | Where to Get It |
|---------------|-------|-----------------|
| `OPENAI_API_KEY` | `sk-...` | Your OpenAI API key from [platform.openai.com](https://platform.openai.com/api-keys) |
| `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Random secure string | Generate with: `openssl rand -hex 32` |
| `CORS_ORIGINS` | Your frontend URL | e.g., `https://your-frontend.onrender.com` |
| `APP_ENV` | `production` | Set to production for deployed environment |

### Step 3: Save and Redeploy

1. Click **"Save Changes"** at the bottom
2. Render will automatically redeploy your service
3. Watch the logs for successful startup

---

## 📋 Detailed Instructions for Each Variable

### 1. OPENAI_API_KEY

**Where to get it:**
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in to your account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. Paste it in Render

**Format:** `sk-proj-...` or `sk-...`

### 2. MONGODB_URI

**Where to get it:**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual database password

**Format:** `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`

### 3. JWT_SECRET

**Generate a secure random string:**

```bash
# On Mac/Linux
openssl rand -hex 32

# Or use Python
python3 -c "import secrets; print(secrets.token_hex(32))"
```

**Format:** Any long random string (64+ characters recommended)

### 4. CORS_ORIGINS

**Set to your frontend URL:**
- If frontend is on Render: `https://your-frontend-name.onrender.com`
- Multiple origins: `https://frontend1.com,https://frontend2.com`
- For testing: `*` (not recommended for production)

### 5. APP_ENV

**Set to:** `production`

This tells the app it's running in production mode.

---

## ✅ Verification

After adding all environment variables and redeploying, check the logs:

### Success Looks Like:
```
==> Running 'python main.py'
INFO:     Started server process [1]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:10000
```

### If Still Failing:

1. **Check variable names** - They must match exactly (case-sensitive)
2. **Check for typos** - Especially in MongoDB URI and API keys
3. **Verify API key is valid** - Test it locally first
4. **Check MongoDB IP whitelist** - Add `0.0.0.0/0` to allow Render's IPs

---

## 🔒 Security Best Practices

### ✅ DO:
- Store sensitive keys in Render's environment variables
- Use different keys for development and production
- Rotate keys regularly
- Use MongoDB Atlas IP whitelist (or allow all for Render)

### ❌ DON'T:
- Commit `.env` files to Git
- Share API keys in code or documentation
- Use the same keys across environments
- Hardcode secrets in your code

---

## 🐛 Troubleshooting

### Error: "MONGODB_URI field required"
**Solution:** Add `MONGODB_URI` environment variable in Render

### Error: "JWT_SECRET field required"
**Solution:** Add `JWT_SECRET` environment variable in Render

### Error: "Invalid API key"
**Solution:** 
1. Verify your OpenAI API key is correct
2. Check if you have credits in your OpenAI account
3. Make sure the key hasn't been revoked

### Error: "Connection refused" (MongoDB)
**Solution:**
1. Check MongoDB Atlas IP whitelist
2. Add `0.0.0.0/0` to allow all IPs (Render uses dynamic IPs)
3. Verify connection string format

---

## 📸 Screenshot Guide

### Where to Add Environment Variables in Render:

1. **Dashboard → Your Service → Environment**
2. Click **"Add Environment Variable"**
3. Enter **Key** and **Value**
4. Click **"Add"**
5. Repeat for all variables
6. Click **"Save Changes"** at the bottom

---

## 🚀 Quick Checklist

Before deploying, ensure you have:

- [ ] `OPENAI_API_KEY` - From OpenAI Platform
- [ ] `MONGODB_URI` - From MongoDB Atlas
- [ ] `JWT_SECRET` - Generated random string
- [ ] `CORS_ORIGINS` - Your frontend URL
- [ ] `APP_ENV` - Set to "production"
- [ ] MongoDB IP whitelist includes `0.0.0.0/0`
- [ ] OpenAI account has available credits

Once all are set, Render will automatically redeploy and your app should start successfully!
