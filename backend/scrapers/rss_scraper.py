"""
RSS feed scraper for blog posts and news articles.
"""
import logging
from typing import List, Optional
import feedparser
from datetime import datetime

from .base_scraper import BaseScraper, Article

logger = logging.getLogger(__name__)


class RSSFeedScraper(BaseScraper):
    """Scraper for RSS/Atom feeds."""
    
    def __init__(self, source_name: str, source_url: str, rss_feed_url: str, user_agent: str):
        super().__init__(source_name, source_url, user_agent)
        self.rss_feed_url = rss_feed_url
    
    async def scrape_articles(self, max_articles: int = 10) -> List[Article]:
        """
        Scrape articles from RSS feed.
        
        Args:
            max_articles: Maximum number of articles to scrape
            
        Returns:
            List of Article objects
        """
        articles = []
        
        try:
            # Fetch RSS feed
            feed = feedparser.parse(self.rss_feed_url)
            
            if feed.bozo:
                logger.warning(f"RSS feed parsing error for {self.source_name}: {feed.bozo_exception}")
            
            # Process entries
            for entry in feed.entries[:max_articles]:
                try:
                    article = self._parse_entry(entry)
                    if article:
                        articles.append(article)
                except Exception as e:
                    logger.error(f"Error parsing RSS entry from {self.source_name}: {str(e)}")
                    continue
            
            logger.info(f"Scraped {len(articles)} articles from {self.source_name} RSS feed")
            
        except Exception as e:
            logger.error(f"Error scraping RSS feed {self.rss_feed_url}: {str(e)}")
        
        return articles
    
    def _parse_entry(self, entry) -> Optional[Article]:
        """Parse a single RSS entry into an Article."""
        # Extract title
        title = self.clean_text(entry.get('title', ''))
        if not title:
            return None
        
        # Extract URL
        url = entry.get('link', '')
        if not url:
            return None
        
        # Extract published date
        published_date = None
        if hasattr(entry, 'published_parsed') and entry.published_parsed:
            try:
                published_date = datetime(*entry.published_parsed[:6])
            except Exception:
                pass
        
        if not published_date and hasattr(entry, 'updated_parsed') and entry.updated_parsed:
            try:
                published_date = datetime(*entry.updated_parsed[:6])
            except Exception:
                pass
        
        # Extract content/summary
        content = None
        summary = None
        
        if hasattr(entry, 'content') and entry.content:
            content = self.clean_text(entry.content[0].get('value', ''))
        elif hasattr(entry, 'description'):
            content = self.clean_text(entry.description)
        
        if hasattr(entry, 'summary'):
            summary = self.clean_text(entry.summary)
        
        # Extract tags
        tags = []
        if hasattr(entry, 'tags'):
            tags = [tag.get('term', '') for tag in entry.tags if tag.get('term')]
        
        # Extract category
        category = None
        if hasattr(entry, 'category'):
            category = entry.category
        elif tags:
            category = tags[0]
        
        return Article(
            title=title,
            url=url,
            source=self.source_name,
            published_date=published_date,
            content=content,
            summary=summary,
            category=category,
            tags=tags
        )
