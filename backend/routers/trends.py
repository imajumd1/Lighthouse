"""
Trends API router with scraping and analysis endpoints.
"""
from fastapi import APIRouter, HTTPException, BackgroundTasks, status
from typing import Optional
import logging

from services.trend_scraper_service import TrendScraperService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/trends", tags=["trends"])

# Initialize scraper service
scraper_service = TrendScraperService()


@router.get("/sources")
async def get_sources():
    """
    Get summary of configured trend sources.
    
    Returns information about all configured sources including:
    - Total and enabled sources
    - Sources by category
    - Scraping configuration
    """
    try:
        summary = scraper_service.get_sources_summary()
        return summary
    except Exception as e:
        logger.error(f"Error getting sources summary: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get sources: {str(e)}"
        )


@router.post("/discover")
async def discover_trends(
    top_n: Optional[int] = 10,
    lookback_days: Optional[int] = 7,
    background_tasks: BackgroundTasks = None
):
    """
    Discover and analyze top AI trends from configured sources.
    
    This endpoint:
    1. Scrapes articles from all enabled RSS sources
    2. Filters articles by date (lookback_days)
    3. Uses OpenAI to analyze articles and identify top trends
    4. Returns structured trend data
    
    Args:
        top_n: Number of top trends to return (default: 10)
        lookback_days: Number of days to look back for articles (default: 7)
    
    Returns:
        List of discovered trends with full analysis
    """
    try:
        logger.info(f"Starting trend discovery: top_n={top_n}, lookback_days={lookback_days}")
        
        # Run trend discovery
        trends = await scraper_service.discover_and_analyze_trends(
            top_n=top_n,
            lookback_days=lookback_days
        )
        
        return {
            "trends": trends,
            "count": len(trends),
            "parameters": {
                "top_n": top_n,
                "lookback_days": lookback_days
            }
        }
        
    except Exception as e:
        logger.error(f"Error discovering trends: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to discover trends: {str(e)}"
        )


@router.post("/scrape")
async def scrape_articles(max_articles_per_source: Optional[int] = 10):
    """
    Scrape articles from all enabled sources without analysis.
    
    Useful for testing scraping functionality or collecting raw data.
    
    Args:
        max_articles_per_source: Maximum articles to scrape per source (default: 10)
    
    Returns:
        List of scraped articles
    """
    try:
        logger.info(f"Starting article scraping: max_articles_per_source={max_articles_per_source}")
        
        articles = await scraper_service.scrape_all_sources(
            max_articles_per_source=max_articles_per_source
        )
        
        return {
            "articles": articles,
            "count": len(articles),
            "sources_scraped": len(set(a.get('source') for a in articles))
        }
        
    except Exception as e:
        logger.error(f"Error scraping articles: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to scrape articles: {str(e)}"
        )


@router.get("/health")
async def trends_health():
    """Health check for trends scraping service."""
    try:
        summary = scraper_service.get_sources_summary()
        return {
            "status": "ok",
            "service": "trends_scraper",
            "total_sources": summary['total_sources'],
            "enabled_sources": summary['enabled_sources']
        }
    except Exception as e:
        return {
            "status": "error",
            "service": "trends_scraper",
            "error": str(e)
        }
