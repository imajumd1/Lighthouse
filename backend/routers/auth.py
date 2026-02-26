"""Authentication routes for signup, login, logout, and user info."""

from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Depends
from bson import ObjectId

from database import get_database
from models.user import UserInDB, User
from schemas.user import (
    UserSignupRequest,
    UserLoginRequest,
    UserResponse,
    AuthResponse,
    MessageResponse
)
from utils.auth import hash_password, verify_password
from utils.jwt import create_access_token
from dependencies.auth import get_current_user

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserSignupRequest):
    """
    Register a new user account.
    
    - **name**: User's full name (min 2 characters)
    - **email**: User's email address (must be unique)
    - **password**: User's password (min 8 characters)
    
    Returns user object and JWT token.
    """
    db = get_database()
    
    # Check if email already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash the password
    password_hash = hash_password(user_data.password)
    
    # Create user document
    user_doc = {
        "name": user_data.name,
        "email": user_data.email,
        "password_hash": password_hash,
        "role": "user",
        "avatar": None,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "deleted_at": None
    }
    
    # Insert into database
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    # Create JWT token
    token = create_access_token(data={"sub": user_id, "role": "user"})
    
    # Return user and token
    return AuthResponse(
        user=UserResponse(
            id=user_id,
            name=user_data.name,
            email=user_data.email,
            role="user",
            avatar=None
        ),
        token=token
    )


@router.post("/login", response_model=AuthResponse)
async def login(credentials: UserLoginRequest):
    """
    Authenticate user and issue JWT token.
    
    - **email**: User's email address
    - **password**: User's password
    
    Returns user object and JWT token.
    """
    db = get_database()
    
    # Find user by email
    user_dict = await db.users.find_one({"email": credentials.email})
    if not user_dict:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Check if account is deleted
    if user_dict.get("deleted_at") is not None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account has been deleted"
        )
    
    # Verify password
    if not verify_password(credentials.password, user_dict["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Create JWT token
    user_id = str(user_dict["_id"])
    token = create_access_token(data={"sub": user_id, "role": user_dict["role"]})
    
    # Return user and token
    return AuthResponse(
        user=UserResponse(
            id=user_id,
            name=user_dict["name"],
            email=user_dict["email"],
            role=user_dict["role"],
            avatar=user_dict.get("avatar")
        ),
        token=token
    )


@router.post("/logout", response_model=MessageResponse)
async def logout(current_user: UserInDB = Depends(get_current_user)):
    """
    Logout user (client-side token removal).
    
    Requires valid JWT token in Authorization header.
    """
    return MessageResponse(message="Logged out successfully")


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: UserInDB = Depends(get_current_user)):
    """
    Get current authenticated user details.
    
    Requires valid JWT token in Authorization header.
    """
    return UserResponse(
        id=str(current_user.id),
        name=current_user.name,
        email=current_user.email,
        role=current_user.role,
        avatar=current_user.avatar
    )
