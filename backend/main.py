"""
EmailCraft AI - Backend API
Professional email writing assistant powered by Pydantic AI
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from pydantic_ai import Agent
import logging
import os
from typing import Optional, Literal
from datetime import datetime
import httpx
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="EmailCraft AI API",
    description="AI-powered professional email writing assistant",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response Models
class EmailRequest(BaseModel):
    """Email generation request model with validation"""
    context: str = Field(
        ..., 
        min_length=10, 
        max_length=1000,
        description="The context or purpose of the email"
    )
    tone: Literal["professional", "friendly", "formal", "casual"] = Field(
        default="professional",
        description="The desired tone of the email"
    )
    recipient_name: Optional[str] = Field(
        None,
        max_length=100,
        description="Name of the recipient (optional)"
    )
    additional_details: Optional[str] = Field(
        None,
        max_length=500,
        description="Any additional context or requirements"
    )
    
    @field_validator('context')
    @classmethod
    def validate_context(cls, v: str) -> str:
        """Validate that context is meaningful"""
        if not v.strip():
            raise ValueError("Context cannot be empty")
        return v.strip()


class EmailResponse(BaseModel):
    """Email generation response model"""
    subject: str
    body: str
    tone: str
    generated_at: str
    suggestions: list[str]


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    timestamp: str
    version: str


# Initialize AI Agent
def create_email_agent() -> Agent:
    """Create and configure the Pydantic AI agent for email generation"""
    
    # Use a free model from OpenRouter
    api_key = os.getenv("OPENROUTER_API_KEY", "")
    
    if not api_key:
        logger.error("No API key found. Please set OPENROUTER_API_KEY environment variable.")
        raise ValueError("OPENROUTER_API_KEY environment variable is required")
    
    system_prompt = """You are an expert email writing assistant. Your task is to craft professional, 
    clear, and effective emails based on the user's context and requirements.
    
    Guidelines:
    - Always maintain the requested tone
    - Keep emails concise but complete
    - Use proper email etiquette
    - Include appropriate greetings and closings
    - Be culturally sensitive and professional
    - Avoid jargon unless specifically requested
    
    Format your response as a complete email with greeting, body, and closing."""
    
    # Configure OpenRouter as OpenAI-compatible endpoint
    os.environ["OPENAI_API_KEY"] = api_key
    os.environ["OPENAI_BASE_URL"] = "https://openrouter.ai/api/v1"
    
    # Create agent with OpenRouter model using OpenAI compatibility
    # Using gpt-3.5-turbo which works reliably (very low cost, credits from OpenRouter)
    agent = Agent(
        'openai:gpt-3.5-turbo',
        system_prompt=system_prompt,
        retries=2,
    )
    
    return agent


# Global agent instance
email_agent = create_email_agent()


# API Endpoints
@app.get("/", response_model=HealthResponse)
async def root():
    """Root endpoint - health check"""
    return HealthResponse(
        status="healthy",
        timestamp=datetime.utcnow().isoformat(),
        version="1.0.0"
    )


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    logger.info("Health check requested")
    return HealthResponse(
        status="healthy",
        timestamp=datetime.utcnow().isoformat(),
        version="1.0.0"
    )


@app.post("/api/generate-email", response_model=EmailResponse)
async def generate_email(request: EmailRequest):
    """
    Generate a professional email based on context and requirements
    
    This endpoint uses Pydantic AI to intelligently craft emails with proper
    tone, structure, and content based on the user's input.
    """
    try:
        logger.info(f"Email generation requested - Tone: {request.tone}, Context length: {len(request.context)}")
        
        # Build the prompt for the AI agent
        recipient = f"to {request.recipient_name}" if request.recipient_name else ""
        additional = f"\n\nAdditional details: {request.additional_details}" if request.additional_details else ""
        
        prompt = f"""Write a {request.tone} email {recipient} with the following context:

Context: {request.context}{additional}

Tone: {request.tone}

Write a complete, ready-to-send professional email."""
        
        # Run the agent with timeout and error handling
        try:
            result = await email_agent.run(prompt)
            
            # Get the generated email text
            email_text = result.data if hasattr(result, 'data') else str(result)
            
            # Extract subject from first line or create one
            lines = email_text.strip().split('\n')
            subject_line = f"Re: {request.context[:50]}..."
            
            # Try to find a subject line in the response
            for i, line in enumerate(lines):
                if line.lower().startswith('subject:'):
                    subject_line = line.split(':', 1)[1].strip()
                    email_text = '\n'.join(lines[:i] + lines[i+1:])
                    break
            
            # Create suggestions
            suggestions = [
                "Review the email for tone and clarity",
                "Personalize with specific details if needed",
                "Proofread before sending"
            ]
            
            logger.info("Email generated successfully")
            
            return EmailResponse(
                subject=subject_line,
                body=email_text.strip(),
                tone=request.tone,
                generated_at=datetime.utcnow().isoformat(),
                suggestions=suggestions
            )
            
        except httpx.TimeoutException:
            logger.error("Request timeout while generating email")
            raise HTTPException(
                status_code=504,
                detail="Request timeout. Please try again."
            )
        except Exception as e:
            logger.error(f"Error during agent execution: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Error generating email: {str(e)}"
            )
    
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred. Please try again."
        )


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler for unhandled errors"""
    logger.error(f"Unhandled exception: {str(exc)}")
    return {
        "detail": "An internal server error occurred",
        "timestamp": datetime.utcnow().isoformat()
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
