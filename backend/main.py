from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from config import settings
from database import connect_to_mongodb, close_mongodb_connection, get_database
from routers import auth, chat, trends


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
# In development, allow all origins for easier testing
if settings.app_env == "development":
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Allow all origins in development
        allow_credentials=False,  # Must be False when allow_origins is ["*"]
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include routers
app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(trends.router)


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


if __name__ == "__main__":
    import uvicorn
    import os
    
    # Get port from environment variable (Render uses $PORT) or settings, default to 8002
    port = int(os.getenv('PORT', getattr(settings, 'port', 8002)))
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=False  # Set to False for production
    )
