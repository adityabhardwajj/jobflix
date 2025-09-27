"""
News ingestion service for fetching real tech news from external APIs
"""

import asyncio
import aiohttp
import structlog
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from urllib.parse import urljoin, urlparse
import re
from bs4 import BeautifulSoup
import hashlib

from app.core.config import settings
from app.schemas.blog import ExternalArticle, ExternalAPIResponse, BlogPostCreate
from app.models.blog import BlogPost, NewsSource, IngestionLog
from app.core.database import get_async_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_

logger = structlog.get_logger(__name__)


class NewsIngestionService:
    def __init__(self):
        self.session: Optional[aiohttp.ClientSession] = None
        self.rate_limit_delay = 1.0  # seconds between requests
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession(
            timeout=aiohttp.ClientTimeout(total=30),
            headers={
                'User-Agent': 'JobFlix-TechNews/1.0 (https://jobflix.com)'
            }
        )
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()

    async def ingest_from_newsapi(self, db: AsyncSession, max_articles: int = 100) -> Dict[str, Any]:
        """Ingest tech news from NewsAPI"""
        if not settings.NEWS_API_KEY:
            raise ValueError("NEWS_API_KEY not configured")
            
        logger.info("Starting NewsAPI ingestion", max_articles=max_articles)
        
        # NewsAPI endpoints for tech news
        endpoints = [
            {
                'url': 'https://newsapi.org/v2/everything',
                'params': {
                    'q': 'technology OR programming OR software OR AI OR machine learning',
                    'domains': 'techcrunch.com,arstechnica.com,theverge.com,wired.com,engadget.com',
                    'language': 'en',
                    'sortBy': 'publishedAt',
                    'pageSize': min(max_articles, 100),
                    'apiKey': settings.NEWS_API_KEY
                }
            },
            {
                'url': 'https://newsapi.org/v2/top-headlines',
                'params': {
                    'category': 'technology',
                    'language': 'en',
                    'pageSize': min(max_articles, 100),
                    'apiKey': settings.NEWS_API_KEY
                }
            }
        ]
        
        all_articles = []
        
        for endpoint in endpoints:
            try:
                await asyncio.sleep(self.rate_limit_delay)
                async with self.session.get(endpoint['url'], params=endpoint['params']) as response:
                    if response.status == 200:
                        data = await response.json()
                        if data.get('status') == 'ok':
                            all_articles.extend(data.get('articles', []))
                            logger.info(f"Fetched {len(data.get('articles', []))} articles from {endpoint['url']}")
                    else:
                        logger.warning(f"NewsAPI request failed", status=response.status, url=endpoint['url'])
                        
            except Exception as e:
                logger.error(f"Error fetching from NewsAPI", error=str(e), url=endpoint['url'])
        
        # Process and deduplicate articles
        processed_articles = await self._process_newsapi_articles(all_articles)
        
        # Save to database
        result = await self._save_articles_to_db(db, processed_articles, 'NewsAPI')
        
        return result

    async def ingest_from_dev_to(self, db: AsyncSession, max_articles: int = 100) -> Dict[str, Any]:
        """Ingest tech articles from Dev.to API"""
        logger.info("Starting Dev.to ingestion", max_articles=max_articles)
        
        try:
            # Dev.to API endpoint
            url = 'https://dev.to/api/articles'
            params = {
                'tag': 'javascript,python,react,nodejs,webdev,programming',
                'per_page': min(max_articles, 1000),
                'top': 7  # Last 7 days
            }
            
            await asyncio.sleep(self.rate_limit_delay)
            async with self.session.get(url, params=params) as response:
                if response.status == 200:
                    articles = await response.json()
                    processed_articles = await self._process_devto_articles(articles)
                    result = await self._save_articles_to_db(db, processed_articles, 'Dev.to')
                    return result
                else:
                    logger.warning(f"Dev.to API request failed", status=response.status)
                    return {'success': False, 'error': f'API request failed with status {response.status}'}
                    
        except Exception as e:
            logger.error(f"Error fetching from Dev.to", error=str(e))
            return {'success': False, 'error': str(e)}

    async def ingest_from_hackernews(self, db: AsyncSession, max_articles: int = 100) -> Dict[str, Any]:
        """Ingest tech stories from Hacker News API"""
        logger.info("Starting Hacker News ingestion", max_articles=max_articles)
        
        try:
            # Get top stories
            async with self.session.get('https://hacker-news.firebaseio.com/v0/topstories.json') as response:
                if response.status == 200:
                    story_ids = await response.json()
                    
                    # Fetch story details (limit to max_articles)
                    stories = []
                    for story_id in story_ids[:max_articles]:
                        await asyncio.sleep(0.1)  # Rate limiting
                        async with self.session.get(f'https://hacker-news.firebaseio.com/v0/item/{story_id}.json') as story_response:
                            if story_response.status == 200:
                                story = await story_response.json()
                                if story and story.get('type') == 'story' and story.get('url'):
                                    stories.append(story)
                    
                    processed_articles = await self._process_hackernews_articles(stories)
                    result = await self._save_articles_to_db(db, processed_articles, 'Hacker News')
                    return result
                else:
                    logger.warning(f"Hacker News API request failed", status=response.status)
                    return {'success': False, 'error': f'API request failed with status {response.status}'}
                    
        except Exception as e:
            logger.error(f"Error fetching from Hacker News", error=str(e))
            return {'success': False, 'error': str(e)}

    async def _process_newsapi_articles(self, articles: List[Dict]) -> List[BlogPostCreate]:
        """Process NewsAPI articles into BlogPostCreate objects"""
        processed = []
        
        for article in articles:
            try:
                # Extract and clean data
                title = article.get('title', '').strip()
                if not title:
                    continue
                    
                description = article.get('description', '').strip()
                content = article.get('content', '').strip()
                url = article.get('url', '')
                url_to_image = article.get('urlToImage', '')
                published_at = article.get('publishedAt', '')
                source = article.get('source', {})
                author = article.get('author', '').strip()
                
                # Parse published date
                try:
                    if published_at:
                        published_at = datetime.fromisoformat(published_at.replace('Z', '+00:00'))
                    else:
                        published_at = datetime.utcnow()
                except:
                    published_at = datetime.utcnow()
                
                # Generate tags from title and description
                tags = self._extract_tags(title, description)
                
                # Create BlogPostCreate object
                post = BlogPostCreate(
                    title=title,
                    excerpt=description,
                    content_html=content,
                    cover_image_url=url_to_image,
                    source_name=source.get('name', 'Unknown'),
                    source_url=url,
                    author=author,
                    published_at=published_at,
                    tags=tags,
                    canonical_url=url,
                    og_title=title,
                    og_description=description,
                    og_image=url_to_image
                )
                
                processed.append(post)
                
            except Exception as e:
                logger.warning(f"Error processing NewsAPI article", error=str(e), article=article.get('title', 'Unknown'))
                continue
        
        return processed

    async def _process_devto_articles(self, articles: List[Dict]) -> List[BlogPostCreate]:
        """Process Dev.to articles into BlogPostCreate objects"""
        processed = []
        
        for article in articles:
            try:
                title = article.get('title', '').strip()
                if not title:
                    continue
                
                description = article.get('description', '').strip()
                body_html = article.get('body_html', '')
                cover_image = article.get('cover_image', '')
                url = article.get('url', '')
                published_at = article.get('published_at', '')
                user = article.get('user', {})
                tag_list = article.get('tag_list', [])
                
                # Parse published date
                try:
                    if published_at:
                        published_at = datetime.fromisoformat(published_at.replace('Z', '+00:00'))
                    else:
                        published_at = datetime.utcnow()
                except:
                    published_at = datetime.utcnow()
                
                # Create BlogPostCreate object
                post = BlogPostCreate(
                    title=title,
                    excerpt=description,
                    content_html=body_html,
                    cover_image_url=cover_image,
                    source_name='Dev.to',
                    source_url=url,
                    author=user.get('name', ''),
                    published_at=published_at,
                    tags=tag_list,
                    canonical_url=url,
                    og_title=title,
                    og_description=description,
                    og_image=cover_image
                )
                
                processed.append(post)
                
            except Exception as e:
                logger.warning(f"Error processing Dev.to article", error=str(e), article=article.get('title', 'Unknown'))
                continue
        
        return processed

    async def _process_hackernews_articles(self, articles: List[Dict]) -> List[BlogPostCreate]:
        """Process Hacker News articles into BlogPostCreate objects"""
        processed = []
        
        for article in articles:
            try:
                title = article.get('title', '').strip()
                if not title:
                    continue
                
                url = article.get('url', '')
                score = article.get('score', 0)
                descendants = article.get('descendants', 0)
                time = article.get('time', 0)
                
                # Convert Unix timestamp to datetime
                try:
                    published_at = datetime.fromtimestamp(time)
                except:
                    published_at = datetime.utcnow()
                
                # Generate description from title and metadata
                description = f"Score: {score} points, {descendants} comments"
                
                # Extract domain for source
                source_name = 'Hacker News'
                if url:
                    try:
                        domain = urlparse(url).netloc
                        source_name = f"HN - {domain}"
                    except:
                        pass
                
                # Generate tags
                tags = ['hacker-news', 'tech']
                if score > 100:
                    tags.append('popular')
                
                # Create BlogPostCreate object
                post = BlogPostCreate(
                    title=title,
                    excerpt=description,
                    content_html=None,
                    cover_image_url=None,
                    source_name=source_name,
                    source_url=url,
                    author=None,
                    published_at=published_at,
                    tags=tags,
                    canonical_url=url,
                    og_title=title,
                    og_description=description,
                    og_image=None
                )
                
                processed.append(post)
                
            except Exception as e:
                logger.warning(f"Error processing Hacker News article", error=str(e), article=article.get('title', 'Unknown'))
                continue
        
        return processed

    async def _save_articles_to_db(self, db: AsyncSession, articles: List[BlogPostCreate], source_name: str) -> Dict[str, Any]:
        """Save articles to database with deduplication"""
        created_count = 0
        updated_count = 0
        skipped_count = 0
        
        for article in articles:
            try:
                # Check for existing article by canonical_url
                existing = await db.execute(
                    select(BlogPost).where(BlogPost.canonical_url == str(article.canonical_url))
                )
                existing_post = existing.scalar_one_or_none()
                
                if existing_post:
                    # Update existing post if published_at is newer
                    if article.published_at > existing_post.published_at:
                        for field, value in article.dict(exclude_unset=True).items():
                            setattr(existing_post, field, value)
                        existing_post.updated_at = datetime.utcnow()
                        updated_count += 1
                    else:
                        skipped_count += 1
                else:
                    # Create new post
                    db_article = BlogPost(**article.dict())
                    db.add(db_article)
                    created_count += 1
                    
            except Exception as e:
                logger.warning(f"Error saving article to database", error=str(e), title=article.title)
                skipped_count += 1
                continue
        
        try:
            await db.commit()
            logger.info(f"Successfully saved articles from {source_name}", 
                       created=created_count, updated=updated_count, skipped=skipped_count)
            
            return {
                'success': True,
                'created': created_count,
                'updated': updated_count,
                'skipped': skipped_count,
                'total_processed': len(articles)
            }
            
        except Exception as e:
            await db.rollback()
            logger.error(f"Error committing articles to database", error=str(e))
            return {
                'success': False,
                'error': str(e),
                'created': created_count,
                'updated': updated_count,
                'skipped': skipped_count
            }

    def _extract_tags(self, title: str, description: str) -> List[str]:
        """Extract relevant tags from title and description"""
        text = f"{title} {description}".lower()
        
        # Tech-related keywords
        tech_keywords = {
            'javascript': ['javascript', 'js', 'node.js', 'nodejs', 'react', 'vue', 'angular'],
            'python': ['python', 'django', 'flask', 'fastapi', 'pandas', 'numpy'],
            'ai': ['ai', 'artificial intelligence', 'machine learning', 'ml', 'deep learning', 'neural network'],
            'web': ['web development', 'frontend', 'backend', 'full stack', 'html', 'css'],
            'mobile': ['mobile', 'ios', 'android', 'react native', 'flutter'],
            'cloud': ['cloud', 'aws', 'azure', 'google cloud', 'docker', 'kubernetes'],
            'data': ['data science', 'big data', 'analytics', 'database', 'sql'],
            'security': ['security', 'cybersecurity', 'encryption', 'privacy'],
            'startup': ['startup', 'entrepreneur', 'funding', 'venture capital'],
            'programming': ['programming', 'coding', 'software development', 'devops']
        }
        
        tags = []
        for tag, keywords in tech_keywords.items():
            if any(keyword in text for keyword in keywords):
                tags.append(tag)
        
        # Add some general tags
        if 'tutorial' in text or 'guide' in text:
            tags.append('tutorial')
        if 'news' in text or 'announcement' in text:
            tags.append('news')
        if 'review' in text:
            tags.append('review')
            
        return list(set(tags))  # Remove duplicates





