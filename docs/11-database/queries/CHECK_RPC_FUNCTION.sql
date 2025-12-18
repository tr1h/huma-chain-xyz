-- Check current insert_user_nft function signature and parameters
-- Run this in Supabase SQL Editor to see if function was updated

SELECT 
    p.proname as function_name,
    pg_get_function_arguments(p.oid) as parameters,
    pg_get_functiondef(p.oid) as full_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
  AND p.proname = 'insert_user_nft';

