-- Check actual data type of telegram_id in user_nfts table
SELECT 
    column_name, 
    data_type,
    udt_name,
    character_maximum_length
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'user_nfts' 
  AND column_name = 'telegram_id';

