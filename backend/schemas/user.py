from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserSignupRequest(BaseModel):
    """Request schema for user signup."""
    
    name: str = Field(..., min_length=2, description="User's full name")
    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(..., min_length=8, description="User's password (min 8 characters)")


class UserLoginRequest(BaseModel):
    """Request schema for user login."""
    
    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(..., description="User's password")


class UserResponse(BaseModel):
    """Response schema for user data."""
    
    id: str
    name: str
    email: str
    role: str
    avatar: Optional[str] = None


class AuthResponse(BaseModel):
    """Response schema for authentication endpoints."""
    
    user: UserResponse
    token: str


class MessageResponse(BaseModel):
    """Generic message response."""
    
    message: str
