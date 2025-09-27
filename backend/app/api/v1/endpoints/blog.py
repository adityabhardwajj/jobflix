"""
Blog API endpoints for tech news
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query, Path
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_, func, desc, asc
from typing import List, Optional
import structlog
from datetime import datetime, timedelta

from app.core.database import get_async_db
from app.core.security import get_current_user_id, require_admin
from app.schemas.blog import (
    BlogPost, BlogPostCreate, BlogPostUpdate, BlogPostList,
    PostListResponse, PostFilters, IngestionRequest, IngestionResponse,
    NewsSource, NewsSourceCreate, NewsSourceUpdate, IngestionLog
)
from app.models.blog import BlogPost as BlogPostModel, NewsSource as NewsSourceModel, IngestionLog as IngestionLogModel
from app.core.exceptions import NotFoundError, ForbiddenError
from app.services.news_ingestion import NewsIngestionService

logger = structlog.get_logger(__name__)
router = APIRouter()


@router.get("/posts", response_model=PostListResponse)
async def get_posts(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Number of posts per page"),
    source: Optional[str] = Query(None, description="Filter by source name"),
    tag: Optional[str] = Query(None, description="Filter by tag"),
    author: Optional[str] = Query(None, description="Filter by author"),
    date_from: Optional[datetime] = Query(None, description="Filter posts from date"),
    date_to: Optional[datetime] = Query(None, description="Filter posts to date"),
    search: Optional[str] = Query(None, description="Search in title and excerpt"),
    featured_only: bool = Query(False, description="Show only featured posts"),
    published_only: bool = Query(True, description="Show only published posts"),
    sort_by: str = Query("published_at", description="Sort field"),
    sort_order: str = Query("desc", description="Sort order (asc/desc)"),
    db: AsyncSession = Depends(get_async_db)
):
    """Get paginated list of blog posts with filtering and search"""
    
    # Build query
    query = select(BlogPostModel)
    
    # Apply filters
    conditions = []
    
    if published_only:
        conditions.append(BlogPostModel.is_published == True)
    
    if featured_only:
        conditions.append(BlogPostModel.is_featured == True)
    
    if source:
        conditions.append(BlogPostModel.source_name.ilike(f"%{source}%"))
    
    if author:
        conditions.append(BlogPostModel.author.ilike(f"%{author}%"))
    
    if date_from:
        conditions.append(BlogPostModel.published_at >= date_from)
    
    if date_to:
        conditions.append(BlogPostModel.published_at <= date_to)
    
    if tag:
        conditions.append(BlogPostModel.tags.contains([tag]))
    
    if search:
        search_condition = or_(
            BlogPostModel.title.ilike(f"%{search}%"),
            BlogPostModel.excerpt.ilike(f"%{search}%")
        )
        conditions.append(search_condition)
    
    if conditions:
        query = query.where(and_(*conditions))
    
    # Apply sorting
    sort_field = getattr(BlogPostModel, sort_by, BlogPostModel.published_at)
    if sort_order.lower() == "asc":
        query = query.order_by(asc(sort_field))
    else:
        query = query.order_by(desc(sort_field))
    
    # Get total count
    count_query = select(func.count()).select_from(BlogPostModel)
    if conditions:
        count_query = count_query.where(and_(*conditions))
    
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Apply pagination
    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size)
    
    # Execute query
    result = await db.execute(query)
    posts = result.scalars().all()
    
    # Calculate pagination info
    total_pages = (total + page_size - 1) // page_size
    has_next = page < total_pages
    has_prev = page > 1
    
    return PostListResponse(
        posts=posts,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
        has_next=has_next,
        has_prev=has_prev
    )


@router.get("/posts/{post_id}", response_model=BlogPost)
async def get_post(
    post_id: int = Path(..., description="Post ID"),
    db: AsyncSession = Depends(get_async_db)
):
    """Get a single blog post by ID"""
    
    result = await db.execute(
        select(BlogPostModel).where(BlogPostModel.id == post_id)
    )
    post = result.scalar_one_or_none()
    
    if not post:
        raise NotFoundError("Post not found")
    
    return post


@router.get("/posts/slug/{slug}", response_model=BlogPost)
async def get_post_by_slug(
    slug: str = Path(..., description="Post slug"),
    db: AsyncSession = Depends(get_async_db)
):
    """Get a single blog post by slug"""
    
    result = await db.execute(
        select(BlogPostModel).where(BlogPostModel.slug == slug)
    )
    post = result.scalar_one_or_none()
    
    if not post:
        raise NotFoundError("Post not found")
    
    return post


@router.post("/posts", response_model=BlogPost, status_code=status.HTTP_201_CREATED)
async def create_post(
    post_data: BlogPostCreate,
    current_user_id: int = Depends(require_admin),
    db: AsyncSession = Depends(get_async_db)
):
    """Create a new blog post (admin only)"""
    
    # Check if slug already exists
    existing = await db.execute(
        select(BlogPostModel).where(BlogPostModel.slug == post_data.slug)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Post with this slug already exists"
        )
    
    # Check if canonical URL already exists
    existing_url = await db.execute(
        select(BlogPostModel).where(BlogPostModel.canonical_url == str(post_data.canonical_url))
    )
    if existing_url.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Post with this canonical URL already exists"
        )
    
    # Create new post
    db_post = BlogPostModel(**post_data.dict())
    db.add(db_post)
    await db.commit()
    await db.refresh(db_post)
    
    logger.info("Blog post created", post_id=db_post.id, title=db_post.title, user_id=current_user_id)
    
    return db_post


@router.put("/posts/{post_id}", response_model=BlogPost)
async def update_post(
    post_id: int = Path(..., description="Post ID"),
    post_data: BlogPostUpdate = None,
    current_user_id: int = Depends(require_admin),
    db: AsyncSession = Depends(get_async_db)
):
    """Update a blog post (admin only)"""
    
    result = await db.execute(
        select(BlogPostModel).where(BlogPostModel.id == post_id)
    )
    post = result.scalar_one_or_none()
    
    if not post:
        raise NotFoundError("Post not found")
    
    # Update fields
    update_data = post_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(post, field, value)
    
    post.updated_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(post)
    
    logger.info("Blog post updated", post_id=post_id, user_id=current_user_id)
    
    return post


@router.delete("/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post_id: int = Path(..., description="Post ID"),
    current_user_id: int = Depends(require_admin),
    db: AsyncSession = Depends(get_async_db)
):
    """Delete a blog post (admin only)"""
    
    result = await db.execute(
        select(BlogPostModel).where(BlogPostModel.id == post_id)
    )
    post = result.scalar_one_or_none()
    
    if not post:
        raise NotFoundError("Post not found")
    
    await db.delete(post)
    await db.commit()
    
    logger.info("Blog post deleted", post_id=post_id, user_id=current_user_id)


@router.post("/sources/ingest", response_model=IngestionResponse)
async def ingest_news(
    request: IngestionRequest,
    current_user_id: int = Depends(require_admin),
    db: AsyncSession = Depends(get_async_db)
):
    """Trigger news ingestion from external sources (admin only)"""
    
    # Create ingestion log
    log = IngestionLogModel(
        source_name=request.source_name or "all",
        status="running",
        started_at=datetime.utcnow()
    )
    db.add(log)
    await db.commit()
    await db.refresh(log)
    
    try:
        async with NewsIngestionService() as service:
            total_processed = 0
            total_created = 0
            total_updated = 0
            
            # Ingest from different sources
            sources_to_ingest = []
            if request.source_name:
                sources_to_ingest = [request.source_name]
            else:
                sources_to_ingest = ["NewsAPI", "Dev.to", "Hacker News"]
            
            for source in sources_to_ingest:
                try:
                    if source == "NewsAPI":
                        result = await service.ingest_from_newsapi(db, request.max_articles)
                    elif source == "Dev.to":
                        result = await service.ingest_from_dev_to(db, request.max_articles)
                    elif source == "Hacker News":
                        result = await service.ingest_from_hackernews(db, request.max_articles)
                    else:
                        continue
                    
                    if result.get('success'):
                        total_processed += result.get('total_processed', 0)
                        total_created += result.get('created', 0)
                        total_updated += result.get('updated', 0)
                    
                except Exception as e:
                    logger.error(f"Error ingesting from {source}", error=str(e))
                    continue
            
            # Update log
            log.status = "success" if total_processed > 0 else "error"
            log.articles_found = total_processed
            log.articles_processed = total_processed
            log.articles_created = total_created
            log.articles_updated = total_updated
            log.completed_at = datetime.utcnow()
            log.duration_seconds = int((log.completed_at - log.started_at).total_seconds())
            
            await db.commit()
            
            return IngestionResponse(
                success=True,
                message=f"Successfully ingested {total_processed} articles",
                log=log,
                articles_processed=total_processed,
                new_articles=total_created,
                updated_articles=total_updated
            )
            
    except Exception as e:
        # Update log with error
        log.status = "error"
        log.error_message = str(e)
        log.completed_at = datetime.utcnow()
        log.duration_seconds = int((log.completed_at - log.started_at).total_seconds())
        await db.commit()
        
        logger.error("News ingestion failed", error=str(e), user_id=current_user_id)
        
        return IngestionResponse(
            success=False,
            message=f"Ingestion failed: {str(e)}",
            log=log,
            articles_processed=0,
            new_articles=0,
            updated_articles=0
        )


@router.get("/sources", response_model=List[NewsSource])
async def get_news_sources(
    db: AsyncSession = Depends(get_async_db)
):
    """Get list of news sources"""
    
    result = await db.execute(select(NewsSourceModel))
    sources = result.scalars().all()
    
    return sources


@router.post("/sources", response_model=NewsSource, status_code=status.HTTP_201_CREATED)
async def create_news_source(
    source_data: NewsSourceCreate,
    current_user_id: int = Depends(require_admin),
    db: AsyncSession = Depends(get_async_db)
):
    """Create a new news source (admin only)"""
    
    # Check if source already exists
    existing = await db.execute(
        select(NewsSourceModel).where(NewsSourceModel.name == source_data.name)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="News source with this name already exists"
        )
    
    db_source = NewsSourceModel(**source_data.dict())
    db.add(db_source)
    await db.commit()
    await db.refresh(db_source)
    
    logger.info("News source created", source_id=db_source.id, name=db_source.name, user_id=current_user_id)
    
    return db_source


@router.get("/ingestion-logs", response_model=List[IngestionLog])
async def get_ingestion_logs(
    limit: int = Query(50, ge=1, le=100, description="Number of logs to return"),
    db: AsyncSession = Depends(get_async_db)
):
    """Get recent ingestion logs"""
    
    result = await db.execute(
        select(IngestionLogModel)
        .order_by(desc(IngestionLogModel.started_at))
        .limit(limit)
    )
    logs = result.scalars().all()
    
    return logs


@router.get("/stats")
async def get_blog_stats(
    db: AsyncSession = Depends(get_async_db)
):
    """Get blog statistics"""
    
    # Total posts
    total_posts_result = await db.execute(select(func.count(BlogPostModel.id)))
    total_posts = total_posts_result.scalar()
    
    # Published posts
    published_posts_result = await db.execute(
        select(func.count(BlogPostModel.id)).where(BlogPostModel.is_published == True)
    )
    published_posts = published_posts_result.scalar()
    
    # Featured posts
    featured_posts_result = await db.execute(
        select(func.count(BlogPostModel.id)).where(BlogPostModel.is_featured == True)
    )
    featured_posts = featured_posts_result.scalar()
    
    # Posts by source
    sources_result = await db.execute(
        select(BlogPostModel.source_name, func.count(BlogPostModel.id))
        .group_by(BlogPostModel.source_name)
        .order_by(desc(func.count(BlogPostModel.id)))
    )
    posts_by_source = dict(sources_result.fetchall())
    
    # Recent posts (last 7 days)
    week_ago = datetime.utcnow() - timedelta(days=7)
    recent_posts_result = await db.execute(
        select(func.count(BlogPostModel.id))
        .where(BlogPostModel.published_at >= week_ago)
    )
    recent_posts = recent_posts_result.scalar()
    
    return {
        "total_posts": total_posts,
        "published_posts": published_posts,
        "featured_posts": featured_posts,
        "recent_posts": recent_posts,
        "posts_by_source": posts_by_source
    }





