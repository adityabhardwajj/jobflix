"""Create blog tables

Revision ID: 001
Revises: 
Create Date: 2024-01-15 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Create blog_posts table
    op.create_table('blog_posts',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('slug', sa.String(length=255), nullable=False),
        sa.Column('title', sa.String(length=500), nullable=False),
        sa.Column('excerpt', sa.Text(), nullable=True),
        sa.Column('content_html', sa.Text(), nullable=True),
        sa.Column('cover_image_url', sa.String(length=1000), nullable=True),
        sa.Column('source_name', sa.String(length=100), nullable=False),
        sa.Column('source_url', sa.String(length=1000), nullable=True),
        sa.Column('author', sa.String(length=200), nullable=True),
        sa.Column('published_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('tags', sa.JSON(), nullable=True),
        sa.Column('canonical_url', sa.String(length=1000), nullable=False),
        sa.Column('og_title', sa.String(length=500), nullable=True),
        sa.Column('og_description', sa.Text(), nullable=True),
        sa.Column('og_image', sa.String(length=1000), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('is_published', sa.Boolean(), nullable=False),
        sa.Column('is_featured', sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes for blog_posts
    op.create_index('idx_posts_slug', 'blog_posts', ['slug'], unique=True)
    op.create_index('idx_posts_title', 'blog_posts', ['title'])
    op.create_index('idx_posts_source_name', 'blog_posts', ['source_name'])
    op.create_index('idx_posts_published_at', 'blog_posts', ['published_at'])
    op.create_index('idx_posts_canonical_url', 'blog_posts', ['canonical_url'], unique=True)
    op.create_index('idx_posts_source_published', 'blog_posts', ['source_name', 'published_at'])
    op.create_index('idx_posts_tags_gin', 'blog_posts', ['tags'], postgresql_using='gin')
    
    # Create news_sources table
    op.create_table('news_sources',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('api_endpoint', sa.String(length=500), nullable=True),
        sa.Column('api_key', sa.String(length=200), nullable=True),
        sa.Column('last_ingested_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('config', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes for news_sources
    op.create_index('idx_sources_name', 'news_sources', ['name'], unique=True)
    
    # Create ingestion_logs table
    op.create_table('ingestion_logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('source_name', sa.String(length=100), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=False),
        sa.Column('articles_found', sa.Integer(), nullable=False),
        sa.Column('articles_processed', sa.Integer(), nullable=False),
        sa.Column('articles_created', sa.Integer(), nullable=False),
        sa.Column('articles_updated', sa.Integer(), nullable=False),
        sa.Column('articles_skipped', sa.Integer(), nullable=False),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('started_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('duration_seconds', sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes for ingestion_logs
    op.create_index('idx_logs_source_name', 'ingestion_logs', ['source_name'])
    op.create_index('idx_logs_status', 'ingestion_logs', ['status'])
    op.create_index('idx_logs_started_at', 'ingestion_logs', ['started_at'])


def downgrade():
    # Drop tables in reverse order
    op.drop_table('ingestion_logs')
    op.drop_table('news_sources')
    op.drop_table('blog_posts')



