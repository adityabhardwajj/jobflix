"""
Blog models for tech news articles
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, JSON, Index, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid

from app.core.database import Base


class BlogPost(Base):
    __tablename__ = "blog_posts"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    title = Column(String(500), nullable=False, index=True)
    excerpt = Column(Text, nullable=True)
    content_html = Column(Text, nullable=True)
    cover_image_url = Column(String(1000), nullable=True)
    
    # Source information
    source_name = Column(String(100), nullable=False, index=True)
    source_url = Column(String(1000), nullable=True)
    author = Column(String(200), nullable=True)
    published_at = Column(DateTime(timezone=True), nullable=False, index=True)
    
    # Tags and metadata
    tags = Column(JSON, nullable=True, default=list)
    canonical_url = Column(String(1000), unique=True, nullable=False, index=True)
    
    # Open Graph metadata
    og_title = Column(String(500), nullable=True)
    og_description = Column(Text, nullable=True)
    og_image = Column(String(1000), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Status
    is_published = Column(Boolean, default=True, nullable=False)
    is_featured = Column(Boolean, default=False, nullable=False)
    
    # Indexes for performance
    __table_args__ = (
        Index('idx_posts_published_at', 'published_at'),
        Index('idx_posts_source_published', 'source_name', 'published_at'),
        Index('idx_posts_tags_gin', 'tags', postgresql_using='gin'),
        UniqueConstraint('canonical_url', name='uq_posts_canonical_url'),
    )


class NewsSource(Base):
    __tablename__ = "news_sources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)
    api_endpoint = Column(String(500), nullable=True)
    api_key = Column(String(200), nullable=True)
    last_ingested_at = Column(DateTime(timezone=True), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Configuration
    config = Column(JSON, nullable=True, default=dict)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class IngestionLog(Base):
    __tablename__ = "ingestion_logs"

    id = Column(Integer, primary_key=True, index=True)
    source_name = Column(String(100), nullable=False, index=True)
    status = Column(String(50), nullable=False, index=True)  # success, error, partial
    articles_found = Column(Integer, default=0, nullable=False)
    articles_processed = Column(Integer, default=0, nullable=False)
    articles_created = Column(Integer, default=0, nullable=False)
    articles_updated = Column(Integer, default=0, nullable=False)
    articles_skipped = Column(Integer, default=0, nullable=False)
    error_message = Column(Text, nullable=True)
    
    # Timestamps
    started_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    duration_seconds = Column(Integer, nullable=True)





