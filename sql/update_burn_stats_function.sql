-- SQL Function: update_burn_stats
-- Updates global statistics for burned and recycled tokens (VIRTUAL counters)

CREATE OR REPLACE FUNCTION update_burn_stats(burned BIGINT, recycled BIGINT)
RETURNS void AS $$
BEGIN
  -- Create global_stats table if it doesn't exist
  CREATE TABLE IF NOT EXISTS global_stats (
    id INTEGER PRIMARY KEY DEFAULT 1,
    total_burned BIGINT DEFAULT 0,
    total_recycled BIGINT DEFAULT 0,
    total_withdrawn BIGINT DEFAULT 0,
    total_users INTEGER DEFAULT 0,
    circulating_supply BIGINT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT NOW()
  );
  
  -- Insert default row if doesn't exist
  INSERT INTO global_stats (id, total_burned, total_recycled, last_updated)
  VALUES (1, 0, 0, NOW())
  ON CONFLICT (id) DO NOTHING;
  
  -- Update statistics
  UPDATE global_stats
  SET total_burned = total_burned + burned,
      total_recycled = total_recycled + recycled,
      last_updated = NOW()
  WHERE id = 1;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION update_burn_stats(BIGINT, BIGINT) TO anon, authenticated, service_role;

-- Example usage:
-- SELECT update_burn_stats(300, 150);

