"""Authentication dependencies for protected routes."""

from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from utils.jwt import decode_access_token
from database import get_database
from models.user import UserInDB
from bson import ObjectId

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> UserInDB:
    """
    Dependency to get the current authenticated user from JWT token.
    
    Args:
        credentials: HTTP Bearer token credentials
        
    Returns:
        Current user from database
        
    Raises:
        HTTPException: If token is invalid or user not found
    """
    token = credentials.credentials
    
    # Decode the JWT token
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Extract user ID from token
    user_id: Optional[str] = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get user from database
    db = get_database()
    user_dict = await db.users.find_one({"_id": ObjectId(user_id)})
    
    if user_dict is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is deleted
    if user_dict.get("deleted_at") is not None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account has been deleted",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return UserInDB(**user_dict)


async def get_current_admin_user(
    current_user: UserInDB = Depends(get_current_user)
) -> UserInDB:
    """
    Dependency to ensure the current user is an admin.
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        Current admin user
        
    Raises:
        HTTPException: If user is not an admin
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions. Admin access required.",
        )
    return current_user
