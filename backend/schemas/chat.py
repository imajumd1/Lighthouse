from pydantic import BaseModel, Field
from typing import List, Literal


class ChatMessage(BaseModel):
    """Schema for a single chat message."""
    role: Literal["user", "assistant", "system"]
    content: str


class ChatRequest(BaseModel):
    """Schema for chat request."""
    message: str = Field(..., min_length=1, max_length=2000, description="User's message")
    conversation_history: List[ChatMessage] = Field(default_factory=list, description="Previous messages in the conversation")


class ChatResponse(BaseModel):
    """Schema for chat response."""
    message: str = Field(..., description="AI assistant's response")
    role: Literal["assistant"] = "assistant"
