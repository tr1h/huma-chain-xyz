-- Fix RLS error for click_analytics (VIEW)
-- ERROR: ALTER action DISABLE ROW SECURITY cannot be performed on relation "click_analytics"
-- DETAIL: This operation is not supported for views.

-- First, let's check if click_analytics is a VIEW or TABLE
SELECT
    table_type,
    table_name,
    table_schema
FROM information_schema.tables
WHERE table_name = 'click_analytics'
AND table_schema = 'public';

-- If it's a VIEW, we cannot apply RLS to it
-- Views don't support RLS directly
-- Instead, we need to:
-- 1. Check what tables the view is based on
-- 2. Apply RLS to the underlying tables
-- 3. The view will inherit RLS from its base tables

-- Check view definition
SELECT
    view_definition
FROM information_schema.views
WHERE table_name = 'click_analytics'
AND table_schema = 'public';

-- If you need to "disable" RLS for the view, you have two options:

-- Option 1: Drop the view if it's not needed
-- DROP VIEW IF EXISTS click_analytics;

-- Option 2: If the view is needed, ensure RLS is properly configured on underlying tables
-- Check what tables the view depends on and configure RLS there

-- Example: If click_analytics is a view based on site_visits or similar table
-- Make sure RLS is configured on the base table, not the view

-- To safely handle this in code, use this query before trying to disable RLS:
DO $$
BEGIN
    -- Check if click_analytics is a table (not a view)
    IF EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'click_analytics'
        AND table_type = 'BASE TABLE'
        AND table_schema = 'public'
    ) THEN
        -- It's a table, we can disable RLS
        ALTER TABLE click_analytics DISABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'RLS disabled for click_analytics table';
    ELSE
        -- It's a view or doesn't exist, skip RLS operation
        RAISE NOTICE 'click_analytics is a VIEW or does not exist. Skipping RLS operation.';
    END IF;
END $$;

