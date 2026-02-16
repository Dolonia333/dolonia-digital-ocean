-- Diagnostic queries to check role system setup

-- 1. Check the current role constraint
SELECT
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conname LIKE '%role%'
  AND conrelid = 'profiles'::regclass;

-- 2. Check what roles are currently in use
SELECT
    role,
    COUNT(*) as count
FROM profiles
GROUP BY role
ORDER BY count DESC;

-- 3. Check if there are any NULL roles
SELECT
    id,
    name,
    role,
    created_at
FROM profiles
WHERE role IS NULL;

-- 4. Try to update a test role (replace USER_ID with actual user ID)
-- Uncomment and replace USER_ID to test
-- UPDATE profiles
-- SET role = 'client'
-- WHERE id = 'USER_ID';

-- 5. Check all profiles with their current roles
SELECT
    id,
    name,
    role,
    created_at
FROM profiles
ORDER BY created_at DESC
LIMIT 20;
