from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
from datetime import datetime
from api.routes import search

app = FastAPI(
    title="LeadForge AI API",
    description="AI-powered lead generation and digital presence analyzer",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(search.router)

@app.get("/")
async def root():
    return {"message": "LeadForge AI API", "timestamp": datetime.utcnow().isoformat()}

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "leadforge-ai-backend"
    }

@app.get("/api/health/detail")
async def detailed_health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "leadforge-ai-backend",
        "version": "1.0.0",
        "endpoints": {
            "health": "/api/health",
            "search": "/api/search",
            "leads": "/api/leads",
            "analytics": "/api/analytics"
        }
    }

if __name__ == "__main__":
    port = int(os.getenv("BACKEND_PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)