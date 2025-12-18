-- Check the actual type of telegram_id column in user_nfts table
-- Run this in Supabase SQL Editor to verify the column type

SELECT 
    column_name,
    data_type,
    numeric_precision,
    numeric_scale,
    character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'user_nfts' 
  AND column_name = 'telegram_id';

-- If the type is NOT bigint, you may need to alter it:
-- ALTER TABLE user_nfts ALTER COLUMN telegram_id TYPE BIGINT USING telegram_id::BIGINT;

-- Check if RPC function exists
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'insert_user_nft';

