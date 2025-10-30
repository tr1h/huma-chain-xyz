-- Create economy_config table for game economy settings
CREATE TABLE IF NOT EXISTS economy_config (
    id SERIAL PRIMARY KEY,
    config_name VARCHAR(50) UNIQUE NOT NULL,
    base_click_reward DECIMAL(10, 2) DEFAULT 1.0,
    min_reward DECIMAL(10, 2) DEFAULT 0.5,
    max_combo_bonus INTEGER DEFAULT 10,
    combo_window INTEGER DEFAULT 2500,
    combo_cooldown INTEGER DEFAULT 800,
    combo_bonus_divider INTEGER DEFAULT 5,
    spam_penalty DECIMAL(5, 4) DEFAULT 0.5,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default configs
INSERT INTO economy_config (config_name, base_click_reward, min_reward, max_combo_bonus, combo_window, combo_cooldown, combo_bonus_divider, spam_penalty, is_active)
VALUES 
    ('balanced', 1.0, 0.5, 10, 2500, 800, 5, 0.5, true),
    ('generous', 2.0, 1.0, 20, 3000, 500, 3, 0.3, false),
    ('strict', 0.5, 0.25, 5, 2000, 1000, 10, 0.7, false)
ON CONFLICT (config_name) DO NOTHING;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_economy_config_active ON economy_config(is_active);

-- Enable RLS (Row Level Security)
ALTER TABLE economy_config ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access" ON economy_config
    FOR SELECT USING (true);

-- Create policy for authenticated write access (for admin)
CREATE POLICY "Allow authenticated write access" ON economy_config
    FOR ALL USING (true);




