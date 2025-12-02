-- ============================================
-- 🔧 Fix get_user_rank_unified - resolve UNION type mismatch
-- ============================================
-- Fixes error: "UNION types text and bigint cannot be matched"

DROP FUNCTION IF EXISTS get_user_rank_unified(BIGINT, TEXT, TEXT);

CREATE OR REPLACE FUNCTION get_user_rank_unified(
    p_telegram_id BIGINT DEFAULT NULL,
    p_wallet_address TEXT DEFAULT NULL,
    p_user_id TEXT DEFAULT NULL
)
RETURNS TABLE (
    rank BIGINT,
    user_id TEXT,
    username TEXT,
    tama_balance NUMERIC,
    level INTEGER,
    total_players BIGINT
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
            l.telegram_id::BIGINT as tg_id,
            l.linked_wallet::TEXT as wallet_addr,
            l.created_at
        FROM leaderboard l
        WHERE l.linked_wallet IS NULL
        
        UNION ALL
        
        -- Get Wallet users (including linked ones)
        SELECT 
            w.user_id::TEXT,
            COALESCE(w.username, 'Player') as username,
            w.tama_balance,
            w.level,
            CASE 
                WHEN w.telegram_id IS NOT NULL AND w.telegram_id ~ '^[0-9]+$' 
                THEN w.telegram_id::BIGINT 
                ELSE NULL 
            END as tg_id,
            w.wallet_address::TEXT as wallet_addr,
            w.created_at
        FROM wallet_users w
        
        UNION ALL
        
        -- Get Telegram users who ARE linked (if not in wallet_users)
        SELECT 
            'tg_' || l.telegram_id::TEXT as user_id,
            'Player' as username,
            l.tama as tama_balance,
            l.level,
            l.telegram_id::BIGINT as tg_id,
            l.linked_wallet::TEXT as wallet_addr,
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
            c.tg_id,
            c.wallet_addr
        FROM combined_users c
    ),
    total_count AS (
        SELECT COUNT(*) as total FROM combined_users
    )
    SELECT 
        r.rank,
        r.user_id,
        r.username,
        r.tama_balance,
        r.level,
        t.total as total_players
    FROM ranked_users r
    CROSS JOIN total_count t
    WHERE 
        (p_telegram_id IS NOT NULL AND r.tg_id = p_telegram_id)
        OR (p_wallet_address IS NOT NULL AND r.wallet_addr = p_wallet_address)
        OR (p_user_id IS NOT NULL AND r.user_id = p_user_id)
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_user_rank_unified TO service_role, authenticated, anon;

-- Test with wallet address
-- SELECT * FROM get_user_rank_unified(
--     p_wallet_address := 'AtDKj5NxBsJk67FQgRuVAd3Yig17jzUC7x4hNuFADrvA'
-- );

