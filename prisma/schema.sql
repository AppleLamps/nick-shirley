-- Nick Shirley Portfolio Database Schema
-- Run this SQL in your Neon console to set up the database

-- Articles table for storing content about Nick's updates
CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image VARCHAR(1000),
    category VARCHAR(100) DEFAULT 'update',
    source_type VARCHAR(50), -- 'youtube', 'x_post', 'original'
    source_url VARCHAR(1000),
    published BOOLEAN DEFAULT false,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- X Posts cache for Nick's timeline
CREATE TABLE IF NOT EXISTS x_posts (
    id SERIAL PRIMARY KEY,
    post_id VARCHAR(100) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    author_username VARCHAR(100) NOT NULL,
    author_name VARCHAR(200),
    author_avatar VARCHAR(500),
    likes_count INTEGER DEFAULT 0,
    retweets_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    media_urls TEXT[], -- Array of media URLs
    posted_at TIMESTAMP WITH TIME ZONE,
    fetched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Mentions cache for posts about Nick
CREATE TABLE IF NOT EXISTS x_mentions (
    id SERIAL PRIMARY KEY,
    post_id VARCHAR(100) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    author_username VARCHAR(100) NOT NULL,
    author_name VARCHAR(200),
    author_avatar VARCHAR(500),
    likes_count INTEGER DEFAULT 0,
    retweets_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    posted_at TIMESTAMP WITH TIME ZONE,
    fetched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- YouTube videos cache
CREATE TABLE IF NOT EXISTS youtube_videos (
    id SERIAL PRIMARY KEY,
    video_id VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    thumbnail_url VARCHAR(500),
    published_at TIMESTAMP WITH TIME ZONE,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    fetched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Site settings
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_x_posts_posted_at ON x_posts(posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_x_mentions_posted_at ON x_mentions(posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_published_at ON youtube_videos(published_at DESC);

-- Insert default settings
INSERT INTO settings (key, value) VALUES
    ('site_title', 'Nick Shirley'),
    ('site_tagline', 'Independent Journalist'),
    ('x_handle', 'nickshirley'),
    ('youtube_channel', '')
ON CONFLICT (key) DO NOTHING;
