import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # AI Provider Configuration
    AI_PROVIDER: str = "gemini"  # "gemini" or "openrouter"
    
    # Gemini Configuration
    GEMINI_API_KEY: str = ""
    
    # OpenRouter Configuration
    OPENROUTER_API_KEY: str = ""
    OPENROUTER_MODEL: str = "meta-llama/llama-3-8b-instruct:free"
    
    # Database Configuration
    MONGODB_URI: str = ""
    MONGODB_DB_NAME: str = "leadforge"
    
    # Server Configuration
    BACKEND_PORT: int = 8000
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

def validate_settings():
    """Validate required settings are set"""
    if not settings.MONGODB_URI:
        raise ValueError("MONGODB_URI is required")
    
    if settings.AI_PROVIDER == "gemini" and not settings.GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is required when AI_PROVIDER=gemini")
    
    if settings.AI_PROVIDER == "openrouter" and not settings.OPENROUTER_API_KEY:
        raise ValueError("OPENROUTER_API_KEY is required when AI_PROVIDER=openrouter")

def get_ai_provider():
    """Get the configured AI provider"""
    return settings.AI_PROVIDER

def get_ai_config():
    """Get AI configuration based on provider"""
    if settings.AI_PROVIDER == "gemini":
        return {
            "api_key": settings.GEMINI_API_KEY,
            "model": "gemini-1.5-flash"
        }
    else:
        return {
            "api_key": settings.OPENROUTER_API_KEY,
            "model": settings.OPENROUTER_MODEL
        }