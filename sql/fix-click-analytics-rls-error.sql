-- ============================================
-- 🔧 FIX click_analytics RLS ERROR
-- ============================================
-- Error: ALTER action DISABLE ROW SECURITY cannot be performed on relation "click_analytics"
-- Cause: click_analytics is a VIEW, not a TABLE. RLS can only be applied to tables.
-- ============================================

-- Step 1: Ensure safe_disable_rls function exists
-- (This function checks if relation is a table before trying to disable RLS)
CREATE OR REPLACE FUNCTION safe_disable_rls(table_name_param TEXT)
RETURNS TEXT AS $$
DECLARE
    relation_type TEXT;
BEGIN
    -- Check if it's a table or view
    SELECT table_type INTO relation_type
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = table_name_param;

    IF relation_type IS NULL THEN
        RETURN 'Relation "' || table_name_param || '" does not exist.';
    ELSIF relation_type = 'VIEW' THEN
        RETURN 'Skipped: "' || table_name_param || '" is a VIEW. RLS cannot be disabled on views.';
    ELSIF relation_type = 'BASE TABLE' THEN
        EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY', table_name_param);
        RETURN 'RLS disabled for table "' || table_name_param || '".';
    ELSE
        RETURN 'Unknown relation type for "' || table_name_param || '": ' || relation_type;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Step 2: Use safe function to disable RLS (will skip VIEW automatically)
SELECT safe_disable_rls('click_analytics');
-- Expected result: "Skipped: 'click_analytics' is a VIEW. RLS cannot be disabled on views."

-- Step 3: Check what click_analytics actually is
SELECT
    table_name,
    table_type,
    CASE
        WHEN table_type = 'VIEW' THEN 'Use RLS on underlying tables instead'
        WHEN table_type = 'BASE TABLE' THEN 'RLS can be disabled on this table'
        ELSE 'Unknown type'
    END as rls_note
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = 'click_analytics';

-- Step 4: If click_analytics is a VIEW, find underlying tables
SELECT
    dependent_view.relname as view_name,
    source_table.relname as source_table,
    source_ns.nspname as source_schema
FROM pg_depend
JOIN pg_rewrite ON pg_depend.objid = pg_rewrite.oid
JOIN pg_class dependent_view ON pg_rewrite.ev_class = dependent_view.oid
JOIN pg_class source_table ON pg_depend.refobjid = source_table.oid
JOIN pg_namespace dependent_ns ON dependent_view.relnamespace = dependent_ns.oid
JOIN pg_namespace source_ns ON source_table.relnamespace = source_ns.oid
WHERE dependent_ns.nspname = 'public'
AND dependent_view.relname = 'click_analytics'
AND source_table.relkind = 'r';

-- ============================================
-- ✅ SOLUTION:
-- ============================================
-- If you need to disable RLS on click_analytics:
-- 1. Find the underlying tables (see Step 4 query above)
-- 2. Use safe_disable_rls() on those tables instead
-- 3. Or simply ignore this error - RLS on VIEWs is not supported by PostgreSQL
-- ============================================

