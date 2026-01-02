# Nick Shirley - Portfolio Website

A modern, NYT-inspired portfolio website for Nick Shirley, an independent journalist who travels the world to report on current events.

## Features

- **NYT-Inspired Design**: Clean, professional layout with light theme and black accents.
- **Articles System**: Full Markdown support for rich text articles, including bold, italics, lists, and more.
- **Admin Panel**: Secure area to manage content, import/export articles, and manually refresh feeds.
- **Live X Feeds**: Real-time display of Nick's X posts and mentions (cached for performance).
- **Responsive Design**: Fully responsive layout for all device sizes.
- **Database Integration**: PostgreSQL (Neon) for storing articles and caching feeds.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS + @tailwindcss/typography
- **Database**: Neon (PostgreSQL)
- **ORM**: Prisma (Client) / Neon Serverless Driver
- **Content**: React Markdown
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

1. Install dependencies:

```bash
npm install
```

1. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
DATABASE_URL=your_neon_database_url
XAI_API_KEY=your_xai_api_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
ADMIN_PASSWORD=your_strong_admin_password
RATE_LIMIT_MAX=30
RATE_LIMIT_WINDOW_MS=60000
```

1. Initialize the database:

```bash
node scripts/init-db.mjs
```

1. Seed the database with initial content:

```bash
node scripts/seed-db.mjs
```

*Note: You can customize the seed data in `scripts/posts.json`.*

1. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin panel
│   ├── api/               # API routes
│   │   ├── admin/         # Admin actions (refresh, import/export)
│   │   ├── articles/      # Articles CRUD
│   │   └── x/             # X feeds (posts & mentions)
│   ├── articles/          # Articles pages
│   ├── about/             # About page
│   ├── live-feed/         # Live X feed page
│   └── videos/            # Videos page
├── components/            # React components
│   ├── AdminPanel.tsx
│   ├── ArticleCard.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── XFeed.tsx
│   └── YouTubeEmbed.tsx
└── lib/                   # Utilities
    ├── db.ts              # Database queries
    └── xai.ts             # XAI API integration
scripts/
├── init-db.mjs            # Database initialization script
├── seed-db.mjs            # Database seeding script
└── posts.json             # Seed data
```

## Admin Panel

Access the admin panel at `/admin`.

- **Password**: Set via `ADMIN_PASSWORD` (server-side only).
- **Features**:
  - **Feed Refresh**: Manually trigger updates for X posts, mentions, and YouTube videos.
  - **Article Manager**: Import/Export articles via JSON.
  - **Purge**: Delete all articles from the database.

## Database Schema

The database includes tables for:

- `articles` - Blog posts and updates (supports Markdown content)
- `x_posts` - Cached X posts from Nick
- `x_mentions` - Cached mentions about Nick
- `youtube_videos` - Cached YouTube video data
- `youtube_transcripts` - Cached video transcripts
- `settings` - Site configuration

## License

All rights reserved.
