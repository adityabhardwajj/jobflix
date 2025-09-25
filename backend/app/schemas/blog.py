"""
Blog schemas for tech news API
"""

from pydantic import BaseModel, Field, HttpUrl, validator
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class PostStatus(str, Enum):
    PUBLISHED = "published"
    DRAFT = "draft"
    ARCHIVED = "archived"


class IngestionStatus(str, Enum):
    SUCCESS = "success"
    ERROR = "error"
    PARTIAL = "partial"


# Base schemas
class BlogPostBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=500, description="Article title")
    excerpt: Optional[str] = Field(None, description="Article excerpt/summary")
    content_html: Optional[str] = Field(None, description="Full article content in HTML")
    cover_image_url: Optional[HttpUrl] = Field(None, description="Cover image URL")
    source_name: str = Field(..., min_length=1, max_length=100, description="News source name")
    source_url: Optional[HttpUrl] = Field(None, description="Original source URL")
    author: Optional[str] = Field(None, max_length=200, description="Article author")
    published_at: datetime = Field(..., description="Publication date")
    tags: List[str] = Field(default_factory=list, description="Article tags")
    canonical_url: HttpUrl = Field(..., description="Canonical URL for deduplication")
    og_title: Optional[str] = Field(None, max_length=500, description="Open Graph title")
    og_description: Optional[str] = Field(None, description="Open Graph description")
    og_image: Optional[HttpUrl] = Field(None, description="Open Graph image URL")
    is_published: bool = Field(True, description="Publication status")
    is_featured: bool = Field(False, description="Featured article flag")


class BlogPostCreate(BlogPostBase):
    slug: Optional[str] = Field(None, max_length=255, description="URL slug (auto-generated if not provided)")
    
    @validator('slug', pre=True, always=True)
    def generate_slug(cls, v, values):
        if not v and 'title' in values:
            # Generate slug from title
            import re
            slug = re.sub(r'[^\w\s-]', '', values['title'].lower())
            slug = re.sub(r'[-\s]+', '-', slug)
            return slug[:255]
        return v


class BlogPostUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    excerpt: Optional[str] = None
    content_html: Optional[str] = None
    cover_image_url: Optional[HttpUrl] = None
    source_url: Optional[HttpUrl] = None
    author: Optional[str] = Field(None, max_length=200)
    published_at: Optional[datetime] = None
    tags: Optional[List[str]] = None
    og_title: Optional[str] = Field(None, max_length=500)
    og_description: Optional[str] = None
    og_image: Optional[HttpUrl] = None
    is_published: Optional[bool] = None
    is_featured: Optional[bool] = None


class BlogPost(BlogPostBase):
    id: int
    slug: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class BlogPostList(BaseModel):
    id: int
    slug: str
    title: str
    excerpt: Optional[str]
    cover_image_url: Optional[str]
    source_name: str
    author: Optional[str]
    published_at: datetime
    tags: List[str]
    og_image: Optional[str]
    is_featured: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# Query parameters
class PostFilters(BaseModel):
    source: Optional[str] = Field(None, description="Filter by source name")
    tag: Optional[str] = Field(None, description="Filter by tag")
    author: Optional[str] = Field(None, description="Filter by author")
    date_from: Optional[datetime] = Field(None, description="Filter posts from date")
    date_to: Optional[datetime] = Field(None, description="Filter posts to date")
    search: Optional[str] = Field(None, description="Search in title and excerpt")
    featured_only: Optional[bool] = Field(False, description="Show only featured posts")
    published_only: Optional[bool] = Field(True, description="Show only published posts")


class PostListResponse(BaseModel):
    posts: List[BlogPostList]
    total: int
    page: int
    page_size: int
    total_pages: int
    has_next: bool
    has_prev: bool


# News source schemas
class NewsSourceBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    api_endpoint: Optional[HttpUrl] = None
    is_active: bool = Field(True)
    config: Dict[str, Any] = Field(default_factory=dict)


class NewsSourceCreate(NewsSourceBase):
    api_key: Optional[str] = Field(None, max_length=200)


class NewsSourceUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    api_endpoint: Optional[HttpUrl] = None
    api_key: Optional[str] = Field(None, max_length=200)
    is_active: Optional[bool] = None
    config: Optional[Dict[str, Any]] = None


class NewsSource(NewsSourceBase):
    id: int
    last_ingested_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Ingestion schemas
class IngestionRequest(BaseModel):
    source_name: Optional[str] = Field(None, description="Specific source to ingest (all if not provided)")
    force_refresh: bool = Field(False, description="Force refresh even if recently ingested")
    max_articles: Optional[int] = Field(100, ge=1, le=1000, description="Maximum articles to fetch")


class IngestionLog(BaseModel):
    id: int
    source_name: str
    status: IngestionStatus
    articles_found: int
    articles_processed: int
    articles_created: int
    articles_updated: int
    articles_skipped: int
    error_message: Optional[str]
    started_at: datetime
    completed_at: Optional[datetime]
    duration_seconds: Optional[int]
    
    class Config:
        from_attributes = True


class IngestionResponse(BaseModel):
    success: bool
    message: str
    log: IngestionLog
    articles_processed: int
    new_articles: int
    updated_articles: int


# External API response schemas (for NewsAPI, etc.)
class ExternalArticle(BaseModel):
    title: str
    description: Optional[str] = None
    content: Optional[str] = None
    url: HttpUrl
    urlToImage: Optional[HttpUrl] = None
    publishedAt: datetime
    source: Dict[str, str]
    author: Optional[str] = None


class ExternalAPIResponse(BaseModel):
    status: str
    totalResults: int
    articles: List[ExternalArticle]



