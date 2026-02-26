# Backend Development Plan — Lighthouse AI Trends Platform

---

## 1️⃣ Executive Summary

**What Will Be Built:**
- FastAPI backend (Python 3.13, async) serving REST API at `/api/v1/*`
- MongoDB Atlas database for users, trends, bookmarks, and verticals
- JWT-based authentication with Argon2 password hashing
- Admin content management endpoints for trend curation
- User bookmark management and profile operations
- Search and filter capabilities for trends

**Why:**
- Frontend requires live backend to replace mock data in [`AppContext.tsx`](Lighthouse-fa269e70/frontend/context/AppContext.tsx:1)
- PRD specifies admin-curated "Top Ten" AI trends feed with user authentication and bookmarking
- Consulting professionals need reliable, persistent data for market intelligence

**Constraints:**
- **Backend:** FastAPI with Python 3.13 (async)
- **Database:** MongoDB Atlas only (no local instance) using Motor driver and Pydantic v2
- **No Docker** — local development setup
- **Testing:** Manual via frontend UI after every task
- **Git:** Single branch `main` only
- **Background tasks:** Synchronous by default; use `BackgroundTasks` only if strictly necessary
- **API base:** `/api/v1/*`

**Sprint Structure:**
- **S0:** Environment setup, MongoDB Atlas connection, Git initialization, frontend integration
- **S1:** Authentication (signup, login, logout, JWT)
- **S2:** Trends CRUD (admin-only create/update/archive, public read with filters)
- **S3:** Bookmarks (create, delete, list user bookmarks)
- **S4:** User profile management (view, update, delete account)
- **S5:** Admin dashboard features (trend management, metadata fetch simulation)

---

## 2️⃣ In-Scope & Success Criteria

**In-Scope Features:**
- User registration, login, logout with JWT tokens
- User profile view and update
- Admin role-based access control
- Trend listing with search (title, summary) and filter (vertical, status)
- Trend detail view by ID
- Admin trend creation with all fields from [`types.ts`](Lighthouse-fa269e70/frontend/lib/types.ts:38)
- Admin trend update and archive
- User bookmark create/delete
- User saved trends list
- Verticals as predefined configuration data
- CORS enabled for frontend origin

**Success Criteria:**
- All frontend pages functional with live backend data
- Authentication flow works (register → login → protected routes → logout)
- Admin can create, edit, and archive trends via [`/admin`](Lighthouse-fa269e70/frontend/app/admin/page.tsx:1)
- Users can bookmark trends and view saved collection
- Search and filter return accurate results in real-time
- All task-level manual tests pass via UI
- Code pushed to `main` after each sprint verification

---

## 3️⃣ API Design

**Base Path:** `/api/v1`

**Error Envelope:**
```json
{ "error": "Descriptive error message" }
```

**Authentication:**
- JWT token in `Authorization: Bearer <token>` header
- Token expires based on `JWT_EXPIRES_IN` env var

---

### **Health Check**

**`GET /healthz`**
- **Purpose:** Verify backend is running and MongoDB Atlas connection is healthy
- **Response:** `{ "status": "ok", "database": "connected" }`
- **Validation:** Performs MongoDB ping

---

### **Authentication Endpoints**

**`POST /api/v1/auth/signup`**
- **Purpose:** Register new user account
- **Request:** `{ "name": "string", "email": "string", "password": "string" }`
- **Response:** `{ "user": { "id": "string", "name": "string", "email": "string", "role": "user" }, "token": "string" }`
- **Validation:** Email unique, password min 8 chars, name min 2 chars

**`POST /api/v1/auth/login`**
- **Purpose:** Authenticate user and issue JWT
- **Request:** `{ "email": "string", "password": "string" }`
- **Response:** `{ "user": { "id": "string", "name": "string", "email": "string", "role": "user|admin" }, "token": "string" }`
- **Validation:** Email exists, password matches hashed value

**`POST /api/v1/auth/logout`**
- **Purpose:** Client-side token invalidation (no server-side session)
- **Request:** None (token in header)
- **Response:** `{ "message": "Logged out successfully" }`
- **Validation:** Valid JWT required

**`GET /api/v1/auth/me`**
- **Purpose:** Get current authenticated user details
- **Request:** None (token in header)
- **Response:** `{ "id": "string", "name": "string", "email": "string", "role": "user|admin", "avatar": "string?" }`
- **Validation:** Valid JWT required

---

### **Trends Endpoints**

**`GET /api/v1/trends`**
- **Purpose:** List trends with optional filters
- **Query Params:** `status` (current|archived, default: current), `search` (text), `vertical` (vertical ID), `limit` (default: 50)
- **Response:** `{ "trends": [ { ...Trend } ] }`
- **Validation:** Public access, no auth required

**`GET /api/v1/trends/:id`**
- **Purpose:** Get single trend by ID
- **Response:** `{ ...Trend }`
- **Validation:** Public access, trend must exist

**`POST /api/v1/trends`**
- **Purpose:** Create new trend (admin only)
- **Request:** Full Trend object (see Data Model section)
- **Response:** `{ ...Trend }` with generated `id`, `dateAdded`, `author`
- **Validation:** Admin role required, all required fields present, at least one vertical

**`PUT /api/v1/trends/:id`**
- **Purpose:** Update existing trend (admin only)
- **Request:** Full Trend object
- **Response:** `{ ...Trend }`
- **Validation:** Admin role required, trend exists

**`PATCH /api/v1/trends/:id/archive`**
- **Purpose:** Archive trend (admin only)
- **Response:** `{ ...Trend }` with `status: "archived"`
- **Validation:** Admin role required, trend exists

---

### **Bookmarks Endpoints**

**`POST /api/v1/bookmarks`**
- **Purpose:** Bookmark a trend
- **Request:** `{ "trendId": "string" }`
- **Response:** `{ "id": "string", "userId": "string", "trendId": "string", "createdAt": "ISO8601" }`
- **Validation:** Auth required, trend exists, no duplicate bookmark

**`DELETE /api/v1/bookmarks/:trendId`**
- **Purpose:** Remove bookmark by trend ID
- **Response:** `{ "message": "Bookmark removed" }`
- **Validation:** Auth required, bookmark exists for user

**`GET /api/v1/bookmarks`**
- **Purpose:** List current user's bookmarks with full trend data
- **Response:** `{ "bookmarks": [ { "id": "string", "trend": { ...Trend }, "createdAt": "ISO8601" } ] }`
- **Validation:** Auth required

---

### **User Profile Endpoints**

**`GET /api/v1/users/me`**
- **Purpose:** Get current user profile (same as `/auth/me`)
- **Response:** `{ "id": "string", "name": "string", "email": "string", "role": "user|admin", "avatar": "string?" }`
- **Validation:** Auth required

**`PUT /api/v1/users/me`**
- **Purpose:** Update current user profile
- **Request:** `{ "name": "string?", "email": "string?" }`
- **Response:** `{ ...User }`
- **Validation:** Auth required, email unique if changed

**`DELETE /api/v1/users/me`**
- **Purpose:** Soft delete user account
- **Response:** `{ "message": "Account deleted" }`
- **Validation:** Auth required, cascades to bookmarks

---

### **Verticals Endpoints**

**`GET /api/v1/verticals`**
- **Purpose:** List all predefined verticals
- **Response:** `{ "verticals": [ { "id": "string", "name": "string", "slug": "string", "color": "string" } ] }`
- **Validation:** Public access

---

## 4️⃣ Data Model (MongoDB Atlas)

**Database Name:** `lighthouse_db`

---

### **Collection: `users`**

**Fields:**
- `_id` (ObjectId) — MongoDB auto-generated
- `name` (string, required) — User full name
- `email` (string, required, unique) — User email address
- `password_hash` (string, required) — Argon2 hashed password
- `role` (string, required, default: "user") — "user" or "admin"
- `avatar` (string, optional) — Avatar URL
- `created_at` (datetime, required) — Account creation timestamp
- `updated_at` (datetime, required) — Last update timestamp
- `deleted_at` (datetime, optional) — Soft delete timestamp

**Example Document:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Marcus Partner",
  "email": "marcus@consulting.com",
  "password_hash": "$argon2id$v=19$m=65536...",
  "role": "user",
  "avatar": "https://i.pravatar.cc/150?u=marcus",
  "created_at": "2023-10-15T10:00:00Z",
  "updated_at": "2023-10-15T10:00:00Z"
}
```

---

### **Collection: `trends`**

**Fields:**
- `_id` (ObjectId) — MongoDB auto-generated
- `title` (string, required) — Internal title
- `headline` (string, required) — Executive summary headline (10 words max)
- `trend_category` (string, required) — One of: Capability, Enterprise Adoption, Infrastructure, Regulation, Capital Markets, Competitive Move
- `justification_summary` (string, required) — 3-bullet executive summary
- `why_trend` (string, required) — Context and analysis
- `how_consultancies_leverage` (string, required) — Consulting leverage opportunities
- `analysis_detail` (string, required) — Deep dive analysis
- `strategic_impact` (string, required) — Cost, revenue, risk impact
- `time_horizon` (string, required) — Immediate (0–3 months), Emerging (3–12 months), Structural (1–3 years)
- `confidence_score` (int, required, 1-10) — Confidence level
- `confidence_reasoning` (string, required) — Reasoning for confidence score
- `heat_map_scores` (object, required) — Nested object with:
  - `capability_maturity` (int, 1-10)
  - `capital_backing` (int, 1-10)
  - `enterprise_adoption` (int, 1-10)
  - `regulatory_friction` (int, 1-10)
  - `competitive_intensity` (int, 1-10)
- `market_validation` (string, required) — Market adoption signals
- `financial_signal` (string, required) — Funding and revenue metrics
- `competitive_intelligence` (string, required) — Competitor moves
- `risk_governance` (string, required) — Regulatory and risk factors
- `trend_momentum` (string, required) — Early Signal, Accelerating, Mainstream Adoption
- `action_guidance` (string, required) — What to do now
- `affected_verticals` (array of strings, required) — Array of vertical IDs
- `source_url` (string, required) — Primary source URL
- `additional_sources` (array of objects, optional) — Array of `{ "id": "string", "title": "string", "url": "string", "publisher": "string", "date": "string" }`
- `status` (string, required, default: "current") — "current" or "archived"
- `date_added` (datetime, required) — Trend publication date
- `author` (string, required) — Author or admin name
- `image_url` (string, optional) — Trend image URL
- `created_at` (datetime, required) — Document creation timestamp
- `updated_at` (datetime, required) — Last update timestamp

**Example Document:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "Generative AI in Regulatory Compliance",
  "headline": "GenAI Automating Complex Regulatory Reporting Workflows",
  "trend_category": "Enterprise Adoption",
  "justification_summary": "• Financial institutions automating 40% of compliance checks\n• Shift from keyword matching to intent-based monitoring\n• Early adopters seeing significant operational cost reduction",
  "why_trend": "Regulatory complexity is increasing...",
  "how_consultancies_leverage": "Consultancies can offer...",
  "analysis_detail": "The convergence of LLMs...",
  "strategic_impact": "↓ Operating costs in compliance (30-40%)\n↑ Speed of regulatory response",
  "time_horizon": "Immediate (0–3 months)",
  "confidence_score": 9,
  "confidence_reasoning": "Validated by major bank deployments",
  "heat_map_scores": {
    "capability_maturity": 8,
    "capital_backing": 7,
    "enterprise_adoption": 6,
    "regulatory_friction": 9,
    "competitive_intensity": 8
  },
  "market_validation": "Major banks deploying internal LLMs",
  "financial_signal": "Compliance tech spend projected to grow 15% YoY",
  "competitive_intelligence": "Big 4 firms launching proprietary AI compliance tools",
  "risk_governance": "High regulatory scrutiny; Hallucination risk",
  "trend_momentum": "Accelerating",
  "action_guidance": "Audit current compliance workflows for automation potential",
  "affected_verticals": ["v2", "v6", "v8"],
  "source_url": "https://www.ft.com/artificial-intelligence",
  "additional_sources": [],
  "status": "current",
  "date_added": "2023-10-15T10:00:00Z",
  "author": "Financial Times",
  "image_url": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c",
  "created_at": "2023-10-15T10:00:00Z",
  "updated_at": "2023-10-15T10:00:00Z"
}
```

---

### **Collection: `bookmarks`**

**Fields:**
- `_id` (ObjectId) — MongoDB auto-generated
- `user_id` (ObjectId, required, indexed) — Reference to users collection
- `trend_id` (ObjectId, required, indexed) — Reference to trends collection
- `created_at` (datetime, required) — Bookmark creation timestamp

**Unique Index:** Composite on `(user_id, trend_id)` to prevent duplicates

**Example Document:**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "user_id": "507f1f77bcf86cd799439011",
  "trend_id": "507f1f77bcf86cd799439012",
  "created_at": "2023-10-16T14:30:00Z"
}
```

---

### **Collection: `verticals`**

**Fields:**
- `_id` (string, required) — Custom ID (e.g., "v1", "v2")
- `name` (string, required) — Display name (e.g., "Healthcare")
- `slug` (string, required, unique) — URL-friendly slug (e.g., "healthcare")
- `color` (string, required) — Tailwind color class (e.g., "bg-emerald-500")
- `created_at` (datetime, required) — Document creation timestamp

**Seeded Data:** 10 verticals from [`data.ts`](Lighthouse-fa269e70/frontend/lib/data.ts:3) (Healthcare, Financial Services, Retail, Manufacturing, Technology, Legal, Education, Government, Energy, Media)

**Example Document:**
```json
{
  "_id": "v1",
  "name": "Healthcare",
  "slug": "healthcare",
  "color": "bg-emerald-500",
  "created_at": "2023-10-01T00:00:00Z"
}
```

---

## 5️⃣ Frontend Audit & Feature Map

### **Route: [`/`](Lighthouse-fa269e70/frontend/app/page.tsx:1) (Home / Top Ten Trends Feed)**
- **Purpose:** Display current trends with search and filter
- **Data Needed:** List of trends with `status: "current"`, verticals for filter dropdown
- **Backend Endpoints:** `GET /api/v1/trends?status=current`, `GET /api/v1/verticals`
- **Auth:** Optional (bookmark feature requires auth)
- **Notes:** Search filters by title and `justificationSummary`, vertical filter by `affectedVerticals` array

### **Route: [`/login`](Lighthouse-fa269e70/frontend/app/login/page.tsx:1)**
- **Purpose:** User login form
- **Data Needed:** None (form submission)
- **Backend Endpoints:** `POST /api/v1/auth/login`
- **Auth:** None (public)
- **Notes:** Returns JWT token and user object

### **Route: [`/register`](Lighthouse-fa269e70/frontend/app/register/page.tsx:1)**
- **Purpose:** User registration form
- **Data Needed:** None (form submission)
- **Backend Endpoints:** `POST /api/v1/auth/signup`
- **Auth:** None (public)
- **Notes:** Creates user with role "user" by default

### **Route: [`/saved`](Lighthouse-fa269e70/frontend/app/saved/page.tsx:1)**
- **Purpose:** Display user's bookmarked trends
- **Data Needed:** User's bookmarks with full trend data
- **Backend Endpoints:** `GET /api/v1/bookmarks`
- **Auth:** Required
- **Notes:** Redirects to login if not authenticated

### **Route: [`/profile`](Lighthouse-fa269e70/frontend/app/profile/page.tsx:1)**
- **Purpose:** View and edit user profile
- **Data Needed:** Current user details
- **Backend Endpoints:** `GET /api/v1/users/me`, `PUT /api/v1/users/me`, `DELETE /api/v1/users/me`
- **Auth:** Required
- **Notes:** Supports name and email updates, account deletion

### **Route: [`/admin`](Lighthouse-fa269e70/frontend/app/admin/page.tsx:1)**
- **Purpose:** Admin dashboard for trend management
- **Data Needed:** All trends (current and archived), verticals
- **Backend Endpoints:** `GET /api/v1/trends` (no status filter), `POST /api/v1/trends`, `PUT /api/v1/trends/:id`, `PATCH /api/v1/trends/:id/archive`, `GET /api/v1/verticals`
- **Auth:** Required (admin role)
- **Notes:** Includes "Fetch Metadata" simulation, full trend creation form with heat map scores

### **Route: [`/trends/[id]`](Lighthouse-fa269e70/frontend/app/trends/[id]/page.tsx:1)**
- **Purpose:** Detailed trend view with analysis sections
- **Data Needed:** Single trend by ID, verticals for display
- **Backend Endpoints:** `GET /api/v1/trends/:id`, `GET /api/v1/verticals`
- **Auth:** Optional (bookmark feature requires auth)
- **Notes:** Displays heat map, confidence score, all analysis fields, bookmark toggle

### **Component: [`TrendCard.tsx`](Lighthouse-fa269e70/frontend/components/TrendCard.tsx:1)**
- **Purpose:** Trend list item with bookmark and share
- **Data Needed:** Trend object, user bookmark status
- **Backend Endpoints:** `POST /api/v1/bookmarks`, `DELETE /api/v1/bookmarks/:trendId`
- **Auth:** Optional (bookmark requires auth)
- **Notes:** Bookmark toggle calls backend on click

### **Context: [`AppContext.tsx`](Lighthouse-fa269e70/frontend/context/AppContext.tsx:1)**
- **Purpose:** Global state management (currently uses mock data)
- **Data Needed:** Replace all mock functions with API calls
- **Backend Endpoints:** All endpoints
- **Auth:** JWT token stored in localStorage
- **Notes:** Must replace `MOCK_USERS`, `MOCK_TRENDS` with API calls

---

## 6️⃣ Configuration & ENV Vars

**Required Environment Variables:**

- `APP_ENV` — Environment (development, production)
- `PORT` — HTTP port (default: 8000)
- `MONGODB_URI` — MongoDB Atlas connection string (provided: `mongodb+srv://imajumd1_db_user:YRFfhaIz1a0L4l26@cluster0.wlhfwe0.mongodb.net/?appName=Cluster0`)
- `JWT_SECRET` — Token signing key (generate random 32+ char string)
- `JWT_EXPIRES_IN` — JWT expiry in seconds (default: 604800 = 7 days)
- `CORS_ORIGINS` — Allowed frontend URL (default: `http://localhost:3000`)

**Example `.env` file:**
```
APP_ENV=development
PORT=8000
MONGODB_URI=mongodb+srv://imajumd1_db_user:YRFfhaIz1a0L4l26@cluster0.wlhfwe0.mongodb.net/?appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=604800
CORS_ORIGINS=http://localhost:3000
```

---

## 7️⃣ Background Work

**Not Required for MVP:**
- No background tasks needed
- All operations are synchronous request-response
- Metadata fetching is simulated in frontend (admin form)

**Future Consideration:**
- If real URL metadata fetching is implemented, use `BackgroundTasks` for async scraping

---

## 8️⃣ Integrations

**Not Required for MVP:**
- No external integrations
- URL metadata fetch is simulated in frontend admin form
- No payment processing, file uploads, or third-party APIs

**Future Consideration:**
- OpenGraph/metadata scraping service for URL fetch
- Email service for notifications
- Analytics integration

---

## 9️⃣ Testing Strategy (Manual via Frontend)

**Testing Approach:**
- Every task includes **Manual Test Step** and **User Test Prompt**
- Test via frontend UI after implementing each task
- No automated tests for MVP
- Verify API responses in browser DevTools Network tab

**Test Flow:**
1. Implement backend task
2. Start backend server (`uvicorn main:app --reload`)
3. Start frontend server (`npm run dev`)
4. Execute Manual Test Step in browser
5. Verify expected result
6. If pass → proceed to next task
7. If fail → debug and retest
8. After all sprint tasks pass → commit and push to `main`

**Example Test:**
- **Task:** Implement user registration
- **Manual Test Step:** Fill registration form with name, email, password → submit → verify redirect to home page and user logged in
- **User Test Prompt:** "Register a new account with your name and email. Confirm you're redirected to the trends feed and see your name in the navbar."

---

## 🔟 Dynamic Sprint Plan & Backlog

---

## 🧱 S0 – Environment Setup & Frontend Connection

**Objectives:**
- Create FastAPI project structure with Python 3.13
- Connect to MongoDB Atlas using Motor driver
- Implement `/healthz` endpoint with DB ping
- Enable CORS for frontend origin
- Initialize Git repository with `main` branch
- Create `.gitignore` for Python project
- Update frontend to use backend API URLs
- Push initial code to GitHub

**User Stories:**
- As a developer, I need a working FastAPI skeleton so I can build endpoints
- As a developer, I need MongoDB Atlas connection so I can persist data
- As a developer, I need CORS enabled so frontend can call backend
- As a developer, I need Git initialized so I can version control code

**Tasks:**

### **Task S0.1: Create FastAPI Project Structure**
- Create `backend/` directory at repository root
- Create `backend/main.py` with FastAPI app instance
- Create `backend/requirements.txt` with dependencies:
  - `fastapi==0.115.0`
  - `uvicorn[standard]==0.32.0`
  - `motor==3.6.0`
  - `pydantic==2.9.2`
  - `pydantic-settings==2.6.0`
  - `python-jose[cryptography]==3.3.0`
  - `passlib[argon2]==1.7.4`
  - `python-multipart==0.0.12`
- Create `backend/.env.example` with all required env vars
- Create `backend/config.py` for settings using Pydantic Settings
- **Manual Test Step:** Run `cd backend && pip install -r requirements.txt` → verify no errors
- **User Test Prompt:** "Navigate to backend directory and install dependencies. Confirm installation completes successfully."

### **Task S0.2: Implement Health Check Endpoint**
- Create `GET /healthz` endpoint in `main.py`
- Implement MongoDB ping to verify connection
- Return JSON: `{ "status": "ok", "database": "connected" }` or `{ "status": "error", "database": "disconnected" }`
- **Manual Test Step:** Start server with `uvicorn main:app --reload` → open `http://localhost:8000/healthz` → verify JSON response with database status
- **User Test Prompt:** "Start the backend server and visit /healthz. Confirm you see a JSON response showing database connection status."

### **Task S0.3: Connect to MongoDB Atlas**
- Create `backend/database.py` with Motor async client
- Use `MONGODB_URI` from env vars
- Create database connection function
- Test connection in `/healthz` endpoint
- **Manual Test Step:** Verify `/healthz` returns `"database": "connected"`
- **User Test Prompt:** "Check the /healthz endpoint. Confirm the database field shows 'connected'."

### **Task S0.4: Enable CORS**
- Add CORS middleware to FastAPI app
- Allow origin from `CORS_ORIGINS` env var (default: `http://localhost:3000`)
- Allow credentials, all methods, all headers
- **Manual Test Step:** Start backend → start frontend → open browser DevTools → verify no CORS errors in console
- **User Test Prompt:** "Start both backend and frontend. Open browser console and confirm no CORS errors appear."

### **Task S0.5: Initialize Git and Create .gitignore**
- Run `git init` at repository root (if not already initialized)
- Set default branch to `main`: `git branch -M main`
- Create `.gitignore` at root with:
  ```
  __pycache__/
  *.pyc
  *.pyo
  *.pyd
  .Python
  env/
  venv/
  .env
  .venv
  *.log
  .DS_Store
  .idea/
  .vscode/
  *.swp
  *.swo
  node_modules/
  .next/
  ```
- **Manual Test Step:** Run `git status` → verify `.env` and `__pycache__` are ignored
- **User Test Prompt:** "Run 'git status' and confirm that .env files and Python cache directories are not listed."

### **Task S0.6: Update Frontend API URLs**
- Update [`AppContext.tsx`](Lighthouse-fa269e70/frontend/context/AppContext.tsx:1) to replace mock data with API calls
- Create `frontend/lib/api.ts` with base URL `http://localhost:8000/api/v1`
- Add fetch wrapper functions for all endpoints
- Update context methods to call API instead of using mock data
- **Manual Test Step:** Start backend and frontend → open home page → verify trends load from backend (empty array initially)
- **User Test Prompt:** "Start both servers and open the app. Confirm the trends feed loads (even if empty) without errors."

### **Task S0.7: Push to GitHub**
- Create GitHub repository (if not exists)
- Add remote: `git remote add origin <repo-url>`
- Commit all files: `git add . && git commit -m "S0: Initial backend setup with MongoDB Atlas connection"`
- Push to main: `git push -u origin main`
- **Manual Test Step:** Visit GitHub repository → verify code is pushed
- **User Test Prompt:** "Check your GitHub repository and confirm the backend code is visible."

**Definition of Done:**
- Backend runs on `http://localhost:8000`
- `/healthz` returns successful MongoDB connection status
- CORS enabled for frontend
- Git initialized with `.gitignore`
- Frontend configured to call backend API
- Code pushed to `main` branch on GitHub

---

## 🧩 S1 – Basic Auth (Signup / Login / Logout)

**Objectives:**
- Implement JWT-based authentication
- Create users collection in MongoDB
- Hash passwords with Argon2
- Protect one backend route and one frontend page

**User Stories:**
- As a user, I can register with email and password
- As a user, I can log in and receive a JWT token
- As a user, I can log out and clear my session
- As a user, I can access protected routes when authenticated

**Tasks:**

### **Task S1.1: Create User Model and Database Schema**
- Create `backend/models/user.py` with Pydantic model for User
- Include fields: `id`, `name`, `email`, `password_hash`, `role`, `avatar`, `created_at`, `updated_at`
- Create `backend/schemas/user.py` with request/response schemas
- **Manual Test Step:** Import models in Python shell → verify no errors
- **User Test Prompt:** "Run Python shell and import user models. Confirm no import errors."

### **Task S1.2: Implement Password Hashing**
- Create `backend/utils/auth.py` with Argon2 hash and verify functions
- Use `passlib` with Argon2 algorithm
- **Manual Test Step:** Test hash and verify in Python shell → confirm password verification works
- **User Test Prompt:** "Test password hashing in Python shell. Hash a password and verify it matches."

### **Task S1.3: Implement User Registration Endpoint**
- Create `POST /api/v1/auth/signup` endpoint
- Validate email uniqueness, password length (min 8), name length (min 2)
- Hash password with Argon2
- Insert user into MongoDB `users` collection
- Generate JWT token
- Return user object and token
- **Manual Test Step:** Use frontend registration form → submit → verify redirect to home and user logged in
- **User Test Prompt:** "Register a new account using the registration form. Confirm you're redirected to the home page and see your name in the navbar."

### **Task S1.4: Implement User Login Endpoint**
- Create `POST /api/v1/auth/login` endpoint
- Validate email exists and password matches
- Generate JWT token with user ID and role
- Return user object and token
- **Manual Test Step:** Use frontend login form with registered email → submit → verify redirect to home and user logged in
- **User Test Prompt:** "Log in with your registered email and password. Confirm you're redirected to the home page."

### **Task S1.5: Implement JWT Token Generation and Verification**
- Create `backend/utils/jwt.py` with `create_token` and `verify_token` functions
- Use `python-jose` library
- Token payload: `{ "sub": user_id, "role": role, "exp": expiry }`
- Token expires based on `JWT_EXPIRES_IN` env var
- **Manual Test Step:** Test token generation and verification in Python shell → verify token decodes correctly
- **User Test Prompt:** "Test JWT functions in Python shell. Generate a token and decode it to verify payload."

### **Task S1.6: Implement Logout Endpoint**
- Create `POST /api/v1/auth/logout` endpoint
- Return success message (client handles token removal)
- **Manual Test Step:** Log in → click logout in navbar → verify redirect to login page
- **User Test Prompt:** "Log in, then click logout. Confirm you're redirected to the login page."

### **Task S1.7: Implement Get Current User Endpoint**
- Create `GET /api/v1/auth/me` endpoint
- Require valid JWT token in Authorization header
- Return current user details
- **Manual Test Step:** Log in → verify user name appears in navbar
- **User Test Prompt:** "Log in and confirm your name appears in the navigation bar."

### **Task S1.8: Create Auth Dependency for Protected Routes**
- Create `backend/dependencies/auth.py` with `get_current_user` dependency
- Extract and verify JWT from Authorization header
- Raise 401 if token invalid or missing
- **Manual Test Step:** Try accessing `/api/v1/auth/me` without token → verify 401 error
- **User Test Prompt:** "Use browser DevTools to call /api/v1/auth/me without a token. Confirm you get a 401 error."

### **Task S1.9: Seed Admin User**
- Create script `backend/seed_admin.py` to create admin user
- Email: `admin@lighthouse.com`, Password: `admin123`, Role: `admin`
- Run script to insert admin into database
- **Manual Test Step:** Log in with admin credentials → verify access to `/admin` page
- **User Test Prompt:** "Log in with admin@lighthouse.com / admin123. Confirm you can access the Admin Dashboard."

**Definition of Done:**
- Users can register and log in via frontend
- JWT tokens issued and verified correctly
- Logout clears session
- Admin user exists and can access admin routes
- Code committed and pushed to `main`

**Post-sprint:**
- Commit: `git add . && git commit -m "S1: Implement JWT authentication with signup, login, logout"`
- Push: `git push origin main`

---

## 🧩 S2 – Trends CRUD (Admin Create/Update/Archive, Public Read)

**Objectives:**
- Create trends collection in MongoDB
- Seed verticals collection with 10 predefined verticals
- Implement public trend listing with search and filters
- Implement public trend detail view
- Implement admin-only trend creation, update, and archive

**User Stories:**
- As a user, I can view all current trends on the home page
- As a user, I can search trends by title or summary
- As a user, I can filter trends by vertical
- As a user, I can view detailed trend analysis
- As an admin, I can create new trends with all required fields
- As an admin, I can update existing trends
- As an admin, I can archive trends

**Tasks:**

### **Task S2.1: Create Trend Model and Schema**
- Create `backend/models/trend.py` with Pydantic model for Trend
- Include all fields from [`types.ts`](Lighthouse-fa269e70/frontend/lib/types.ts:38)
- Create `backend/schemas/trend.py` with request/response schemas
- **Manual Test Step:** Import models in Python shell → verify no errors
- **User Test Prompt:** "Import trend models in Python shell. Confirm no errors."

### **Task S2.2: Seed Verticals Collection**
- Create script `backend/seed_verticals.py`
- Insert 10 verticals from [`data.ts`](Lighthouse-fa269e70/frontend/lib/data.ts:3)
- Run script to populate `verticals` collection
- **Manual Test Step:** Check MongoDB Atlas → verify 10 verticals exist
- **User Test Prompt:** "Check your MongoDB Atlas database. Confirm the verticals collection has 10 documents."

### **Task S2.3: Implement Get Verticals Endpoint**
- Create `GET /api/v1/verticals` endpoint
- Return all verticals from database
- Public access (no auth required)
- **Manual Test Step:** Open `http://localhost:8000/api/v1/verticals` → verify JSON array of 10 verticals
- **User Test Prompt:** "Visit /api/v1/verticals in your browser. Confirm you see 10 vertical objects."

### **Task S2.4: Implement List Trends Endpoint with Filters**
- Create `GET /api/v1/trends` endpoint
- Support query params: `status` (default: current), `search`, `vertical`, `limit`
- Search filters by title and `justification_summary` (case-insensitive)
- Vertical filter checks if vertical ID in `affected_verticals` array
- Public access (no auth required)
- **Manual Test Step:** Open home page → verify empty trends list (no trends yet)
- **User Test Prompt:** "Open the app home page. Confirm it loads without errors (trends list will be empty)."

### **Task S2.5: Implement Get Trend by ID Endpoint**
- Create `GET /api/v1/trends/:id` endpoint
- Return single trend by MongoDB ObjectId
- Return 404 if trend not found
- Public access (no auth required)
- **Manual Test Step:** Try accessing `/trends/invalid-id` → verify 404 error page
- **User Test Prompt:** "Try visiting /trends/123 in the app. Confirm you see a 'not found' message."

### **Task S2.6: Implement Create Trend Endpoint (Admin Only)**
- Create `POST /api/v1/trends` endpoint
- Require admin role via auth dependency
- Validate all required fields present
- Set `date_added`, `created_at`, `updated_at` to current timestamp
- Set `author` to current admin user's name
- Insert into MongoDB `trends` collection
- **Manual Test Step:** Log in as admin → go to `/admin` → fill trend form → submit → verify trend appears in list
- **User Test Prompt:** "Log in as admin, go to Admin Dashboard, create a new trend. Confirm it appears in the trends list."

### **Task S2.7: Implement Update Trend Endpoint (Admin Only)**
- Create `PUT /api/v1/trends/:id` endpoint
- Require admin role via auth dependency
- Update all fields except `_id`, `created_at`, `date_added`
- Update `updated_at` to current timestamp
- **Manual Test Step:** Edit existing trend in admin dashboard → save → verify changes reflected
- **User Test Prompt:** "Edit a trend in the Admin Dashboard. Confirm your changes are saved."

### **Task S2.8: Implement Archive Trend Endpoint (Admin Only)**
- Create `PATCH /api/v1/trends/:id/archive` endpoint
- Require admin role via auth dependency
- Set `status` to "archived"
- Update `updated_at` to current timestamp
- **Manual Test Step:** Archive a trend in admin dashboard → verify it disappears from home page
- **User Test Prompt:** "Archive a trend in the Admin Dashboard. Confirm it no longer appears on the home page."

### **Task S2.9: Seed Sample Trends**
- Create script `backend/seed_trends.py`
- Insert 10 sample trends from [`data.ts`](Lighthouse-fa269e70/frontend/lib/data.ts:81)
- Run script to populate `trends` collection
- **Manual Test Step:** Refresh home page → verify 10 trends appear
- **User Test Prompt:** "Refresh the home page. Confirm you see 10 AI trends displayed."

### **Task S2.10: Test Search and Filter**
- Verify search works by typing in search bar
- Verify vertical filter works by selecting a vertical
- Verify clicking a trend opens detail page
- **Manual Test Step:** Search for "AI" → verify filtered results → select "Healthcare" vertical → verify filtered results → click a trend → verify detail page loads
- **User Test Prompt:** "Search for 'AI', then filter by Healthcare. Click a trend to view details. Confirm all features work."

**Definition of Done:**
- Verticals seeded in database
- 10 sample trends seeded in database
- Home page displays trends with search and filter
- Trend detail page shows full analysis
- Admin can create, update, and archive trends
- Code committed and pushed to `main`

**Post-sprint:**
- Commit: `git add . && git commit -m "S2: Implement trends CRUD with search and filters"`
- Push: `git push origin main`

---

## 🧩 S3 – Bookmarks (Create, Delete, List)

**Objectives:**
- Create bookmarks collection in MongoDB
- Implement bookmark creation (authenticated users)
- Implement bookmark deletion (authenticated users)
- Implement list user bookmarks with full trend data

**User Stories:**
- As a user, I can bookmark a trend from the feed or detail page
- As a user, I can remove a bookmark
- As a user, I can view all my saved trends on the `/saved` page
- As a user, I cannot bookmark the same trend twice

**Tasks:**

### **Task S3.1: Create Bookmark Model and Schema**
- Create `backend/models/bookmark.py` with Pydantic model for Bookmark
- Include fields: `id`, `user_id`, `trend_id`, `created_at`
- Create `backend/schemas/bookmark.py` with request/response schemas
- Create unique compound index on `(user_id, trend_id)` in MongoDB
- **Manual Test Step:** Import models in Python shell → verify no errors
- **User Test Prompt:** "Import bookmark models in Python shell. Confirm no errors."

### **Task S3.2: Implement Create Bookmark Endpoint**
- Create `POST /api/v1/bookmarks` endpoint
- Require authentication via auth dependency
- Request body: `{ "trendId": "string" }`
- Validate trend exists
- Check for duplicate bookmark (return existing if duplicate)
- Insert into MongoDB `bookmarks` collection
- **Manual Test Step:** Log in → click bookmark icon on a trend → verify icon fills/changes color
- **User Test Prompt:** "Log in and click the bookmark icon on a trend. Confirm the icon changes to show it's bookmarked."

### **Task S3.3: Implement Delete Bookmark Endpoint**
- Create `DELETE /api/v1/bookmarks/:trendId` endpoint
- Require authentication via auth dependency
- Delete bookmark where `user_id` = current user and `trend_id` = param
- Return 404 if bookmark not found
- **Manual Test Step:** Click bookmark icon on a bookmarked trend → verify icon empties/changes color
- **User Test Prompt:** "Click the bookmark icon on a bookmarked trend. Confirm it's removed (icon changes back)."

### **Task S3.4: Implement List User Bookmarks Endpoint**
- Create `GET /api/v1/bookmarks` endpoint
- Require authentication via auth dependency
- Query bookmarks for current user
- Join with trends collection to get full trend data
- Return array of bookmarks with embedded trend objects
- **Manual Test Step:** Bookmark 2-3 trends → go to `/saved` page → verify bookmarked trends appear
- **User Test Prompt:** "Bookmark a few trends, then visit the Saved page. Confirm your bookmarked trends are displayed."

### **Task S3.5: Update Frontend to Check Bookmark Status**
- Modify `GET /api/v1/trends` to include bookmark status for authenticated users
- Or create separate endpoint `GET /api/v1/bookmarks/check?trendIds=id1,id2,id3`
- Update frontend to show correct bookmark state on page load
- **Manual Test Step:** Refresh page after bookmarking → verify bookmark icons show correct state
- **User Test Prompt:** "Bookmark a trend, then refresh the page. Confirm the bookmark icon still shows as bookmarked."

**Definition of Done:**
- Users can bookmark and unbookmark trends
- Bookmarks persist across sessions
- Saved page displays user's bookmarked trends
- Duplicate bookmarks prevented
- Code committed and pushed to `main`

**Post-sprint:**
- Commit: `git add . && git commit -m "S3: Implement bookmark create, delete, and list"`
- Push: `git push origin main`

---

## 🧩 S4 – User Profile Management

**Objectives:**
- Implement get current user profile
- Implement update user profile (name, email)
- Implement delete user account (soft delete)

**User Stories:**
- As a user, I can view my profile information
- As a user, I can update my name and email
- As a user, I can delete my account
- As a user, my bookmarks are deleted when I delete my account

**Tasks:**

### **Task S4.1: Implement Get User Profile Endpoint**
- Create `GET /api/v1/users/me` endpoint (alias for `/auth/me`)
- Require authentication via auth dependency
- Return current user details (no password hash)
- **Manual Test Step:** Log in → go to `/profile` → verify profile information displays
- **User Test Prompt:** "Log in and visit your Profile page. Confirm your name and email are displayed."

### **Task S4.2: Implement Update User Profile Endpoint**
- Create `PUT /api/v1/users/me` endpoint
- Require authentication via auth dependency
- Request body: `{ "name": "string?", "email": "string?" }`
- Validate email uniqueness if changed
- Update user in MongoDB
- Update `updated_at` timestamp
- **Manual Test Step:** Go to `/profile` → click Edit → change name → save → verify name updates in navbar
- **User Test Prompt:** "Edit your profile name and save. Confirm the new name appears in the navigation bar."

### **Task S4.3: Implement Delete User Account Endpoint**
- Create `DELETE /api/v1/users/me` endpoint
- Require authentication via auth dependency
- Soft delete: set `deleted_at` timestamp (don't actually delete)
- Delete all user's bookmarks (cascade)
- Return success message
- **Manual Test Step:** Click "Delete Account" button → confirm → verify redirect to login page
- **User Test Prompt:** "Click Delete Account and confirm. Verify you're logged out and redirected to login."

### **Task S4.4: Update Login to Check Deleted Accounts**
- Modify login endpoint to check if `deleted_at` is null
- Return error if account is deleted
- **Manual Test Step:** Try logging in with deleted account → verify error message
- **User Test Prompt:** "Try logging in with a deleted account. Confirm you see an error message."

**Definition of Done:**
- Users can view and update their profile
- Users can delete their account
- Deleted accounts cannot log in
- Bookmarks cascade delete with account
- Code committed and pushed to `main`

**Post-sprint:**
- Commit: `git add . && git commit -m "S4: Implement user profile management"`
- Push: `git push origin main`

---

## 🧩 S5 – Admin Dashboard Features & Polish

**Objectives:**
- Ensure admin dashboard fully functional
- Add admin role check middleware
- Test all admin features end-to-end
- Add error handling and validation
- Final integration testing

**User Stories:**
- As an admin, I can view all trends (current and archived)
- As an admin, I can create trends with all required fields
- As an admin, I can edit existing trends
- As an admin, I can archive trends
- As a non-admin, I cannot access admin endpoints

**Tasks:**

### **Task S5.1: Create Admin Role Dependency**
- Create `backend/dependencies/admin.py` with `require_admin` dependency
- Check if current user role is "admin"
- Raise 403 if not admin
- Apply to all admin endpoints
- **Manual Test Step:** Log in as regular user → try accessing `/admin` → verify access denied
- **User Test Prompt:** "Log in as a regular user and try visiting /admin. Confirm you see an access denied message."

### **Task S5.2: Test Admin Trend Creation Flow**
- Log in as admin
- Go to `/admin` page
- Click "Add New Trend"
- Fill all required fields (use approved sources list)
- Submit form
- Verify trend appears in trends list
- **Manual Test Step:** Create a complete trend with all fields → verify it appears on home page
- **User Test Prompt:** "As admin, create a new trend with all fields filled. Confirm it appears on the home page."

### **Task S5.3: Test Admin Trend Update Flow**
- Log in as admin
- Go to `/admin` page
- Click "Edit" on an existing trend
- Modify some fields
- Save changes
- Verify changes reflected on detail page
- **Manual Test Step:** Edit a trend's title → save → view detail page → verify new title
- **User Test Prompt:** "Edit a trend's title in the admin dashboard. Confirm the change appears on the trend detail page."

### **Task S5.4: Test Admin Archive Flow**
- Log in as admin
- Go to `/admin` page
- Click "Archive" on a current trend
- Verify trend disappears from home page
- Verify trend still visible in admin dashboard with "archived" status
- **Manual Test Step:** Archive a trend → check home page (should be gone) → check admin dashboard (should show as archived)
- **User Test Prompt:** "Archive a trend. Confirm it's removed from the home page but still visible in the admin dashboard."

### **Task S5.5: Add Error Handling and Validation**
- Add try-catch blocks to all endpoints
- Return proper HTTP status codes (400, 401, 403, 404, 500)
- Add validation error messages
- Test error scenarios (invalid IDs, missing fields, etc.)
- **Manual Test Step:** Submit trend form with missing required field → verify error message displays
- **User Test Prompt:** "Try creating a trend without filling required fields. Confirm you see validation errors."

### **Task S5.6: Final Integration Testing**
- Test complete user journey: register → login → browse trends → bookmark → view saved → logout
- Test complete admin journey: login → create trend → edit trend → archive trend → logout
- Test search and filter combinations
- Test all protected routes require authentication
- **Manual Test Step:** Execute both user and admin journeys → verify all features work
- **User Test Prompt:** "Complete a full user journey (register, browse, bookmark, logout) and admin journey (create, edit, archive). Confirm everything works smoothly."

### **Task S5.7: Update Frontend API Integration**
- Ensure all frontend API calls use correct endpoints
- Add error handling for failed API calls
- Add loading states for async operations
- Test with backend running
- **Manual Test Step:** Test all frontend pages with backend → verify no console errors
- **User Test Prompt:** "Navigate through all pages of the app. Check browser console for errors. Confirm none appear."

**Definition of Done:**
- Admin dashboard fully functional
- All CRUD operations work correctly
- Error handling in place
- All manual tests pass
- Frontend fully integrated with backend
- Code committed and pushed to `main`

**Post-sprint:**
- Commit: `git add . && git commit -m "S5: Complete admin dashboard and final polish"`
- Push: `git push origin main`

---

## ✅ FINAL CHECKLIST

**Before Handoff to SnapDev V1:**

- [ ] Backend runs on `http://localhost:8000`
- [ ] MongoDB Atlas connection successful
- [ ] All API endpoints documented and working
- [ ] JWT authentication functional
- [ ] Admin role-based access control working
- [ ] Trends CRUD operations complete
- [ ] Bookmarks create/delete/list working
- [ ] User profile management functional
- [ ] Search and filter working correctly
- [ ] Frontend fully integrated with backend
- [ ] All manual tests passed
- [ ] Code pushed to `main` branch on GitHub
- [ ] `.env.example` file created with all required variables
- [ ] `README.md` updated with setup instructions

**Setup Instructions for SnapDev V1:**

1. Clone repository
2. Navigate to `backend/` directory
3. Create `.env` file from `.env.example`
4. Set `MONGODB_URI` to provided Atlas connection string
5. Generate random `JWT_SECRET` (32+ characters)
6. Install dependencies: `pip install -r requirements.txt`
7. Seed database: `python seed_verticals.py && python seed_admin.py && python seed_trends.py`
8. Start server: `uvicorn main:app --reload`
9. Navigate to `frontend/` directory
10. Install dependencies: `npm install`
11. Start frontend: `npm run dev`
12. Open `http://localhost:3000`
13. Test with admin credentials: `admin@lighthouse.com` / `admin123`

---

**END OF BACKEND DEVELOPMENT PLAN**