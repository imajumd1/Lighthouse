from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from config import settings
from database import connect_to_mongodb, close_mongodb_connection, get_database
from routers import auth


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events."""
    # Startup
    await connect_to_mongodb()
    yield
    # Shutdown
    await close_mongodb_connection()


# Create FastAPI app
app = FastAPI(
    title="Lighthouse AI Trends API",
    description="Backend API for Lighthouse AI Trends Platform",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)


@app.get("/healthz")
async def health_check():
    """Health check endpoint with database connection verification."""
    try:
        db = get_database()
        # Ping the database to verify connection
        await db.command('ping')
        return {
            "status": "ok",
            "database": "connected"
        }
    except Exception as e:
        return {
            "status": "error",
            "database": "disconnected",
            "error": str(e)
        }


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Lighthouse AI Trends API",
        "version": "1.0.0",
        "docs": "/docs"
    }
