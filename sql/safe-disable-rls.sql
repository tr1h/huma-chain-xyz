-- Safe function to disable RLS only on tables (skip views)
-- Use this instead of direct ALTER TABLE ... DISABLE ROW LEVEL SECURITY

-- This function checks if the relation is a table before trying to disable RLS
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

-- Example usage:
-- SELECT safe_disable_rls('click_analytics');
-- SELECT safe_disable_rls('leaderboard');
-- SELECT safe_disable_rls('site_visits');

-- To disable RLS on multiple tables safely:
-- SELECT safe_disable_rls('click_analytics');
-- SELECT safe_disable_rls('leaderboard');
-- SELECT safe_disable_rls('transactions');

