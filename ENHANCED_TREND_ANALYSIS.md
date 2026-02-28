# Enhanced Trend Analysis System

## Overview

The Lighthouse trend analysis system has been enhanced to provide comprehensive, keyword-rich trend analysis with full source attribution. The system now scrapes from 60+ curated AI sources and uses OpenAI to generate detailed strategic insights.

## New Features

### 1. **Keywords Extraction**
Each trend now includes 5-8 key terms that define the trend:
- Displayed as blue badges on trend cards
- Helps users quickly understand the core concepts
- Extracted automatically by OpenAI from article content

### 2. **Comprehensive Analysis**
Enhanced OpenAI prompts now generate:
- **Executive Summary**: 3-4 bullet points explaining why the trend matters
- **Detailed Analysis**: 3-4 paragraphs with strategic insights and market context
- **Strategic Impact**: Business implications for decision-makers
- **Risk Factors**: Key governance and risk considerations

### 3. **Source Attribution**
Full transparency on trend sources:
- Each trend references specific article numbers from the scraped content
- `additionalSources` field contains all source URLs with metadata
- Primary source URL set from the first referenced article
- Confidence reasoning includes source count

## Curated Source List

The system scrapes from 60+ high-quality sources across 8 categories:

### 1. Frontier AI Labs & Model Developers (8 sources)
- OpenAI Blog, Anthropic Blog, Google DeepMind Blog
- Meta AI Blog, Mistral AI Blog, Cohere Blog
- xAI Blog, Stability AI Blog

### 2. Enterprise AI & Strategy Publications (8 sources)
- McKinsey Insights, BCG Insights, Bain & Company Insights
- Harvard Business Review, Gartner Research, Forrester Research
- Deloitte Insights, PwC AI Publications

### 3. Data, Infrastructure & AI Engineering Blogs (11 sources)
- Databricks, Snowflake, dbt Labs, NVIDIA AI
- Hugging Face, Netflix Tech, Uber Engineering
- Airbnb Engineering, Microsoft Engineering
- AWS Machine Learning, Google Cloud AI

### 4. Academic & Research Sources (6 sources)
- arXiv (cs.AI, cs.LG), Stanford HAI
- MIT CSAIL, Berkeley AI Research (BAIR)
- Carnegie Mellon AI, Allen Institute for AI (AI2)

### 5. Venture Capital & Investment Trends (6 sources)
- a16z AI Blog, Sequoia Capital AI
- Greylock Partners, Insight Partners
- Lightspeed Venture, Accel AI Market Insights

### 6. AI News & Market Intelligence (7 sources)
- MIT Technology Review, The Information
- Financial Times, Bloomberg Technology
- Wall Street Journal, TechCrunch AI, VentureBeat AI

### 7. Policy, Governance & Regulation (6 sources)
- European Commission AI Act, White House AI Policy
- OECD AI Policy Observatory, World Economic Forum
- Brookings Institution, CSET Georgetown

### 8. High-Signal Substacks & Independent Analysts (10 sources)
- Stratechery, The Pragmatic Engineer, Not Boring
- AI Snake Oil, Import AI, The Sequence
- Latent Space, Ben's Bites
- Nathan Lambert's Interconnects, Ethan Mollick's One Useful Thing

## Technical Implementation

### Backend Changes

**File: `backend/services/trend_analyzer.py`**

1. **Enhanced Article Preparation**
   ```python
   def _prepare_article_summaries(self, articles: List[Dict]) -> tuple[str, List[Dict]]:
       # Now returns both summaries and source references
       # Includes URL and metadata for each article
   ```

2. **Improved OpenAI Prompts**
   - Added keywords extraction (5-8 terms per trend)
   - Request comprehensive 3-4 paragraph analysis
   - Require source article number citations
   - Generate detailed justification summaries

3. **Source Reference Mapping**
   ```python
   # Maps article numbers to actual source URLs
   source_article_numbers = trend.get('sourceArticleNumbers', [])
   for article_num in source_article_numbers:
       source_ref = source_references[article_num - 1]
       additional_sources.append(source_ref)
   ```

### Frontend Changes

**File: `frontend/lib/types.ts`**
```typescript
export interface Trend {
  // ... existing fields
  keywords?: string[]; // New field for key terms
}
```

**File: `frontend/components/TrendCard.tsx`**
- Added keywords display section
- Shows up to 6 keywords as blue badges
- Displays "+N more" for additional keywords

## How It Works

### 1. Article Scraping
```
RSS Scraper → Fetches articles from 60+ sources
             → Filters by date (last 7 days)
             → Extracts title, summary, URL, publisher
```

### 2. Trend Analysis
```
OpenAI GPT-4 → Analyzes article batch
             → Identifies top N trends
             → Extracts keywords for each trend
             → Generates comprehensive analysis
             → Cites source article numbers
```

### 3. Source Attribution
```
Source Mapper → Maps article numbers to URLs
              → Creates additionalSources array
              → Sets primary sourceUrl
              → Includes publisher and date metadata
```

### 4. Frontend Display
```
TrendCard → Displays keywords as badges
          → Shows comprehensive analysis
          → Links to all source articles
```

## API Usage

### Discover Trends Endpoint
```bash
POST /api/trends/discover?top_n=10&lookback_days=7
```

**Response includes:**
```json
{
  "trends": [
    {
      "title": "Trend Title",
      "keywords": ["LLM", "fine-tuning", "enterprise"],
      "justificationSummary": "• Bullet 1\n• Bullet 2\n• Bullet 3",
      "analysisDetail": "Comprehensive 3-4 paragraph analysis...",
      "sourceUrl": "https://primary-source.com/article",
      "additionalSources": [
        {
          "id": "source-1",
          "title": "Article Title",
          "url": "https://source.com/article",
          "publisher": "Publisher Name",
          "date": "2024-01-15"
        }
      ],
      "confidenceReasoning": "Based on analysis of 50 articles from 5 sources"
    }
  ]
}
```

## Configuration

### Scraping Settings
**File: `backend/data/trend_sources.json`**
```json
{
  "scraping_config": {
    "frequency": "daily",
    "max_articles_per_source": 10,
    "lookback_days": 7,
    "min_article_length": 500,
    "exclude_keywords": ["sponsored", "advertisement", "press release"]
  }
}
```

### OpenAI Settings
- **Model**: `gpt-4o-mini` (cost-effective, high quality)
- **Temperature**: 0.7 (balanced creativity)
- **Max Tokens**: 2000 (comprehensive responses)

## Testing

### Local Testing
```bash
# Start backend
cd backend
python main.py

# Test trend discovery
curl -X POST "http://localhost:8000/api/trends/discover?top_n=5&lookback_days=7"
```

### Frontend Testing
```bash
# Start frontend
cd frontend
npm run dev

# Visit http://localhost:3000
# Keywords should appear as blue badges below each trend
```

## Deployment

### Environment Variables Required
```bash
# Backend (Render)
OPENAI_API_KEY=sk-...
MONGODB_URI=mongodb+srv://...
CORS_ORIGINS=https://lighthouse-kl7m.onrender.com

# Frontend (Render)
NEXT_PUBLIC_API_URL=https://lighthouse-backend-fc77.onrender.com
```

### Redeploy Steps
1. **Backend**: Already deployed, no changes needed
2. **Frontend**: Redeploy to pull latest code with keywords display

## Benefits

### For Users
✅ **Quick Understanding**: Keywords provide instant context
✅ **Comprehensive Insights**: Detailed analysis beyond headlines
✅ **Source Transparency**: Full attribution to original articles
✅ **Trust & Credibility**: See exactly where insights come from

### For the Platform
✅ **Quality Content**: AI-generated analysis from 60+ premium sources
✅ **Automated Updates**: Daily scraping keeps content fresh
✅ **Scalable**: Can easily add more sources
✅ **Cost-Effective**: Uses GPT-4o-mini for optimal cost/quality

## Future Enhancements

### Potential Improvements
1. **Sentiment Analysis**: Add positive/negative/neutral indicators
2. **Trend Clustering**: Group related trends together
3. **Historical Tracking**: Show how trends evolve over time
4. **Custom Alerts**: Notify users about trends in their verticals
5. **Export Functionality**: Download trends as PDF reports

## Troubleshooting

### No Trends Generated
- Check OpenAI API key is configured
- Verify RSS feeds are accessible
- Check logs for scraping errors

### Missing Keywords
- Ensure OpenAI response includes keywords field
- Check that default empty array is set

### Source URLs Not Showing
- Verify article URLs are being scraped
- Check sourceArticleNumbers mapping logic

## Summary

The enhanced trend analysis system now provides:
- **Keywords** for quick understanding
- **Comprehensive analysis** for deep insights
- **Full source attribution** for transparency
- **60+ curated sources** for quality content

All changes have been pushed to GitHub and are ready for deployment.
