"""
API v1 router configuration
"""

from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, jobs, companies, applications, ai, notifications, blog, enhanced_news

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
api_router.include_router(companies.router, prefix="/companies", tags=["companies"])
api_router.include_router(applications.router, prefix="/applications", tags=["applications"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
api_router.include_router(blog.router, prefix="/blog", tags=["blog"])
api_router.include_router(enhanced_news.router, prefix="/news", tags=["enhanced-news"])
