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
            # Prepare article summaries for analysis and get source references
            article_summaries, source_references = self._prepare_article_summaries(articles)
            
            # Call OpenAI to analyze trends
            trends = await self._call_openai_for_trends(article_summaries, top_n, source_references)
            
            logger.info(f"Identified {len(trends)} trends from {len(articles)} articles")
            return trends
            
        except Exception as e:
            logger.error(f"Error analyzing trends: {str(e)}")
            return []
    
    def _prepare_article_summaries(self, articles: List[Dict]) -> tuple[str, List[Dict]]:
        """Prepare article summaries for OpenAI analysis and return source references."""
        summaries = []
        source_references = []
        
        for i, article in enumerate(articles[:50], 1):  # Limit to 50 articles to avoid token limits
            title = article.get('title', 'Untitled')
            source = article.get('source', 'Unknown')
            url = article.get('url', article.get('link', ''))
            published = article.get('published', article.get('pubDate', ''))
            summary = article.get('summary', article.get('content', ''))[:500]  # Limit length
            
            summaries.append(f"{i}. [{source}] {title}\n   URL: {url}\n   {summary}\n")
            
            # Store source reference
            source_references.append({
                'id': f'source-{i}',
                'title': title,
                'url': url,
                'publisher': source,
                'date': published
            })
        
        return "\n".join(summaries), source_references
    
    async def _call_openai_for_trends(
        self,
        article_summaries: str,
        top_n: int,
        source_references: List[Dict]
    ) -> List[Dict]:
        """Call OpenAI API to identify trends from articles."""
        
        system_prompt = """You are an expert AI trend analyst for Lighthouse, a strategic intelligence platform.
Your role is to analyze recent articles and identify the most significant AI trends that executives and decision-makers need to know about.

For each trend you identify, provide:
1. A clear, compelling headline (10-15 words)
2. Keywords: 5-8 key terms that define this trend (e.g., "LLM", "fine-tuning", "enterprise adoption")
3. Executive Summary: 3-4 bullet points explaining why this trend matters
4. Comprehensive Analysis: 3-4 paragraphs providing deep strategic insights
5. The trend category (e.g., "Model Development", "Enterprise Adoption", "Regulation", "Infrastructure", "Market Dynamics")
6. Time horizon (Immediate: 0-6 months, Near-term: 6-18 months, Long-term: 18+ months)
7. Confidence score (1-10) based on signal strength
8. Strategic impact (business implications)
9. Key risk factors
10. Source article numbers that support this trend (reference the article numbers from the input)

Focus on trends that are:
- Actionable for business leaders
- Backed by multiple signals/sources
- Represent meaningful shifts (not just incremental updates)
- Have clear strategic or financial implications"""

        user_prompt = f"""Analyze these recent articles and identify the top {top_n} AI trends:

{article_summaries}

For each trend, cite the specific article numbers (e.g., [1], [3], [5]) that support your analysis.

Return ONLY a valid JSON array of trend objects with this exact structure:
[
  {{
    "headline": "Clear, compelling headline",
    "title": "Formal trend title",
    "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
    "trendCategory": "Category name",
    "justificationSummary": "• Bullet point 1\\n• Bullet point 2\\n• Bullet point 3",
    "whyTrend": "One sentence on why this matters",
    "analysisDetail": "Comprehensive 3-4 paragraph analysis with strategic insights and market context",
    "timeHorizon": "Immediate|Near-term|Long-term",
    "confidenceScore": 8,
    "strategicImpact": "Business implications",
    "riskGovernance": "Key risk factors",
    "affectedVerticals": ["Healthcare", "Finance", "etc"],
    "sourceArticleNumbers": [1, 3, 5]
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
            
            # Enrich trends with metadata and source references
            for trend in trends:
                trend['dateAdded'] = datetime.utcnow().isoformat()
                trend['status'] = 'current'
                trend['author'] = 'Lighthouse AI Analyzer'
                
                # Map source article numbers to actual source references
                source_article_numbers = trend.get('sourceArticleNumbers', [])
                additional_sources = []
                primary_source_url = 'https://lighthouse.ai/trends'
                
                for article_num in source_article_numbers:
                    if 0 < article_num <= len(source_references):
                        source_ref = source_references[article_num - 1]
                        additional_sources.append(source_ref)
                        # Use first source as primary
                        if not primary_source_url or primary_source_url == 'https://lighthouse.ai/trends':
                            primary_source_url = source_ref.get('url', 'https://lighthouse.ai/trends')
                
                trend['sourceUrl'] = primary_source_url
                trend['additionalSources'] = additional_sources
                
                # Set default values for missing fields
                trend.setdefault('keywords', [])
                trend.setdefault('justificationSummary', trend.get('whyTrend', ''))
                trend.setdefault('howConsultanciesLeverage', 'Strategic advisory and implementation services')
                trend.setdefault('analysisDetail', trend.get('strategicImpact', ''))
                newline_char = '\n'
                article_count = len(article_summaries.split(newline_char))
                trend.setdefault('confidenceReasoning', f"Based on analysis of {article_count} recent articles from {len(additional_sources)} sources")
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
                
                # Remove temporary field
                trend.pop('sourceArticleNumbers', None)
            
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
