# Nick Shirley - Portfolio Website

A modern, NYT-inspired portfolio website for Nick Shirley, an independent journalist who travels the world to report on current events.

## Features

- **NYT-Inspired Design**: Clean, professional layout with light theme and black accents
- **Articles System**: Publish and manage articles about YouTube videos, X posts, and original content
- **Live X Feeds**: Real-time display of Nick's X posts and mentions (refreshes every 5 minutes)
- **Responsive Design**: Fully responsive layout for all device sizes
- **Database Integration**: PostgreSQL (Neon) for storing articles and caching feeds

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Database**: Neon (PostgreSQL)
- **API Integration**: XAI API for X feeds
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- A Neon database account
- XAI API key (for X feed integration)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nick-shirley
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
DATABASE_URL=your_neon_database_url
XAI_API_KEY=your_xai_api_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. Set up the database:

Run the SQL in `prisma/schema.sql` in your Neon console to create the required tables.

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── articles/      # Articles CRUD
│   │   └── x/             # X feeds (posts & mentions)
│   ├── articles/          # Articles pages
│   ├── about/             # About page
│   ├── live-feed/         # Live X feed page
│   └── videos/            # Videos page
├── components/            # React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ArticleCard.tsx
│   ├── XFeed.tsx
│   └── YouTubeEmbed.tsx
└── lib/                   # Utilities
    ├── db.ts              # Database queries
    └── xai.ts             # XAI API integration
```

## Deployment on Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `DATABASE_URL`
   - `XAI_API_KEY`
   - `NEXT_PUBLIC_BASE_URL`
4. Deploy

## API Routes

### Articles
- `GET /api/articles` - Get all published articles
- `GET /api/articles?featured=true` - Get featured articles
- `POST /api/articles` - Create new article

### X Feeds
- `GET /api/x/posts` - Get Nick's X posts
- `GET /api/x/mentions` - Get mentions about Nick

## Database Schema

The database includes tables for:
- `articles` - Blog posts and updates
- `x_posts` - Cached X posts from Nick
- `x_mentions` - Cached mentions about Nick
- `youtube_videos` - Cached YouTube video data
- `settings` - Site configuration

## License

All rights reserved.
