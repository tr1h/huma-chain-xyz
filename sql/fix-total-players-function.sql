-- ============================================
-- 🔧 Fix get_total_players_unified function
-- ============================================
-- Fixes error: "UNION types text and bigint cannot be matched"

DROP FUNCTION IF EXISTS get_total_players_unified;

CREATE OR REPLACE FUNCTION get_total_players_unified()
RETURNS BIGINT AS $$
DECLARE
    total_count BIGINT;
BEGIN
    WITH combined_users AS (
        -- Telegram users (non-linked)
        SELECT 1 as player FROM leaderboard WHERE linked_wallet IS NULL
        
        UNION
        
        -- Wallet users
        SELECT 1 as player FROM wallet_users
        
        UNION
        
        -- Telegram users (linked, but not in wallet_users)
        SELECT 1 as player
        FROM leaderboard l
        WHERE l.linked_wallet IS NOT NULL
        AND NOT EXISTS (
            SELECT 1 FROM wallet_users w 
            WHERE w.wallet_address = l.linked_wallet
        )
    )
    SELECT COUNT(*) INTO total_count FROM combined_users;
    
    RETURN total_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_total_players_unified TO service_role, authenticated, anon;

-- Test
SELECT get_total_players_unified() as total_players;

