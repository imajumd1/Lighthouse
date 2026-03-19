# Lighthouse AI Trends Platform

Lighthouse is a full-stack application for discovering, analyzing, and tracking high-impact AI trends.  
It combines a Next.js frontend with a FastAPI backend that integrates with MongoDB and OpenAI.

## What This Project Includes

- Trend feed with filtering (search, vertical, and date)
- Trend detail pages and saved/bookmarked trends
- Authentication flows (sign up, login, profile access)
- Admin workflow for refreshing trends from curated sources
- AI chat endpoint for strategic analysis responses
- Trends scraping and analysis endpoints powered by OpenAI

## Tech Stack

### Frontend
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 4

### Backend
- FastAPI
- MongoDB (Motor async driver)
- JWT auth (`python-jose`) + Argon2 password hashing (`passlib`)
- OpenAI Python SDK

## Repository Structure

```text
.
├── frontend/     # Next.js application
├── backend/      # FastAPI API server
├── package.json  # Root workspace scripts for frontend
└── README.md
```

## Prerequisites

- Node.js 18+ (recommended: latest LTS)
- npm
- Python 3.9+
- A MongoDB instance (Atlas or local)
- OpenAI API key

## Local Development Setup

### 1) Clone and install frontend dependencies

```bash
npm install
```

This installs dependencies for the root workspace and the `frontend` app.

### 2) Configure backend environment

Create a `backend/.env` file (you can copy from `backend/.env.example`) and set real values:

```bash
APP_ENV=development
PORT=8000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret-at-least-32-chars>
JWT_EXPIRES_IN=604800
CORS_ORIGINS=http://localhost:3000
OPENAI_API_KEY=<your-openai-api-key>
```

### 3) Install backend dependencies

```bash
cd backend
python3 -m pip install -r requirements.txt
```

### 4) Run the backend

From `backend/`:

```bash
python3 -m uvicorn main:app --reload --port 8000
```

Backend will be available at `http://localhost:8000`.

### 5) Run the frontend

From repository root:

```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`.

## Available Scripts

From the repository root:

- `npm run dev` - starts the frontend dev server
- `npm run build` - builds the frontend app
- `npm run start` - starts the frontend production server

From `backend/`:

- `python3 -m uvicorn main:app --reload --port 8000` - runs backend in dev mode

## API Overview

Base URL (local): `http://localhost:8000`

- `GET /healthz` - backend + database health check
- `GET /` - basic API info

Authentication:
- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

Chat:
- `POST /api/chat`
- `GET /api/chat/health`

Trends scraping/discovery:
- `GET /api/trends/sources`
- `POST /api/trends/scrape`
- `POST /api/trends/discover`
- `GET /api/trends/health`

## API Docs

When backend is running:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Notes

- Frontend API defaults to `http://localhost:8000` in development.
- In production, frontend falls back to a hosted backend URL if not overridden.
- Keep secrets out of git: never commit real API keys or production credentials.
