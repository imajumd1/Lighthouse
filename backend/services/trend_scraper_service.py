"""
Main trend scraping orchestration service.
"""
import json
import logging
import asyncio
from pathlib import Path
from typing import List, Dict
from datetime import datetime, timedelta

from scrapers.rss_scraper import RSSFeedScraper
from services.trend_analyzer import TrendAnalyzer

logger = logging.getLogger(__name__)


class TrendScraperService:
    """Orchestrates web scraping and trend analysis."""
    
    def __init__(self, sources_file: str = "data/trend_sources.json"):
        self.sources_file = Path(__file__).parent.parent / sources_file
        self.sources_config = self._load_sources()
        self.trend_analyzer = TrendAnalyzer()
    
    def _load_sources(self) -> Dict:
        """Load sources configuration from JSON file."""
        try:
            with open(self.sources_file, 'r') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading sources config: {str(e)}")
            return {"sources": [], "scraping_config": {}}
    
    async def scrape_all_sources(self, max_articles_per_source: int = 10) -> List[Dict]:
        """
        Scrape articles from all enabled sources.
        
        Args:
            max_articles_per_source: Maximum articles to scrape per source
            
        Returns:
            List of article dictionaries
        """
        all_articles = []
        scraping_config = self.sources_config.get('scraping_config', {})
        user_agent = scraping_config.get('user_agent', 'LighthouseAI-TrendBot/1.0')
        
        # Collect all sources with RSS feeds
        rss_sources = []
        for category_data in self.sources_config.get('sources', []):
            for source in category_data.get('sources', []):
                if source.get('scrape_enabled') and source.get('rss_feed'):
                    rss_sources.append({
                        'name': source['name'],
                        'url': source['url'],
                        'rss_feed': source['rss_feed'],
                        'priority': source.get('priority', 'medium')
                    })
        
        logger.info(f"Scraping {len(rss_sources)} RSS sources...")
        
        # Scrape sources concurrently
        tasks = []
        for source in rss_sources:
            task = self._scrape_rss_source(
                source['name'],
                source['url'],
                source['rss_feed'],
                user_agent,
                max_articles_per_source
            )
            tasks.append(task)
        
        # Wait for all scraping tasks
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Collect articles
        for result in results:
            if isinstance(result, list):
                all_articles.extend(result)
            elif isinstance(result, Exception):
                logger.error(f"Scraping task failed: {str(result)}")
        
        logger.info(f"Total articles scraped: {len(all_articles)}")
        return all_articles
    
    async def _scrape_rss_source(
        self,
        name: str,
        url: str,
        rss_feed: str,
        user_agent: str,
        max_articles: int
    ) -> List[Dict]:
        """Scrape a single RSS source."""
        try:
            async with RSSFeedScraper(name, url, rss_feed, user_agent) as scraper:
                articles = await scraper.scrape_articles(max_articles)
                return [article.to_dict() for article in articles]
        except Exception as e:
            logger.error(f"Error scraping {name}: {str(e)}")
            return []
    
    async def discover_and_analyze_trends(
        self,
        top_n: int = 10,
        lookback_days: int = 7
    ) -> List[Dict]:
        """
        Discover and analyze top AI trends from scraped articles.
        
        Args:
            top_n: Number of top trends to return
            lookback_days: Number of days to look back for articles
            
        Returns:
            List of trend dictionaries
        """
        logger.info(f"Starting trend discovery (top {top_n}, lookback {lookback_days} days)...")
        
        # Scrape articles from all sources
        articles = await self.scrape_all_sources()
        
        if not articles:
            logger.warning("No articles scraped, cannot analyze trends")
            return []
        
        # Filter articles by date
        cutoff_date = datetime.utcnow() - timedelta(days=lookback_days)
        recent_articles = [
            article for article in articles
            if article.get('published_date') and 
            datetime.fromisoformat(article['published_date'].replace('Z', '+00:00')) > cutoff_date
        ]
        
        if not recent_articles:
            logger.warning(f"No articles found within {lookback_days} days")
            recent_articles = articles[:50]  # Use most recent 50 if date filtering fails
        
        logger.info(f"Analyzing {len(recent_articles)} recent articles...")
        
        # Analyze articles for trends using AI
        trends = await self.trend_analyzer.analyze_articles_for_trends(
            recent_articles,
            top_n=top_n
        )
        
        logger.info(f"Discovered {len(trends)} trends")
        return trends
    
    def get_sources_summary(self) -> Dict:
        """Get summary of configured sources."""
        total_sources = 0
        enabled_sources = 0
        sources_by_category = {}
        
        for category_data in self.sources_config.get('sources', []):
            category = category_data['category']
            sources = category_data['sources']
            total_sources += len(sources)
            enabled = sum(1 for s in sources if s.get('scrape_enabled'))
            enabled_sources += enabled
            
            sources_by_category[category] = {
                'total': len(sources),
                'enabled': enabled,
                'sources': [
                    {
                        'name': s['name'],
                        'url': s['url'],
                        'enabled': s.get('scrape_enabled', False),
                        'priority': s.get('priority', 'medium')
                    }
                    for s in sources
                ]
            }
        
        return {
            'total_sources': total_sources,
            'enabled_sources': enabled_sources,
            'categories': sources_by_category,
            'scraping_config': self.sources_config.get('scraping_config', {})
        }
