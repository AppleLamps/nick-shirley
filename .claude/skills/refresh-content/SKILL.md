---
name: refresh-content
description: Guide content sync operations for X posts and YouTube videos. Use when user mentions "refresh feed", "sync posts", "update videos", "fetch latest", or asks about content pipeline.
allowed-tools: Read, Glob, Grep, Bash
---

# Refresh Content

Guide for refreshing X (Twitter) and YouTube content via admin endpoints.

## Instructions

1. Check current cache status:
   - Read `src/lib/db.ts` for `getLastFetchedAt*` functions
   - Query database for last fetch timestamps

2. Available refresh endpoints (POST requests):

   **X Posts:**

   ```bash
   curl -X POST http://localhost:3000/api/admin/refresh/x-posts
   ```

   **X Mentions:**

   ```bash
   curl -X POST http://localhost:3000/api/admin/refresh/x-mentions
   ```

   **YouTube Videos:**

   ```bash
   curl -X POST http://localhost:3000/api/admin/refresh/youtube-videos
   ```

   **Video Summaries (requires OpenAI):**

   ```bash
   curl -X POST http://localhost:3000/api/admin/refresh/video-summaries
   ```

3. For production, use the deployed URL instead of localhost

4. Check responses for success/count:

   ```json
   { "success": true, "message": "Refreshed 15 posts", "count": 15 }
   ```

## Data Flow

1. Admin triggers POST to refresh endpoint
2. API calls external source (XAI for X, YouTube API)
3. Data parsed and validated
4. Upserted to database with `fetched_at` timestamp
5. Frontend fetches from `/api/x/posts` or `/api/youtube/videos`

## Troubleshooting

**No data returned:**

- Check API keys in `.env.local`: `XAI_API_KEY`, `YOUTUBE_API_KEY`
- Verify rate limits not exceeded

**JSON parse errors (X posts):**

- XAI sometimes returns malformed JSON
- Check `src/lib/xai.ts` for sanitization logic

**YouTube filtering:**

- Shorts (<=180s) and livestreams are automatically excluded
- See `src/lib/youtube.ts` for filter logic

## Examples

- "Refresh the X posts feed"
- "Sync latest YouTube videos"
- "Check when content was last updated"

## Guardrails

- Do NOT purge data without explicit confirmation
- Run one refresh at a time to avoid rate limits
- Check environment variables are set before calling endpoints
- Never expose API keys in logs or responses
