from fastapi import APIRouter, HTTPException, status
from openai import OpenAI
import logging

from config import settings
from schemas.chat import ChatRequest, ChatResponse

# Configure logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/api/chat", tags=["chat"])

# OpenAI client will be initialized lazily
_client = None

def get_openai_client():
    """Get or create OpenAI client instance."""
    global _client
    if _client is None:
        _client = OpenAI(api_key=settings.openai_api_key)
    return _client

# System prompt for Lighthouse AI
LIGHTHOUSE_SYSTEM_PROMPT = """You are Lighthouse AI, an expert strategic analyst specializing in AI trends, technology markets, and business intelligence. Your role is to provide:

1. **Strategic Insights**: Analyze AI trends, market dynamics, and emerging technologies with a focus on business impact
2. **Risk Assessment**: Identify potential risks, compliance issues, and governance challenges
3. **Actionable Guidance**: Provide clear, actionable recommendations for executives and decision-makers
4. **Market Intelligence**: Share insights on competitive landscapes, market validation, and industry shifts

Your responses should be:
- **Concise yet comprehensive**: Get to the point while covering key aspects
- **Data-informed**: Reference market trends, industry patterns, and strategic frameworks
- **Executive-focused**: Speak to business leaders, CTOs, and strategic decision-makers
- **Forward-looking**: Emphasize implications and future scenarios

Key topics you cover:
- SaaS business models and their evolution
- AI agents and autonomous systems
- Hardware/compute infrastructure (GPUs, chips)
- Regulatory landscape (EU AI Act, compliance)
- Workforce transformation and AI adoption
- Build vs Buy strategies for AI

Maintain a professional, analytical tone. Be direct and avoid unnecessary pleasantries."""


@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat endpoint that uses OpenAI API to generate responses.
    
    Args:
        request: ChatRequest containing the user's message and conversation history
        
    Returns:
        ChatResponse with the AI assistant's reply
    """
    try:
        # Build messages array for OpenAI API
        messages = [
            {"role": "system", "content": LIGHTHOUSE_SYSTEM_PROMPT}
        ]
        
        # Add conversation history
        for msg in request.conversation_history:
            messages.append({
                "role": msg.role,
                "content": msg.content
            })
        
        # Add current user message
        messages.append({
            "role": "user",
            "content": request.message
        })
        
        # Call OpenAI API
        logger.info(f"Calling OpenAI API with {len(messages)} messages")
        
        client = get_openai_client()
        
        try:
            response = client.chat.completions.create(
                model="gpt-4o",  # Using GPT-4o for better intelligence and reasoning
                messages=messages,
                temperature=0.7,
                max_tokens=1500,  # Increased for more detailed responses
                top_p=1.0,
                frequency_penalty=0.0,
                presence_penalty=0.0
            )
            
            # Extract the assistant's reply
            assistant_message = response.choices[0].message.content
            
            logger.info("Successfully generated response from OpenAI")
        except Exception as openai_error:
            logger.error(f"OpenAI API Error Type: {type(openai_error).__name__}")
            logger.error(f"OpenAI API Error Details: {str(openai_error)}")
            if hasattr(openai_error, 'response'):
                logger.error(f"OpenAI Response Status: {getattr(openai_error.response, 'status_code', 'N/A')}")
                logger.error(f"OpenAI Response Body: {getattr(openai_error.response, 'text', 'N/A')}")
            raise
        
        return ChatResponse(
            message=assistant_message,
            role="assistant"
        )
        
    except Exception as e:
        logger.error(f"Error calling OpenAI API: {str(e)}")
        
        # Check if it's an API key issue
        if "api_key" in str(e).lower() or "authentication" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="OpenAI API key is invalid or not configured. Please check your OPENAI_API_KEY environment variable."
            )
        
        # Generic error
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate response: {str(e)}"
        )


@router.get("/health")
async def chat_health():
    """Health check endpoint for chat service."""
    return {
        "status": "ok",
        "service": "chat",
        "openai_configured": bool(settings.openai_api_key and not settings.openai_api_key.startswith("sk-placeholder"))
    }
