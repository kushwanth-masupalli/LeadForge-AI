from fastapi import FastAPI 
from fastapi.middleware.cors import CORSMiddleware 
from contextlib import asynccontextmanager

from database import init_db
from api.routes import search, leads, analyze, outreach, export


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    title="LeadForge AI",
    description="Automated lead discovery, website analysis, and AI outreach generation.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(search.router, prefix="/api", tags=["Search"])
app.include_router(leads.router, prefix="/api", tags=["Leads"])
app.include_router(analyze.router, prefix="/api", tags=["Analyze"])
app.include_router(outreach.router, prefix="/api", tags=["Outreach"])
app.include_router(export.router, prefix="/api", tags=["Export"])


@app.get("/")
async def root():
    return {"message": "LeadForge AI is running", "docs": "/docs"}