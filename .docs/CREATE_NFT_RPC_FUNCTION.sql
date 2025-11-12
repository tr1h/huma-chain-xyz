-- Create RPC function to insert NFT with explicit type casting
-- This bypasses PostgREST's type interpretation issues with BIGINT
-- Run this in Supabase SQL Editor

-- Drop old function first
DROP FUNCTION IF EXISTS insert_user_nft(bigint,integer,text,text,text,numeric,integer,boolean);

-- Create function that accepts TEXT for telegram_id and casts it to BIGINT
-- This completely bypasses PostgREST's type conversion issues
CREATE OR REPLACE FUNCTION insert_user_nft(
    p_telegram_id TEXT,  -- Changed from BIGINT to TEXT to bypass PostgREST type issues
    p_nft_design_id INTEGER,
    p_nft_mint_address TEXT,
    p_tier_name TEXT,
    p_rarity TEXT,
    p_earning_multiplier NUMERIC,
    p_purchase_price_tama INTEGER,
    p_is_active BOOLEAN DEFAULT true
)
RETURNS TABLE(
    id INTEGER,
    telegram_id BIGINT,
    nft_design_id INTEGER,
    nft_mint_address TEXT,
    tier_name TEXT,
    rarity TEXT,
    earning_multiplier NUMERIC,
    purchase_price_tama INTEGER,
    is_active BOOLEAN,
    minted_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_result RECORD;
BEGIN
    -- Cast TEXT telegram_id to BIGINT inside function
    -- This bypasses PostgREST's incorrect type handling
    INSERT INTO user_nfts (
        telegram_id,
        nft_design_id,
        nft_mint_address,
        tier_name,
        rarity,
        earning_multiplier,
        purchase_price_tama,
        is_active
    )
    VALUES (
        p_telegram_id::BIGINT,  -- Explicit cast from TEXT to BIGINT
        p_nft_design_id,
        p_nft_mint_address,
        p_tier_name,
        p_rarity,
        p_earning_multiplier,
        p_purchase_price_tama,
        p_is_active
    )
    RETURNING * INTO v_result;
    
    RETURN QUERY SELECT * FROM user_nfts WHERE id = v_result.id;
END;
$$;

-- Grant execute permission to anon role (for PostgREST)
GRANT EXECUTE ON FUNCTION insert_user_nft TO anon;
GRANT EXECUTE ON FUNCTION insert_user_nft TO authenticated;

