"""
Configuration and constants for the application
"""

import os
from enum import Enum

# ============================================================================
# Environment Configuration
# ============================================================================

ENV = os.getenv("ENV", "development")
DEBUG = ENV == "development"

HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", 8000))

LOG_LEVEL = os.getenv("LOG_LEVEL", "info")

# ============================================================================
# API Configuration
# ============================================================================

API_V1_PREFIX = "/api/v1"

CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

# ============================================================================
# Processing Configuration
# ============================================================================

# Number of scenes in a comic
SCENES_PER_COMIC = 6

# Maximum characters per comic
MAX_CHARACTERS = 4

# Maximum refinement iterations
MAX_REFINEMENTS = 5

# ============================================================================
# OpenAI Configuration
# ============================================================================

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "placeholder_openai_key")
OPENAI_MODEL = "gpt-4"

# ============================================================================
# FAL.ai Configuration
# ============================================================================

FAL_AI_API_KEY = os.getenv("FAL_AI_API_KEY", "placeholder_fal_ai_key")
FAL_AI_MODEL = "flux-pro"

IMAGE_WIDTH = 768
IMAGE_HEIGHT = 512

# ============================================================================
# Database Configuration (for future use)
# ============================================================================

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./fable_tales.db")

# ============================================================================
# Eleven Labs Configuration
# ============================================================================

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "placeholder_elevenlabs_key")
# Default voice for narration (Rachel - warm, friendly voice perfect for children's stories)
ELEVENLABS_VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")

# ============================================================================
# Processing Defaults
# ============================================================================

DEFAULT_AGE_GROUP = "5-12"
DEFAULT_TEMPERATURE = 0.7
DEFAULT_MAX_TOKENS = 2000
