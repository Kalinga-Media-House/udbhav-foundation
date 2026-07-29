-- Verify 001-020 migrations applied
SELECT version, name FROM supabase_migrations.schema_migrations ORDER BY version;

-- Verify donors table does not exist
SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'donors') as donors_exists;

-- Verify donations references contacts
SELECT 
    kcu.constraint_name,
    kcu.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'donations';

-- Verify ledger, refunds, receipts, webhooks tables exist
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('financial_ledger', 'donation_refunds', 'tax_receipts', 'payment_webhooks');
