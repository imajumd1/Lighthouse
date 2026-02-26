# Lighthouse AI Trends Platform - Backend

FastAPI backend for the Lighthouse AI Trends Platform, providing REST API endpoints for trend management, user authentication, and bookmarking.

## Tech Stack

- **Framework:** FastAPI 0.115.0
- **Database:** MongoDB Atlas (Motor async driver)
- **Authentication:** JWT with Argon2 password hashing
- **Python:** 3.9+

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
pip3 install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend/` directory (use `.env.example` as template):

```bash
APP_ENV=development
PORT=8002
MONGODB_URI=mongodb+srv://imajumd1_db_user:YRFfhaIz1a0L4l26@cluster0.wlhfwe0.mongodb.net/?appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-change-this-in-production
JWT_EXPIRES_IN=604800
CORS_ORIGINS=http://localhost:3000
```

### 3. Start the Server

```bash
python3 -m uvicorn main:app --reload --port 8002
```

The API will be available at `http://localhost:8002`

### 4. View API Documentation

- Swagger UI: `http://localhost:8002/docs`
- ReDoc: `http://localhost:8002/redoc`

## API Endpoints

### Health Check
- `GET /healthz` - Check server and database connection status

### Authentication
- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/login` - Login and get JWT token
- `POST /api/v1/auth/logout` - Logout (client-side token removal)
- `GET /api/v1/auth/me` - Get current user details

### Trends
- `GET /api/v1/trends` - List trends with filters (status, search, vertical)
- `GET /api/v1/trends/:id` - Get single trend by ID
- `POST /api/v1/trends` - Create new trend (admin only)
- `PUT /api/v1/trends/:id` - Update trend (admin only)
- `PATCH /api/v1/trends/:id/archive` - Archive trend (admin only)

### Bookmarks
- `POST /api/v1/bookmarks` - Bookmark a trend
- `DELETE /api/v1/bookmarks/:trendId` - Remove bookmark
- `GET /api/v1/bookmarks` - List user's bookmarks

### Users
- `GET /api/v1/users/me` - Get user profile
- `PUT /api/v1/users/me` - Update user profile
- `DELETE /api/v1/users/me` - Delete user account

### Verticals
- `GET /api/v1/verticals` - List all verticals

## Database Collections

- **users** - User accounts with authentication
- **trends** - AI trend articles with analysis
- **bookmarks** - User-trend bookmark relationships
- **verticals** - Industry verticals (Healthcare, Finance, etc.)

## Development

### Project Structure

```
backend/
├── main.py              # FastAPI app and routes
├── config.py            # Settings and environment variables
├── database.py          # MongoDB connection
├── requirements.txt     # Python dependencies
├── .env                 # Environment variables (not in git)
└── .env.example         # Environment template
```

### Next Steps

1. Implement authentication endpoints (Sprint S1)
2. Implement trends CRUD operations (Sprint S2)
3. Implement bookmarks functionality (Sprint S3)
4. Implement user profile management (Sprint S4)
5. Add admin dashboard features (Sprint S5)

## Testing

Manual testing via frontend UI after each sprint. See `Backend-dev-plan.md` for detailed test procedures.

## Notes

- Backend runs on port 8002 (8000 and 8001 may be in use)
- MongoDB Atlas connection string is pre-configured
- JWT tokens expire after 7 days by default
- CORS is enabled for `http://localhost:3000` (frontend)
