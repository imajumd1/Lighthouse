"""
AI-powered trend analysis service using OpenAI.
"""
import json
import logging
from typing import List, Dict, Optional
from datetime import datetime
from openai import OpenAI

from config import settings

logger = logging.getLogger(__name__)


class TrendAnalyzer:
    """Analyzes articles and identifies AI trends using OpenAI."""
    
    def __init__(self):
        self.client = OpenAI(api_key=settings.openai_api_key)
    
    async def analyze_articles_for_trends(
        self,
        articles: List[Dict],
        top_n: int = 10
    ) -> List[Dict]:
        """
        Analyze a batch of articles and identify top AI trends.
        
        Args:
            articles: List of article dictionaries
            top_n: Number of top trends to return
            
        Returns:
            List of trend dictionaries
        """
        if not articles:
            logger.warning("No articles provided for trend analysis")
            return []
        
        try:
            # Prepare article summaries for analysis
            article_summaries = self._prepare_article_summaries(articles)
            
            # Call OpenAI to analyze trends
            trends = await self._call_openai_for_trends(article_summaries, top_n)
            
            logger.info(f"Identified {len(trends)} trends from {len(articles)} articles")
            return trends
            
        except Exception as e:
            logger.error(f"Error analyzing trends: {str(e)}")
            return []
    
    def _prepare_article_summaries(self, articles: List[Dict]) -> str:
        """Prepare article summaries for OpenAI analysis."""
        summaries = []
        
        for i, article in enumerate(articles[:50], 1):  # Limit to 50 articles to avoid token limits
            title = article.get('title', 'Untitled')
            source = article.get('source', 'Unknown')
            summary = article.get('summary', article.get('content', ''))[:500]  # Limit length
            
            summaries.append(f"{i}. [{source}] {title}\n   {summary}\n")
        
        return "\n".join(summaries)
    
    async def _call_openai_for_trends(
        self,
        article_summaries: str,
        top_n: int
    ) -> List[Dict]:
        """Call OpenAI API to identify trends from articles."""
        
        system_prompt = """You are an expert AI trend analyst for Lighthouse, a strategic intelligence platform. 
Your role is to analyze recent articles and identify the most significant AI trends that executives and decision-makers need to know about.

For each trend you identify, provide:
1. A clear, compelling headline (10-15 words)
2. A one-sentence summary of why this trend matters
3. The trend category (e.g., "Model Development", "Enterprise Adoption", "Regulation", "Infrastructure", "Market Dynamics")
4. Time horizon (Immediate: 0-6 months, Near-term: 6-18 months, Long-term: 18+ months)
5. Confidence score (1-10) based on signal strength
6. Strategic impact (brief explanation of business implications)
7. Key risk factors

Focus on trends that are:
- Actionable for business leaders
- Backed by multiple signals/sources
- Represent meaningful shifts (not just incremental updates)
- Have clear strategic or financial implications"""

        user_prompt = f"""Analyze these recent articles and identify the top {top_n} AI trends:

{article_summaries}

Return ONLY a valid JSON array of trend objects with this exact structure:
[
  {{
    "headline": "Clear, compelling headline",
    "title": "Formal trend title",
    "trendCategory": "Category name",
    "whyTrend": "One sentence on why this matters",
    "timeHorizon": "Immediate|Near-term|Long-term",
    "confidenceScore": 8,
    "strategicImpact": "Business implications",
    "riskGovernance": "Key risk factors",
    "affectedVerticals": ["Healthcare", "Finance", "etc"]
  }}
]

Return ONLY the JSON array, no other text."""

        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            # Parse response
            content = response.choices[0].message.content.strip()
            
            # Remove markdown code blocks if present
            if content.startswith("```"):
                content = content.split("```")[1]
                if content.startswith("json"):
                    content = content[4:]
                content = content.strip()
            
            trends = json.loads(content)
            
            # Enrich trends with metadata
            for trend in trends:
                trend['dateAdded'] = datetime.utcnow().isoformat()
                trend['status'] = 'current'
                trend['author'] = 'Lighthouse AI Analyzer'
                trend['sourceUrl'] = 'https://lighthouse.ai/trends'
                
                # Set default values for missing fields
                trend.setdefault('justificationSummary', trend.get('whyTrend', ''))
                trend.setdefault('howConsultanciesLeverage', 'Strategic advisory and implementation services')
                trend.setdefault('analysisDetail', trend.get('strategicImpact', ''))
                newline_char = '\n'
                article_count = len(article_summaries.split(newline_char))
                trend.setdefault('confidenceReasoning', f"Based on analysis of {article_count} recent articles")
                trend.setdefault('marketValidation', 'Multiple sources confirm this trend')
                trend.setdefault('financialSignal', 'Significant market activity observed')
                trend.setdefault('competitiveIntelligence', 'Multiple players active in this space')
                trend.setdefault('trendMomentum', 'Accelerating')
                trend.setdefault('actionGuidance', 'Monitor closely and assess strategic implications')
                
                # Set heatmap scores
                trend.setdefault('heatMapScores', {
                    'capabilityMaturity': 7,
                    'capitalBacking': 7,
                    'enterpriseAdoption': 6,
                    'regulatoryFriction': 5,
                    'competitiveIntensity': 8
                })
            
            return trends
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse OpenAI response as JSON: {str(e)}")
            logger.error(f"Response content: {content}")
            return []
        except Exception as e:
            logger.error(f"Error calling OpenAI for trend analysis: {str(e)}")
            return []
    
    async def enrich_trend_with_ai(self, trend: Dict) -> Dict:
        """
        Enrich a single trend with additional AI-generated insights.
        
        Args:
            trend: Trend dictionary
            
        Returns:
            Enriched trend dictionary
        """
        try:
            prompt = f"""Analyze this AI trend and provide strategic insights:

Trend: {trend.get('title', '')}
Summary: {trend.get('whyTrend', '')}

Provide:
1. How consultancies can leverage this (2-3 sentences)
2. Detailed analysis (3-4 sentences)
3. Market validation signals (2-3 sentences)
4. Financial implications (2-3 sentences)
5. Competitive intelligence (2-3 sentences)
6. Actionable guidance for executives (2-3 sentences)

Format as JSON with keys: howConsultanciesLeverage, analysisDetail, marketValidation, financialSignal, competitiveIntelligence, actionGuidance"""

            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a strategic AI analyst providing executive-level insights."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=800
            )
            
            content = response.choices[0].message.content.strip()
            
            # Parse JSON response
            if content.startswith("```"):
                content = content.split("```")[1]
                if content.startswith("json"):
                    content = content[4:]
                content = content.strip()
            
            enrichment = json.loads(content)
            trend.update(enrichment)
            
            return trend
            
        except Exception as e:
            logger.error(f"Error enriching trend with AI: {str(e)}")
            return trend
