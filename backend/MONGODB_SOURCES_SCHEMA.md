# MongoDB Trend Sources Schema

The backend loads RSS/trend sources from MongoDB. By default it uses the `sources` collection. You can override this with the `TREND_SOURCES_COLLECTION` environment variable.

## Expected document fields

Each document should have at least:

| Field | Aliases | Required | Description |
|-------|---------|----------|-------------|
| `name` | `title` | Yes | Display name of the source |
| `url` | `link` | Yes | Base URL of the source |
| `rss_feed` | `feed_url`, `rss_feed_url`, `rss_url`, `rss` | Yes | RSS/Atom feed URL (required for scraping) |
| `scrape_enabled` | `enabled`, `active` | No | Whether to scrape (default: true) |
| `category` | — | No | Category for grouping (default: "Uncategorized") |
| `priority` | — | No | `high`, `medium`, or `low` (default: "medium") |

## Example document

```json
{
  "name": "OpenAI Blog",
  "url": "https://openai.com/blog",
  "rss_feed": "https://openai.com/blog/rss.xml",
  "scrape_enabled": true,
  "category": "Frontier AI",
  "priority": "high"
}
```

## Notes

- Documents without `rss_feed` (or alias) are skipped—RSS is required.
- If MongoDB has no valid sources, the backend falls back to `data/trend_sources.json`.
- Set `TREND_SOURCES_COLLECTION` in `.env` if your collection has a different name.
