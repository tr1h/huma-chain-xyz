-- Check if click_analytics is a TABLE or VIEW
-- Run this first to understand what you're working with

SELECT
    table_type,
    table_name,
    table_schema,
    CASE
        WHEN table_type = 'VIEW' THEN 'This is a VIEW - RLS cannot be applied'
        WHEN table_type = 'BASE TABLE' THEN 'This is a TABLE - RLS can be applied'
        ELSE 'Unknown type'
    END as rls_info
FROM information_schema.tables
WHERE table_name = 'click_analytics'
AND table_schema = 'public';

-- If it's a VIEW, show its definition
SELECT
    view_definition
FROM information_schema.views
WHERE table_name = 'click_analytics'
AND table_schema = 'public';

-- If it's a VIEW, show what tables it depends on
SELECT
    DISTINCT
    dependent_ns.nspname as dependent_schema,
    dependent_view.relname as dependent_view,
    source_ns.nspname as source_schema,
    source_table.relname as source_table
FROM pg_depend
JOIN pg_rewrite ON pg_depend.objid = pg_rewrite.oid
JOIN pg_class as dependent_view ON pg_rewrite.ev_class = dependent_view.oid
JOIN pg_class as source_table ON pg_depend.refobjid = source_table.oid
JOIN pg_namespace dependent_ns ON dependent_ns.oid = dependent_view.relnamespace
JOIN pg_namespace source_ns ON source_ns.oid = source_table.relnamespace
WHERE dependent_view.relname = 'click_analytics'
AND source_table.relkind = 'r'; -- 'r' = regular table

