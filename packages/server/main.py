"""
Updated main FastAPI application with new story-based API structure
Uses app package for organized code structure
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv('.env')

# Import routes from organized structure
from app.api import router

# Create FastAPI app
app = FastAPI(
    title="Fable Tales - Story Generation API v1.0",
    description="Interactive story creation and reading platform with AI generation",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(router)

# ============================================================================
# Root Endpoints
# ============================================================================

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": "Fable Tales - Story Generation API",
        "version": "1.0.0",
        "description": "Interactive story creation and reading platform",
        "documentation": "/docs",
        "health": "/api/v1/health",
        "api_base": "/api/v1"
    }



# ============================================================================
# Error Handlers
# ============================================================================

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle general exceptions"""
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "detail": str(exc)
        }
    )


# ============================================================================
# Startup & Shutdown Events
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Initialize on startup"""
    print("=" * 60)
    print("Fable Tales - Story Generation API")
    print("=" * 60)
    print(f"Environment: {os.getenv('ENV', 'development')}")
    print(f"OpenAI API Key: {'configured' if os.getenv('OPENAI_API_KEY') and os.getenv('OPENAI_API_KEY') != 'placeholder_openai_key' else 'not configured'}")
    print(f"FAL.ai API Key: {'configured' if os.getenv('FAL_AI_API_KEY') != 'placeholder_fal_ai_key' else 'placeholder'}")
    print("=" * 60)


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    print("Fable Tales Story API shutting down...")


# ============================================================================
# Development Server
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 8000)),
        reload=os.getenv("ENV", "development") == "development",
        log_level=os.getenv("LOG_LEVEL", "info")
    )
