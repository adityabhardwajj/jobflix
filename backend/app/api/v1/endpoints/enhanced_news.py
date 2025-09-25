"""
Enhanced News API endpoints for comprehensive news aggregation
"""

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any, List, Optional
import structlog

from app.core.database import get_async_db
from app.services.enhanced_news_aggregator import EnhancedNewsAggregator
from app.schemas.blog import BlogResponse, BlogPost as BlogPostSchema
from app.models.blog import BlogPost
from sqlalchemy import select, desc, func
from datetime import datetime, timedelta

logger = structlog.get_logger(__name__)

router = APIRouter()

@router.post("/ingest-enhanced", response_model=Dict[str, Any])
async def ingest_enhanced_news(
    background_tasks: BackgroundTasks,
    max_articles: int = 200,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Trigger enhanced news ingestion from all renowned sources
    
    Sources include:
    - TechCrunch, The Verge, Wired, Ars Technica
    - VentureBeat, MIT Technology Review, TechRadar
    - ZDNet, Mashable, Fast Company, IEEE Spectrum
    - NewsAPI integration
    - Dev.to community
    - Hacker News
    """
    try:
        logger.info("Starting enhanced news ingestion", max_articles=max_articles)
        
        async with EnhancedNewsAggregator() as aggregator:
            result = await aggregator.aggregate_all_sources(db, max_articles)
            
        logger.info("Enhanced news ingestion completed", result=result)
        
        return {
            "success": True,
            "message": "Enhanced news ingestion completed successfully",
            "data": result,
            "sources": [
                "TechCrunch", "The Verge", "Wired", "Ars Technica",
                "VentureBeat", "MIT Technology Review", "TechRadar",
                "ZDNet", "Mashable", "Fast Company", "IEEE Spectrum",
                "NewsAPI", "Dev.to", "Hacker News"
            ]
        }
        
    except Exception as e:
        logger.error("Enhanced news ingestion failed", error=str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Enhanced news ingestion failed: {str(e)}"
        )

@router.get("/sources", response_model=Dict[str, Any])
async def get_news_sources():
    """Get list of all configured news sources"""
    
    sources = {
        "rss_feeds": [
            {"name": "TechCrunch", "category": "startup", "type": "rss"},
            {"name": "The Verge", "category": "tech", "type": "rss"},
            {"name": "Wired", "category": "tech", "type": "rss"},
            {"name": "Ars Technica", "category": "tech", "type": "rss"},
            {"name": "Engadget", "category": "gadgets", "type": "rss"},
            {"name": "VentureBeat", "category": "business", "type": "rss"},
            {"name": "MIT Technology Review", "category": "research", "type": "rss"},
            {"name": "TechRadar", "category": "reviews", "type": "rss"},
            {"name": "ZDNet", "category": "enterprise", "type": "rss"},
            {"name": "Mashable Tech", "category": "social", "type": "rss"},
            {"name": "Fast Company Tech", "category": "innovation", "type": "rss"},
            {"name": "IEEE Spectrum", "category": "engineering", "type": "rss"}
        ],
        "api_sources": [
            {"name": "NewsAPI", "type": "api", "domains": 15},
            {"name": "Dev.to", "type": "api", "category": "developer"},
            {"name": "Hacker News", "type": "api", "category": "tech"}
        ],
        "total_sources": 15,
        "update_frequency": "Every hour",
        "last_updated": datetime.utcnow().isoformat()
    }
    
    return sources

@router.get("/stats", response_model=Dict[str, Any])
async def get_news_stats(db: AsyncSession = Depends(get_async_db)):
    """Get comprehensive news statistics"""
    
    try:
        # Total articles
        total_result = await db.execute(select(func.count(BlogPost.id)))
        total_articles = total_result.scalar()
        
        # Articles from last 24 hours
        yesterday = datetime.utcnow() - timedelta(days=1)
        recent_result = await db.execute(
            select(func.count(BlogPost.id)).where(BlogPost.published_at >= yesterday)
        )
        recent_articles = recent_result.scalar()
        
        # Articles by source
        source_result = await db.execute(
            select(BlogPost.source_name, func.count(BlogPost.id))
            .group_by(BlogPost.source_name)
            .order_by(desc(func.count(BlogPost.id)))
        )
        sources_stats = {source: count for source, count in source_result.fetchall()}
        
        # Articles by category/tag
        tag_result = await db.execute(
            select(func.unnest(BlogPost.tags).label('tag'), func.count().label('count'))
            .group_by('tag')
            .order_by(desc('count'))
            .limit(10)
        )
        top_tags = {tag: count for tag, count in tag_result.fetchall()}
        
        # Featured articles count
        featured_result = await db.execute(
            select(func.count(BlogPost.id)).where(BlogPost.is_featured == True)
        )
        featured_count = featured_result.scalar()
        
        return {
            "total_articles": total_articles,
            "recent_articles_24h": recent_articles,
            "featured_articles": featured_count,
            "sources_breakdown": sources_stats,
            "top_categories": top_tags,
            "last_updated": datetime.utcnow().isoformat(),
            "active_sources": len(sources_stats)
        }
        
    except Exception as e:
        logger.error("Error fetching news stats", error=str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching news stats: {str(e)}"
        )

@router.get("/trending", response_model=BlogResponse)
async def get_trending_news(
    limit: int = 20,
    hours: int = 24,
    db: AsyncSession = Depends(get_async_db)
):
    """Get trending news articles from the last N hours"""
    
    try:
        cutoff_time = datetime.utcnow() - timedelta(hours=hours)
        
        # Get recent articles, prioritizing featured ones
        result = await db.execute(
            select(BlogPost)
            .where(BlogPost.published_at >= cutoff_time)
            .order_by(desc(BlogPost.is_featured), desc(BlogPost.published_at))
            .limit(limit)
        )
        
        articles = result.scalars().all()
        
        return BlogResponse(
            posts=[BlogPostSchema.from_orm(article) for article in articles],
            total=len(articles),
            page=1,
            page_size=limit,
            total_pages=1,
            has_next=False,
            has_prev=False
        )
        
    except Exception as e:
        logger.error("Error fetching trending news", error=str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching trending news: {str(e)}"
        )

@router.get("/by-source/{source_name}", response_model=BlogResponse)
async def get_news_by_source(
    source_name: str,
    page: int = 1,
    page_size: int = 20,
    db: AsyncSession = Depends(get_async_db)
):
    """Get news articles from a specific source"""
    
    try:
        offset = (page - 1) * page_size
        
        # Get articles from specific source
        result = await db.execute(
            select(BlogPost)
            .where(BlogPost.source_name.ilike(f"%{source_name}%"))
            .order_by(desc(BlogPost.published_at))
            .offset(offset)
            .limit(page_size)
        )
        
        articles = result.scalars().all()
        
        # Get total count
        count_result = await db.execute(
            select(func.count(BlogPost.id))
            .where(BlogPost.source_name.ilike(f"%{source_name}%"))
        )
        total = count_result.scalar()
        
        total_pages = (total + page_size - 1) // page_size
        
        return BlogResponse(
            posts=[BlogPostSchema.from_orm(article) for article in articles],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
            has_next=page < total_pages,
            has_prev=page > 1
        )
        
    except Exception as e:
        logger.error("Error fetching news by source", error=str(e), source=source_name)
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching news by source: {str(e)}"
        )

@router.post("/refresh-source/{source_name}")
async def refresh_specific_source(
    source_name: str,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_async_db)
):
    """Refresh articles from a specific source"""
    
    try:
        logger.info("Refreshing specific source", source=source_name)
        
        # This would trigger refresh for specific source
        # For now, we'll trigger a full refresh
        async with EnhancedNewsAggregator() as aggregator:
            result = await aggregator.aggregate_all_sources(db, 50)
        
        return {
            "success": True,
            "message": f"Refresh triggered for {source_name}",
            "data": result
        }
        
    except Exception as e:
        logger.error("Error refreshing source", error=str(e), source=source_name)
        raise HTTPException(
            status_code=500,
            detail=f"Error refreshing source: {str(e)}"
        )
