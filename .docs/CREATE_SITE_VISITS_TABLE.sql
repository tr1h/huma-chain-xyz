-- Create site_visits table for tracking website visits
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS site_visits (
    id BIGSERIAL PRIMARY KEY,
    visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
    visit_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    page_url TEXT,
    referrer TEXT,
    user_agent TEXT,
    ip_address TEXT,
    country TEXT,
    city TEXT,
    device_type TEXT, -- mobile, desktop, tablet
    browser TEXT,
    os TEXT,
    session_id TEXT,
    is_unique BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_site_visits_date ON site_visits(visit_date);
CREATE INDEX IF NOT EXISTS idx_site_visits_time ON site_visits(visit_time);
CREATE INDEX IF NOT EXISTS idx_site_visits_session ON site_visits(session_id);

-- Enable RLS (Row Level Security)
ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for tracking)
CREATE POLICY "Allow anonymous inserts" ON site_visits
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Allow authenticated reads (for admin)
CREATE POLICY "Allow authenticated reads" ON site_visits
    FOR SELECT
    TO authenticated
    USING (true);

-- Grant permissions
GRANT INSERT ON site_visits TO anon;
GRANT SELECT ON site_visits TO authenticated;
GRANT USAGE ON SEQUENCE site_visits_id_seq TO anon;

