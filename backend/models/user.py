from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from bson import ObjectId


class PyObjectId(ObjectId):
    """Custom ObjectId type for Pydantic."""
    
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, field=None):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")


class UserInDB(BaseModel):
    """User model as stored in MongoDB."""
    
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    name: str
    email: EmailStr
    password_hash: str
    role: str = "user"  # "user" or "admin"
    avatar: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    deleted_at: Optional[datetime] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class User(BaseModel):
    """User model for API responses (without password_hash)."""
    
    id: str
    name: str
    email: str
    role: str
    avatar: Optional[str] = None

    class Config:
        populate_by_name = True
