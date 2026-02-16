-- ============================================
-- UPDATE ROLE CONSTRAINT TO INCLUDE TEAM_MEMBER
-- ============================================
-- This migration updates the profiles table to allow the 'team_member' role
-- Run this in your Supabase SQL Editor

-- Step 1: Drop the old constraint (if it exists)
ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Step 2: Add the new constraint with all 4 roles
ALTER TABLE profiles
ADD CONSTRAINT profiles_role_check
CHECK (role IN ('admin', 'team_member', 'client', 'user'));

-- Step 3: Verify the constraint was updated
SELECT
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conname = 'profiles_role_check'
  AND conrelid = 'profiles'::regclass;

-- You should see output showing: CHECK ((role = ANY (ARRAY['admin'::text, 'team_member'::text, 'client'::text, 'user'::text])))
