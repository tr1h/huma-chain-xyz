-- ==========================================
-- 🔐 ATOMIC WITHDRAWAL FUNCTION
-- SECURITY FIX #2: Prevents double-spending race conditions
-- ==========================================

CREATE OR REPLACE FUNCTION withdraw_tama_atomic(
    p_telegram_id BIGINT,
    p_amount INTEGER,
    p_wallet_address TEXT,
    p_transaction_signature TEXT DEFAULT NULL
) RETURNS JSON AS $$
DECLARE
    v_current_balance INTEGER;
    v_new_balance INTEGER;
    v_fee INTEGER;
    v_amount_sent INTEGER;
    v_user_exists BOOLEAN;
BEGIN
    -- ==========================================
    -- STEP 1: LOCK ROW FOR UPDATE (Prevents race conditions)
    -- ==========================================
    SELECT tama INTO v_current_balance
    FROM leaderboard
    WHERE telegram_id = p_telegram_id
    FOR UPDATE; -- 🔒 This locks the row until transaction completes
    
    -- Check if user exists
    GET DIAGNOSTICS v_user_exists = FOUND;
    
    IF NOT v_user_exists THEN
        RAISE EXCEPTION 'User not found: %', p_telegram_id;
    END IF;
    
    -- ==========================================
    -- STEP 2: VALIDATE BALANCE
    -- ==========================================
    IF v_current_balance IS NULL THEN
        v_current_balance := 0;
    END IF;
    
    IF p_amount < 1000 THEN
        RAISE EXCEPTION 'Minimum withdrawal is 1,000 TAMA';
    END IF;
    
    IF p_amount > 1000000 THEN
        RAISE EXCEPTION 'Maximum withdrawal is 1,000,000 TAMA per transaction';
    END IF;
    
    IF v_current_balance < p_amount THEN
        RAISE EXCEPTION 'Insufficient balance. You have % TAMA, trying to withdraw % TAMA', 
            v_current_balance, p_amount;
    END IF;
    
    -- ==========================================
    -- STEP 3: CALCULATE FEE (5%)
    -- ==========================================
    v_fee := FLOOR(p_amount * 0.05);
    v_amount_sent := p_amount - v_fee;
    v_new_balance := v_current_balance - p_amount;
    
    -- ==========================================
    -- STEP 4: UPDATE BALANCE (Still locked!)
    -- ==========================================
    UPDATE leaderboard
    SET tama = v_new_balance
    WHERE telegram_id = p_telegram_id;
    
    -- ==========================================
    -- STEP 5: LOG TRANSACTION
    -- ==========================================
    INSERT INTO transactions (
        user_id,
        username,
        type,
        amount,
        balance_before,
        balance_after,
        metadata
    )
    SELECT
        p_telegram_id::TEXT,
        telegram_username,
        'withdrawal',
        -p_amount, -- Negative for withdrawal
        v_current_balance,
        v_new_balance,
        jsonb_build_object(
            'wallet_address', p_wallet_address,
            'amount_requested', p_amount,
            'fee', v_fee,
            'amount_sent', v_amount_sent,
            'transaction_signature', p_transaction_signature
        )
    FROM leaderboard
    WHERE telegram_id = p_telegram_id;
    
    -- ==========================================
    -- STEP 6: RETURN SUCCESS
    -- ==========================================
    RETURN json_build_object(
        'success', TRUE,
        'balance_before', v_current_balance,
        'balance_after', v_new_balance,
        'amount_requested', p_amount,
        'fee', v_fee,
        'amount_sent', v_amount_sent,
        'wallet_address', p_wallet_address,
        'transaction_signature', p_transaction_signature
    );
    
EXCEPTION
    WHEN OTHERS THEN
        -- Rollback happens automatically
        RETURN json_build_object(
            'success', FALSE,
            'error', SQLERRM
        );
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- GRANT EXECUTE PERMISSION
-- ==========================================
GRANT EXECUTE ON FUNCTION withdraw_tama_atomic TO anon;
GRANT EXECUTE ON FUNCTION withdraw_tama_atomic TO authenticated;

-- ==========================================
-- USAGE EXAMPLE
-- ==========================================
-- SELECT withdraw_tama_atomic(
--     123456789,                              -- telegram_id
--     10000,                                  -- amount (10,000 TAMA)
--     '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZR', -- wallet_address
--     '5KqR...'                               -- transaction_signature (optional)
-- );

-- ==========================================
-- TEST RACE CONDITION PREVENTION
-- ==========================================
-- Run these two queries SIMULTANEOUSLY from different sessions:
-- 
-- Session 1:
-- SELECT withdraw_tama_atomic(123456789, 10000, 'wallet1', NULL);
--
-- Session 2:
-- SELECT withdraw_tama_atomic(123456789, 10000, 'wallet2', NULL);
--
-- RESULT: Only ONE will succeed! The other will wait and then fail with "Insufficient balance"
-- This proves the race condition is fixed! ✅

