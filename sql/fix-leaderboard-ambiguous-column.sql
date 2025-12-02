-- ============================================
-- 🔧 Fix get_unified_leaderboard - resolve ambiguous column reference
-- ============================================
-- Fixes error: column reference "user_id" is ambiguous

DROP FUNCTION IF EXISTS get_unified_leaderboard(INTEGER, INTEGER);

CREATE OR REPLACE FUNCTION get_unified_leaderboard(
    p_limit INTEGER DEFAULT 100,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    rank BIGINT,
    user_id TEXT,
    username TEXT,
    tama_balance NUMERIC,
    level INTEGER,
    clicks INTEGER,
    account_type TEXT,
    wallet_address TEXT,
    telegram_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    WITH combined_users AS (
        -- Get Telegram users (who are NOT linked to wallet)
        SELECT 
            'tg_' || l.telegram_id::TEXT as user_id,
            'Player' as username,
            l.tama as tama_balance,
            l.level,
            0 as clicks,
            CASE 
                WHEN l.linked_wallet IS NOT NULL THEN 'linked'
                ELSE 'telegram'
            END as account_type,
            l.linked_wallet as wallet_address,
            l.telegram_id::TEXT as telegram_id,
            l.created_at
        FROM leaderboard l
        WHERE l.linked_wallet IS NULL
        
        UNION ALL
        
        -- Get Wallet users (including linked ones)
        SELECT 
            w.user_id,
            COALESCE(w.username, 'Player') as username,
            w.tama_balance,
            w.level,
            COALESCE(w.clicks, 0) as clicks,
            CASE 
                WHEN w.telegram_id IS NOT NULL THEN 'linked'
                ELSE 'wallet'
            END as account_type,
            w.wallet_address,
            w.telegram_id::TEXT as telegram_id,
            w.created_at
        FROM wallet_users w
        
        UNION ALL
        
        -- Get Telegram users who ARE linked (if not in wallet_users)
        SELECT 
            'tg_' || l.telegram_id::TEXT as user_id,
            'Player' as username,
            l.tama as tama_balance,
            l.level,
            0 as clicks,
            'linked' as account_type,
            l.linked_wallet as wallet_address,
            l.telegram_id::TEXT as telegram_id,
            l.created_at
        FROM leaderboard l
        WHERE l.linked_wallet IS NOT NULL
        AND NOT EXISTS (
            SELECT 1 FROM wallet_users w 
            WHERE w.wallet_address = l.linked_wallet
        )
    ),
    ranked_users AS (
        SELECT 
            ROW_NUMBER() OVER (ORDER BY c.tama_balance DESC, c.created_at ASC) as rank,
            c.user_id,
            c.username,
            c.tama_balance,
            c.level,
            c.clicks,
            c.account_type,
            c.wallet_address,
            c.telegram_id,
            c.created_at
        FROM combined_users c
    )
    SELECT 
        r.rank,
        r.user_id,
        r.username,
        r.tama_balance,
        r.level,
        r.clicks,
        r.account_type,
        r.wallet_address,
        r.telegram_id,
        r.created_at
    FROM ranked_users r
    ORDER BY r.rank
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_unified_leaderboard TO service_role, authenticated, anon;

-- Test
SELECT * FROM get_unified_leaderboard(10, 0);

