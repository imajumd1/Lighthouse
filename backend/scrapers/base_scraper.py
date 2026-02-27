"""
Base scraper class for web scraping functionality.
"""
import asyncio
import logging
from abc import ABC, abstractmethod
from datetime import datetime
from typing import List, Dict, Optional
import aiohttp
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)


class Article:
    """Represents a scraped article."""
    
    def __init__(
        self,
        title: str,
        url: str,
        source: str,
        published_date: Optional[datetime] = None,
        content: Optional[str] = None,
        summary: Optional[str] = None,
        category: Optional[str] = None,
        tags: Optional[List[str]] = None
    ):
        self.title = title
        self.url = url
        self.source = source
        self.published_date = published_date or datetime.utcnow()
        self.content = content
        self.summary = summary
        self.category = category
        self.tags = tags or []
        self.scraped_at = datetime.utcnow()
    
    def to_dict(self) -> Dict:
        """Convert article to dictionary."""
        return {
            "title": self.title,
            "url": self.url,
            "source": self.source,
            "published_date": self.published_date.isoformat() if self.published_date else None,
            "content": self.content,
            "summary": self.summary,
            "category": self.category,
            "tags": self.tags,
            "scraped_at": self.scraped_at.isoformat()
        }


class BaseScraper(ABC):
    """Base class for all web scrapers."""
    
    def __init__(self, source_name: str, source_url: str, user_agent: str):
        self.source_name = source_name
        self.source_url = source_url
        self.user_agent = user_agent
        self.session: Optional[aiohttp.ClientSession] = None
    
    async def __aenter__(self):
        """Async context manager entry."""
        self.session = aiohttp.ClientSession(
            headers={"User-Agent": self.user_agent}
        )
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        if self.session:
            await self.session.close()
    
    async def fetch_page(self, url: str, timeout: int = 30) -> Optional[str]:
        """
        Fetch a web page.
        
        Args:
            url: URL to fetch
            timeout: Request timeout in seconds
            
        Returns:
            HTML content or None if failed
        """
        try:
            async with self.session.get(url, timeout=timeout) as response:
                if response.status == 200:
                    return await response.text()
                else:
                    logger.warning(f"Failed to fetch {url}: HTTP {response.status}")
                    return None
        except asyncio.TimeoutError:
            logger.error(f"Timeout fetching {url}")
            return None
        except Exception as e:
            logger.error(f"Error fetching {url}: {str(e)}")
            return None
    
    def parse_html(self, html: str) -> BeautifulSoup:
        """Parse HTML content."""
        return BeautifulSoup(html, 'html.parser')
    
    @abstractmethod
    async def scrape_articles(self, max_articles: int = 10) -> List[Article]:
        """
        Scrape articles from the source.
        
        Args:
            max_articles: Maximum number of articles to scrape
            
        Returns:
            List of Article objects
        """
        pass
    
    def clean_text(self, text: str) -> str:
        """Clean and normalize text."""
        if not text:
            return ""
        # Remove extra whitespace
        text = " ".join(text.split())
        return text.strip()
    
    def extract_date(self, date_str: str) -> Optional[datetime]:
        """
        Extract datetime from various date string formats.
        
        Args:
            date_str: Date string to parse
            
        Returns:
            datetime object or None
        """
        from dateutil import parser
        try:
            return parser.parse(date_str)
        except Exception as e:
            logger.warning(f"Failed to parse date '{date_str}': {str(e)}")
            return None
