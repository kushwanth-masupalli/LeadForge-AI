from pydantic_settings import BaseSettings
from typing import Literal


class Settings(BaseSettings):
    # MongoDB
    mongodb_uri: str = "mongodb://127.0.0.1:27017"
    mongodb_db_name: str = "leadforge"

    # AI Provider
    ai_provider: Literal["gemini", "openrouter"] = "gemini"

    # Gemini
    gemini_api_key: str = ""

    # OpenRouter
    openrouter_api_key: str = ""
    openrouter_model: str = "meta-llama/llama-3-8b-instruct:free"
    openrouter_base_url: str = "https://openrouter.ai/api/v1/chat/completions"

    # Overpass
    overpass_url: str = "https://overpass-api.de/api/interpreter"
    overpass_radius_m: int = 10000  # 10km default (overpass.py handles retry at 20km)

    # Analysis
    request_timeout_s: int = 15
    enable_playwright: bool = False
    enable_lighthouse: bool = False

    # Search
    default_result_limit: int = 20

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()