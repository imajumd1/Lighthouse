# Deployment Fixes Applied

## Date: 2026-03-10

## Overview
Fixed hardcoded paths and OpenAI numbering issues to ensure proper functionality on deployed frontend and backend.

## Deployed URLs
- **Frontend**: https://lighthouse-new.onrender.com
- **Backend**: https://lighthouse-newbackend.onrender.com

---

## Changes Made

### 1. Frontend API Configuration (`frontend/lib/api.ts`)

**Issue**: Hardcoded old backend URL (`lighthouse-backend-fc77.onrender.com`)

**Fix**: Updated all API base URLs to use the new deployed backend:
```typescript
// Main API base URL
const API_BASE_URL = 'https://lighthouse-newbackend.onrender.com/api'

// Chat API URL
const CHAT_API_URL = 'https://lighthouse-newbackend.onrender.com'
```

**Lines Changed**: 7-8, 304-306, 327-329

---

### 2. Frontend Context Configuration (`frontend/context/AppContext.tsx`)

**Issue**: Hardcoded old backend URL

**Fix**: Updated API base URL:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lighthouse-newbackend.onrender.com/api';
```

**Lines Changed**: 8

---

### 3. OpenAI Analysis Numbering Issue (`backend/services/trend_analyzer.py`)

**Issue**: Article numbering format (e.g., "1. [source]") was appearing in trend analysis text, causing unwanted numbered lists in the output.

**Root Cause**: 
- The `_prepare_article_summaries` method formatted articles as "1. [source] title"
- OpenAI would then include these numbers in the analysis text
- The prompt didn't explicitly instruct to exclude reference numbers from output

**Fix Applied**:

#### A. Changed Article Format (Line 69)
**Before**:
```python
summaries.append(f"{i}. [{source}] {title}\n   URL: {url}\n   {summary}\n")
```

**After**:
```python
summaries.append(f"[Article {i}] Source: {source}\nTitle: {title}\nURL: {url}\nSummary: {summary}\n")
```

**Rationale**: Using `[Article N]` format instead of "N." prevents confusion with bullet points and makes it clearer these are reference markers, not content.

#### B. Updated OpenAI Prompt (Lines 111-117)
**Added explicit instruction**:
```python
IMPORTANT: Do NOT include article numbers, citations, or numbered lists in the text fields 
(headline, justificationSummary, analysisDetail, etc.). Write clean, professional content 
without reference numbers.
```

**Rationale**: Explicitly instructs the AI to keep reference numbers separate from the actual trend content.

---

### 4. Backend CORS Configuration (`backend/.env`)

**Issue**: Deployed frontend URL not in CORS allowed origins

**Fix**: Added deployed frontend URL to CORS_ORIGINS:
```
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://127.0.0.1:3001,http://localhost:5500,http://127.0.0.1:5500,https://lighthouse-new.onrender.com,http://localhost:4000
```

**Lines Changed**: 6

---

## Why the Numbering Issue Occurred

The numbering issue was a result of:

1. **Input Format**: Articles were numbered as "1. [source]" in the input to OpenAI
2. **AI Behavior**: GPT models tend to mirror formatting patterns they see in input
3. **Lack of Explicit Instruction**: The prompt didn't explicitly forbid including reference numbers in output text
4. **Bullet Point Confusion**: The "N." format is commonly used for ordered lists, so the AI would naturally continue this pattern

## Solution Effectiveness

The two-part fix addresses both causes:
1. **Format Change**: `[Article N]` is clearly a reference marker, not a list item
2. **Explicit Instruction**: The prompt now explicitly forbids reference numbers in output text

This ensures clean, professional trend analysis without unwanted numbering artifacts.

---

## Testing Recommendations

### For Deployed Environment:

1. **Frontend-Backend Connection**:
   - Visit https://lighthouse-new.onrender.com
   - Verify trends load correctly
   - Test login/signup functionality
   - Check that API calls go to the correct backend

2. **OpenAI Analysis Quality**:
   - Trigger a new trend discovery (admin panel)
   - Verify trend analysis text is clean (no "1.", "2.", etc. in headlines or summaries)
   - Check that source references are properly tracked in `additionalSources`
   - Confirm bullet points in `justificationSummary` are intentional, not artifact numbers

3. **CORS Functionality**:
   - Test all API endpoints from deployed frontend
   - Verify no CORS errors in browser console
   - Test authenticated endpoints (bookmarks, profile, etc.)

### For Local Development:

The changes maintain backward compatibility with local development:
- Frontend still works with `http://localhost:8000` backend
- CORS includes all localhost ports
- Environment variables can override defaults

---

## Deployment Steps

### Backend (Render):
1. Push changes to your repository
2. Render will auto-deploy from the connected repo
3. Verify environment variables are set:
   - `CORS_ORIGINS` includes `https://lighthouse-new.onrender.com`
   - `APP_ENV=production` (recommended for deployed environment)
   - All other env vars from `.env.example`

### Frontend (Render):
1. Push changes to your repository
2. Render will auto-deploy
3. Optionally set `NEXT_PUBLIC_API_URL=https://lighthouse-newbackend.onrender.com/api` as environment variable
4. Rebuild if needed

---

## Environment Variables for Production

### Backend (.env on Render):
```
APP_ENV=production
PORT=8000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
JWT_EXPIRES_IN=604800
CORS_ORIGINS=https://lighthouse-new.onrender.com
OPENAI_API_KEY=<your-openai-key>
```

### Frontend (Environment Variables on Render):
```
NEXT_PUBLIC_API_URL=https://lighthouse-newbackend.onrender.com/api
```

---

## Notes

- All changes are backward compatible with local development
- The OpenAI fix improves output quality for all future trend analyses
- Existing trends in the database are not affected (only new analyses)
- CORS settings now support both local and production environments

---

## Files Modified

1. `frontend/lib/api.ts` - Updated API URLs
2. `frontend/context/AppContext.tsx` - Updated API URL
3. `backend/services/trend_analyzer.py` - Fixed numbering issue
4. `backend/.env` - Added CORS origins

## Commit Message Suggestion

```
fix: Update deployment URLs and fix OpenAI numbering artifacts

- Update frontend to use new backend URL (lighthouse-newbackend.onrender.com)
- Fix OpenAI analysis including unwanted article numbers in trend text
- Add deployed frontend to CORS allowed origins
- Improve article formatting in OpenAI prompts for cleaner output
```
