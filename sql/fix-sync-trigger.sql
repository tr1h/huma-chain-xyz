-- ============================================
-- 🔧 Fix sync_linked_accounts trigger
-- ============================================
-- This fixes the error: "record \"new\" has no field \"linked_wallet\""
-- The trigger was trying to access linked_wallet in wallet_users table
-- but that field only exists in leaderboard table

-- Drop existing triggers
DROP TRIGGER IF EXISTS trigger_sync_wallet_users ON wallet_users;
DROP TRIGGER IF EXISTS trigger_sync_leaderboard ON leaderboard;

-- Recreate the sync function with safer logic
CREATE OR REPLACE FUNCTION sync_linked_accounts()
RETURNS TRIGGER AS $$
BEGIN
    -- If wallet_users updated and has telegram_id, update leaderboard
    IF TG_TABLE_NAME = 'wallet_users' AND NEW.telegram_id IS NOT NULL THEN
        -- Only sync if telegram_id exists in leaderboard
        UPDATE leaderboard
        SET 
            tama = NEW.tama_balance,
            level = NEW.level
        WHERE telegram_id = NEW.telegram_id;
    END IF;
    
    -- If leaderboard updated and has linked_wallet, update wallet_users
    IF TG_TABLE_NAME = 'leaderboard' AND NEW.linked_wallet IS NOT NULL THEN
        -- Only sync if linked_wallet exists in wallet_users
        UPDATE wallet_users
        SET 
            tama_balance = NEW.tama,
            level = NEW.level,
            telegram_id = NEW.telegram_id
        WHERE wallet_address = NEW.linked_wallet;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate triggers with proper conditions
CREATE TRIGGER trigger_sync_wallet_users
    AFTER UPDATE ON wallet_users
    FOR EACH ROW
    WHEN (
        (OLD.tama_balance IS DISTINCT FROM NEW.tama_balance 
         OR OLD.level IS DISTINCT FROM NEW.level)
        AND NEW.telegram_id IS NOT NULL
    )
    EXECUTE FUNCTION sync_linked_accounts();

CREATE TRIGGER trigger_sync_leaderboard
    AFTER UPDATE ON leaderboard
    FOR EACH ROW
    WHEN (
        (OLD.tama IS DISTINCT FROM NEW.tama 
         OR OLD.level IS DISTINCT FROM NEW.level)
        AND NEW.linked_wallet IS NOT NULL
    )
    EXECUTE FUNCTION sync_linked_accounts();

-- ============================================
-- Done! 🎉
-- ============================================

