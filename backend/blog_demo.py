"""
Demo script for the Blog API
"""

from fastapi import FastAPI
import uvicorn
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.api.v1.api import api_router
from app.core.config import settings

app = FastAPI(
    title="JobFlix Blog API Demo",
    description="Production-grade Tech News Blog API",
    version="1.0.0",
)

# Include API router
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "message": "JobFlix Blog API Demo",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc",
        "endpoints": {
            "posts": "/api/v1/blog/posts",
            "ingest": "/api/v1/blog/sources/ingest",
            "stats": "/api/v1/blog/stats"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "JobFlix Blog API",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    print("🚀 Starting JobFlix Blog API Demo...")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("🔍 ReDoc Documentation: http://localhost:8000/redoc")
    print("🏥 Health Check: http://localhost:8000/health")
    print("📰 Blog Posts: http://localhost:8000/api/v1/blog/posts")
    print("📊 Blog Stats: http://localhost:8000/api/v1/blog/stats")
    uvicorn.run(app, host="0.0.0.0", port=8000)
