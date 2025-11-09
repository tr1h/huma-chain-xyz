-- Economy Config Table for Solana Tamagotchi
-- Stores global game economy settings

CREATE TABLE IF NOT EXISTS economy_config (
    id SERIAL PRIMARY KEY,
    config_name VARCHAR(100) NOT NULL UNIQUE, -- 'balanced', 'generous', 'strict', 'custom'
    base_click_reward DECIMAL(10, 2) DEFAULT 1.0,
    min_reward DECIMAL(10, 2) DEFAULT 0.5,
    max_combo_bonus INTEGER DEFAULT 10,
    combo_window INTEGER DEFAULT 2500, -- milliseconds
    combo_cooldown INTEGER DEFAULT 800, -- milliseconds
    combo_bonus_divider INTEGER DEFAULT 5,
    spam_penalty DECIMAL(5, 2) DEFAULT 0.5, -- 0.5 = 50% penalty
    hp_per_click DECIMAL(10, 2) DEFAULT 0.1,
    food_per_click DECIMAL(10, 2) DEFAULT 0.05,
    happy_per_click DECIMAL(10, 2) DEFAULT 0.05,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create unique index on config_name
CREATE UNIQUE INDEX IF NOT EXISTS idx_economy_config_name ON economy_config(config_name);

-- Create index on is_active for fast lookup
CREATE INDEX IF NOT EXISTS idx_economy_config_active ON economy_config(is_active);

-- Insert default presets
INSERT INTO economy_config (config_name, base_click_reward, min_reward, max_combo_bonus, combo_window, combo_cooldown, combo_bonus_divider, spam_penalty, hp_per_click, food_per_click, happy_per_click, is_active)
VALUES 
    ('balanced', 1.0, 0.5, 10, 2500, 800, 5, 0.5, 0.1, 0.05, 0.05, TRUE),
    ('generous', 2.0, 1.0, 20, 3000, 500, 3, 0.7, 0.05, 0.03, 0.03, FALSE),
    ('strict', 0.5, 0.3, 5, 2000, 1000, 10, 0.3, 0.2, 0.1, 0.1, FALSE)
ON CONFLICT (config_name) DO UPDATE SET
    base_click_reward = EXCLUDED.base_click_reward,
    min_reward = EXCLUDED.min_reward,
    max_combo_bonus = EXCLUDED.max_combo_bonus,
    combo_window = EXCLUDED.combo_window,
    combo_cooldown = EXCLUDED.combo_cooldown,
    combo_bonus_divider = EXCLUDED.combo_bonus_divider,
    spam_penalty = EXCLUDED.spam_penalty,
    hp_per_click = EXCLUDED.hp_per_click,
    food_per_click = EXCLUDED.food_per_click,
    happy_per_click = EXCLUDED.happy_per_click,
    updated_at = NOW();

-- Enable RLS (Row Level Security)
ALTER TABLE economy_config ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all users to read economy config
CREATE POLICY "Allow public read access to economy_config"
ON economy_config FOR SELECT
USING (true);

-- Policy: Allow admin to update economy config (for now, allow all)
CREATE POLICY "Allow admin update to economy_config"
ON economy_config FOR UPDATE
USING (true);

-- Policy: Allow admin to insert economy config (for now, allow all)
CREATE POLICY "Allow admin insert to economy_config"
ON economy_config FOR INSERT
WITH CHECK (true);

COMMENT ON TABLE economy_config IS 'Global game economy settings for Solana Tamagotchi';
COMMENT ON COLUMN economy_config.config_name IS 'Preset name: balanced, generous, strict, custom';
COMMENT ON COLUMN economy_config.is_active IS 'Only one config can be active at a time';
COMMENT ON COLUMN economy_config.spam_penalty IS 'Reward multiplier for spam clicking (0.5 = 50% penalty)';
COMMENT ON COLUMN economy_config.combo_window IS 'Time window for combo in milliseconds';
COMMENT ON COLUMN economy_config.combo_cooldown IS 'Minimum time between clicks in milliseconds';

