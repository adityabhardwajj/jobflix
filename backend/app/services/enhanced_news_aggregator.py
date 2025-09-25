"""
Enhanced News Aggregation Service
Pulls from multiple renowned tech news sources including TechCrunch, The Verge, Wired, etc.
"""

import asyncio
import aiohttp
import feedparser
import structlog
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import re
from bs4 import BeautifulSoup
import hashlib
from urllib.parse import urljoin, urlparse

from app.core.config import settings
from app.schemas.blog import BlogPostCreate
from app.models.blog import BlogPost
from app.core.database import get_async_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

logger = structlog.get_logger(__name__)

class EnhancedNewsAggregator:
    def __init__(self):
        self.session: Optional[aiohttp.ClientSession] = None
        self.rate_limit_delay = 1.0  # seconds between requests
        
        # Renowned tech news sources
        self.news_sources = {
            'rss_feeds': [
                {
                    'name': 'TechCrunch',
                    'url': 'https://techcrunch.com/feed/',
                    'category': 'startup'
                },
                {
                    'name': 'The Verge',
                    'url': 'https://www.theverge.com/rss/index.xml',
                    'category': 'tech'
                },
                {
                    'name': 'Wired',
                    'url': 'https://www.wired.com/feed/rss',
                    'category': 'tech'
                },
                {
                    'name': 'Ars Technica',
                    'url': 'https://feeds.arstechnica.com/arstechnica/index',
                    'category': 'tech'
                },
                {
                    'name': 'Engadget',
                    'url': 'https://www.engadget.com/rss.xml',
                    'category': 'gadgets'
                },
                {
                    'name': 'VentureBeat',
                    'url': 'https://venturebeat.com/feed/',
                    'category': 'business'
                },
                {
                    'name': 'MIT Technology Review',
                    'url': 'https://www.technologyreview.com/feed/',
                    'category': 'research'
                },
                {
                    'name': 'TechRadar',
                    'url': 'https://www.techradar.com/rss',
                    'category': 'reviews'
                },
                {
                    'name': 'ZDNet',
                    'url': 'https://www.zdnet.com/news/rss.xml',
                    'category': 'enterprise'
                },
                {
                    'name': 'Mashable Tech',
                    'url': 'https://mashable.com/feeds/rss/tech',
                    'category': 'social'
                },
                {
                    'name': 'Fast Company Tech',
                    'url': 'https://www.fastcompany.com/technology/rss',
                    'category': 'innovation'
                },
                {
                    'name': 'IEEE Spectrum',
                    'url': 'https://spectrum.ieee.org/rss/blog/tech-talk',
                    'category': 'engineering'
                }
            ],
            'newsapi_domains': [
                'techcrunch.com',
                'theverge.com', 
                'wired.com',
                'arstechnica.com',
                'engadget.com',
                'venturebeat.com',
                'technologyreview.com',
                'techradar.com',
                'zdnet.com',
                'mashable.com',
                'fastcompany.com',
                'spectrum.ieee.org',
                'recode.net',
                'gizmodo.com',
                'lifehacker.com'
            ]
        }
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession(
            timeout=aiohttp.ClientTimeout(total=30),
            headers={
                'User-Agent': 'JobFlix-NewsAggregator/1.0 (https://jobflix.com)'
            }
        )
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()

    async def aggregate_all_sources(self, db: AsyncSession, max_articles: int = 200) -> Dict[str, Any]:
        """Aggregate news from all renowned sources"""
        logger.info("Starting comprehensive news aggregation", max_articles=max_articles)
        
        all_results = {
            'rss_feeds': [],
            'newsapi': [],
            'dev_to': [],
            'hacker_news': []
        }
        
        # Aggregate from RSS feeds
        rss_results = await self._aggregate_rss_feeds(max_articles // 4)
        all_results['rss_feeds'] = rss_results
        
        # Aggregate from NewsAPI (if configured)
        if hasattr(settings, 'NEWS_API_KEY') and settings.NEWS_API_KEY:
            newsapi_results = await self._aggregate_newsapi(max_articles // 4)
            all_results['newsapi'] = newsapi_results
        
        # Aggregate from Dev.to
        devto_results = await self._aggregate_devto(max_articles // 4)
        all_results['dev_to'] = devto_results
        
        # Aggregate from Hacker News
        hn_results = await self._aggregate_hackernews(max_articles // 4)
        all_results['hacker_news'] = hn_results
        
        # Combine all articles
        all_articles = []
        for source_type, articles in all_results.items():
            if isinstance(articles, list):
                all_articles.extend(articles)
            elif isinstance(articles, dict) and 'articles' in articles:
                all_articles.extend(articles['articles'])
        
        # Remove duplicates and save to database
        unique_articles = await self._deduplicate_articles(all_articles)
        result = await self._save_articles_to_db(db, unique_articles)
        
        logger.info("News aggregation completed", 
                   total_sources=len(all_results),
                   total_articles=len(unique_articles),
                   saved=result.get('created', 0))
        
        return {
            'success': True,
            'sources_processed': len(all_results),
            'total_articles_found': len(all_articles),
            'unique_articles': len(unique_articles),
            'saved_to_db': result.get('created', 0),
            'updated_in_db': result.get('updated', 0),
            'source_breakdown': {k: len(v) if isinstance(v, list) else len(v.get('articles', [])) for k, v in all_results.items()}
        }

    async def _aggregate_rss_feeds(self, max_articles: int) -> List[BlogPostCreate]:
        """Aggregate from RSS feeds of renowned tech publications"""
        logger.info("Aggregating from RSS feeds", sources=len(self.news_sources['rss_feeds']))
        
        all_articles = []
        
        for feed_config in self.news_sources['rss_feeds']:
            try:
                await asyncio.sleep(self.rate_limit_delay)
                
                async with self.session.get(feed_config['url']) as response:
                    if response.status == 200:
                        content = await response.text()
                        feed = feedparser.parse(content)
                        
                        articles = await self._process_rss_feed(feed, feed_config)
                        all_articles.extend(articles)
                        
                        logger.info(f"Processed RSS feed", 
                                   source=feed_config['name'], 
                                   articles=len(articles))
                    else:
                        logger.warning(f"RSS feed request failed", 
                                     source=feed_config['name'], 
                                     status=response.status)
                        
            except Exception as e:
                logger.error(f"Error processing RSS feed", 
                           source=feed_config['name'], 
                           error=str(e))
                continue
        
        # Sort by published date and limit
        all_articles.sort(key=lambda x: x.published_at, reverse=True)
        return all_articles[:max_articles]

    async def _process_rss_feed(self, feed, feed_config) -> List[BlogPostCreate]:
        """Process RSS feed entries into BlogPostCreate objects"""
        articles = []
        
        for entry in feed.entries[:50]:  # Limit per feed
            try:
                # Extract basic info
                title = entry.get('title', '').strip()
                if not title:
                    continue
                
                description = entry.get('description', '') or entry.get('summary', '')
                link = entry.get('link', '')
                author = entry.get('author', '') or feed_config['name']
                
                # Parse published date
                published_at = datetime.utcnow()
                if hasattr(entry, 'published_parsed') and entry.published_parsed:
                    try:
                        published_at = datetime(*entry.published_parsed[:6])
                    except:
                        pass
                elif hasattr(entry, 'updated_parsed') and entry.updated_parsed:
                    try:
                        published_at = datetime(*entry.updated_parsed[:6])
                    except:
                        pass
                
                # Clean description
                if description:
                    # Remove HTML tags
                    soup = BeautifulSoup(description, 'html.parser')
                    description = soup.get_text().strip()
                    # Limit length
                    if len(description) > 500:
                        description = description[:497] + "..."
                
                # Extract image
                cover_image_url = None
                if hasattr(entry, 'media_content') and entry.media_content:
                    cover_image_url = entry.media_content[0].get('url')
                elif hasattr(entry, 'enclosures') and entry.enclosures:
                    for enclosure in entry.enclosures:
                        if enclosure.type and enclosure.type.startswith('image/'):
                            cover_image_url = enclosure.href
                            break
                
                # Generate tags
                tags = [feed_config['category']]
                if hasattr(entry, 'tags') and entry.tags:
                    tags.extend([tag.term for tag in entry.tags[:5]])
                else:
                    # Extract tags from title and description
                    tags.extend(self._extract_tags_from_content(title, description))
                
                # Create article
                article = BlogPostCreate(
                    title=title,
                    excerpt=description,
                    content_html=description,
                    cover_image_url=cover_image_url,
                    source_name=feed_config['name'],
                    source_url=link,
                    author=author,
                    published_at=published_at,
                    tags=list(set(tags)),  # Remove duplicates
                    canonical_url=link,
                    og_title=title,
                    og_description=description,
                    og_image=cover_image_url,
                    is_featured=feed_config['name'] in ['TechCrunch', 'The Verge', 'Wired']
                )
                
                articles.append(article)
                
            except Exception as e:
                logger.warning(f"Error processing RSS entry", 
                             source=feed_config['name'], 
                             error=str(e), 
                             title=entry.get('title', 'Unknown'))
                continue
        
        return articles

    async def _aggregate_newsapi(self, max_articles: int) -> List[BlogPostCreate]:
        """Aggregate from NewsAPI with renowned domains"""
        logger.info("Aggregating from NewsAPI", domains=len(self.news_sources['newsapi_domains']))
        
        if not hasattr(settings, 'NEWS_API_KEY') or not settings.NEWS_API_KEY:
            logger.warning("NewsAPI key not configured, skipping NewsAPI aggregation")
            return []
        
        all_articles = []
        domains_str = ','.join(self.news_sources['newsapi_domains'])
        
        # Everything endpoint with specific domains
        endpoints = [
            {
                'url': 'https://newsapi.org/v2/everything',
                'params': {
                    'domains': domains_str,
                    'language': 'en',
                    'sortBy': 'publishedAt',
                    'pageSize': min(max_articles, 100),
                    'apiKey': settings.NEWS_API_KEY,
                    'from': (datetime.utcnow() - timedelta(days=7)).isoformat()
                }
            },
            {
                'url': 'https://newsapi.org/v2/top-headlines',
                'params': {
                    'category': 'technology',
                    'language': 'en',
                    'pageSize': min(max_articles // 2, 50),
                    'apiKey': settings.NEWS_API_KEY
                }
            }
        ]
        
        for endpoint in endpoints:
            try:
                await asyncio.sleep(self.rate_limit_delay)
                async with self.session.get(endpoint['url'], params=endpoint['params']) as response:
                    if response.status == 200:
                        data = await response.json()
                        if data.get('status') == 'ok':
                            articles = await self._process_newsapi_articles(data.get('articles', []))
                            all_articles.extend(articles)
                            logger.info(f"Processed NewsAPI endpoint", 
                                       url=endpoint['url'], 
                                       articles=len(articles))
                    else:
                        logger.warning(f"NewsAPI request failed", 
                                     status=response.status, 
                                     url=endpoint['url'])
                        
            except Exception as e:
                logger.error(f"Error fetching from NewsAPI", 
                           error=str(e), 
                           url=endpoint['url'])
        
        return all_articles

    async def _process_newsapi_articles(self, articles: List[Dict]) -> List[BlogPostCreate]:
        """Process NewsAPI articles into BlogPostCreate objects"""
        processed = []
        
        for article in articles:
            try:
                title = article.get('title', '').strip()
                if not title or title == '[Removed]':
                    continue
                    
                description = article.get('description', '').strip()
                if description == '[Removed]':
                    description = ''
                    
                content = article.get('content', '').strip()
                if content == '[Removed]':
                    content = description
                    
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
                
                # Generate tags
                tags = self._extract_tags_from_content(title, description)
                
                # Determine if featured
                source_name = source.get('name', 'Unknown')
                is_featured = source_name in ['TechCrunch', 'The Verge', 'Wired', 'Ars Technica']
                
                post = BlogPostCreate(
                    title=title,
                    excerpt=description,
                    content_html=content,
                    cover_image_url=url_to_image,
                    source_name=source_name,
                    source_url=url,
                    author=author,
                    published_at=published_at,
                    tags=tags,
                    canonical_url=url,
                    og_title=title,
                    og_description=description,
                    og_image=url_to_image,
                    is_featured=is_featured
                )
                
                processed.append(post)
                
            except Exception as e:
                logger.warning(f"Error processing NewsAPI article", 
                             error=str(e), 
                             article=article.get('title', 'Unknown'))
                continue
        
        return processed

    async def _aggregate_devto(self, max_articles: int) -> List[BlogPostCreate]:
        """Aggregate from Dev.to API"""
        logger.info("Aggregating from Dev.to")
        
        try:
            url = 'https://dev.to/api/articles'
            params = {
                'tag': 'javascript,python,react,nodejs,webdev,programming,ai,machinelearning',
                'per_page': min(max_articles, 100),
                'top': 7  # Last 7 days
            }
            
            await asyncio.sleep(self.rate_limit_delay)
            async with self.session.get(url, params=params) as response:
                if response.status == 200:
                    articles = await response.json()
                    processed = await self._process_devto_articles(articles)
                    logger.info(f"Processed Dev.to articles", articles=len(processed))
                    return processed
                else:
                    logger.warning(f"Dev.to API request failed", status=response.status)
                    return []
                    
        except Exception as e:
            logger.error(f"Error fetching from Dev.to", error=str(e))
            return []

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
                    og_image=cover_image,
                    is_featured=False
                )
                
                processed.append(post)
                
            except Exception as e:
                logger.warning(f"Error processing Dev.to article", 
                             error=str(e), 
                             article=article.get('title', 'Unknown'))
                continue
        
        return processed

    async def _aggregate_hackernews(self, max_articles: int) -> List[BlogPostCreate]:
        """Aggregate from Hacker News API"""
        logger.info("Aggregating from Hacker News")
        
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
                    
                    processed = await self._process_hackernews_articles(stories)
                    logger.info(f"Processed Hacker News articles", articles=len(processed))
                    return processed
                else:
                    logger.warning(f"Hacker News API request failed", status=response.status)
                    return []
                    
        except Exception as e:
            logger.error(f"Error fetching from Hacker News", error=str(e))
            return []

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
                    og_image=None,
                    is_featured=score > 200
                )
                
                processed.append(post)
                
            except Exception as e:
                logger.warning(f"Error processing Hacker News article", 
                             error=str(e), 
                             article=article.get('title', 'Unknown'))
                continue
        
        return processed

    def _extract_tags_from_content(self, title: str, description: str) -> List[str]:
        """Extract relevant tags from title and description"""
        text = f"{title} {description}".lower()
        
        # Tech-related keywords
        tech_keywords = {
            'ai': ['ai', 'artificial intelligence', 'machine learning', 'ml', 'deep learning', 'neural network', 'chatgpt', 'openai'],
            'web': ['web development', 'frontend', 'backend', 'full stack', 'html', 'css', 'javascript', 'react', 'vue', 'angular'],
            'mobile': ['mobile', 'ios', 'android', 'react native', 'flutter', 'swift', 'kotlin'],
            'cloud': ['cloud', 'aws', 'azure', 'google cloud', 'docker', 'kubernetes', 'serverless'],
            'programming': ['programming', 'coding', 'software development', 'python', 'java', 'c++', 'golang'],
            'data': ['data science', 'big data', 'analytics', 'database', 'sql', 'mongodb', 'postgresql'],
            'security': ['security', 'cybersecurity', 'encryption', 'privacy', 'blockchain', 'cryptocurrency'],
            'startup': ['startup', 'entrepreneur', 'funding', 'venture capital', 'ipo', 'acquisition'],
            'devops': ['devops', 'ci/cd', 'automation', 'deployment', 'infrastructure', 'monitoring']
        }
        
        tags = []
        for tag, keywords in tech_keywords.items():
            if any(keyword in text for keyword in keywords):
                tags.append(tag)
        
        # Add some general tags
        if 'tutorial' in text or 'guide' in text or 'how to' in text:
            tags.append('tutorial')
        if 'news' in text or 'announcement' in text or 'releases' in text:
            tags.append('news')
        if 'review' in text or 'comparison' in text:
            tags.append('review')
            
        return list(set(tags))  # Remove duplicates

    async def _deduplicate_articles(self, articles: List[BlogPostCreate]) -> List[BlogPostCreate]:
        """Remove duplicate articles based on title similarity and URL"""
        seen_urls = set()
        seen_titles = set()
        unique_articles = []
        
        for article in articles:
            # Check URL duplicates
            if article.canonical_url and article.canonical_url in seen_urls:
                continue
            
            # Check title similarity (basic deduplication)
            title_hash = hashlib.md5(article.title.lower().strip().encode()).hexdigest()
            if title_hash in seen_titles:
                continue
            
            # Add to unique list
            unique_articles.append(article)
            if article.canonical_url:
                seen_urls.add(article.canonical_url)
            seen_titles.add(title_hash)
        
        return unique_articles

    async def _save_articles_to_db(self, db: AsyncSession, articles: List[BlogPostCreate]) -> Dict[str, Any]:
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
                logger.warning(f"Error saving article to database", 
                             error=str(e), 
                             title=article.title)
                skipped_count += 1
                continue
        
        try:
            await db.commit()
            logger.info(f"Successfully saved articles from all sources", 
                       created=created_count, 
                       updated=updated_count, 
                       skipped=skipped_count)
            
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
