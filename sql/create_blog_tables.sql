-- Blog Statistics Tables
-- Run this in Supabase SQL Editor

-- Table: blog_views (track article views)
CREATE TABLE IF NOT EXISTS blog_views (
    id BIGSERIAL PRIMARY KEY,
    article_slug TEXT NOT NULL,
    ip_address TEXT NOT NULL,
    user_agent TEXT,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(article_slug, ip_address, DATE(viewed_at))
);

-- Table: blog_likes (track article likes)
CREATE TABLE IF NOT EXISTS blog_likes (
    id BIGSERIAL PRIMARY KEY,
    article_slug TEXT NOT NULL,
    user_id TEXT NOT NULL,
    liked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(article_slug, user_id)
);

-- Table: blog_comments (store article comments)
CREATE TABLE IF NOT EXISTS blog_comments (
    id BIGSERIAL PRIMARY KEY,
    article_slug TEXT NOT NULL,
    author TEXT NOT NULL,
    comment TEXT NOT NULL,
    user_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_views_slug ON blog_views(article_slug);
CREATE INDEX IF NOT EXISTS idx_blog_views_date ON blog_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_blog_likes_slug ON blog_likes(article_slug);
CREATE INDEX IF NOT EXISTS idx_blog_comments_slug ON blog_comments(article_slug);
CREATE INDEX IF NOT EXISTS idx_blog_comments_created ON blog_comments(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE blog_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- Policies: Allow public read, authenticated write
CREATE POLICY "Public read access" ON blog_views FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON blog_views FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read access" ON blog_likes FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON blog_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public delete access" ON blog_likes FOR DELETE USING (true);

CREATE POLICY "Public read access" ON blog_comments FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON blog_comments FOR INSERT WITH CHECK (true);

-- Comments
COMMENT ON TABLE blog_views IS 'Tracks article page views (one per IP per day)';
COMMENT ON TABLE blog_likes IS 'Tracks article likes (one per user)';
COMMENT ON TABLE blog_comments IS 'Stores article comments';

