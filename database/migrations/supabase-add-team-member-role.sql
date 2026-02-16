-- Add 'team_member' role to the profiles table
-- This migration updates the role constraint to allow: admin, team_member, client, user

-- Drop the existing constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Add new constraint with all four roles
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('admin', 'team_member', 'client', 'user'));

-- Optional: Add comment explaining the roles
COMMENT ON COLUMN profiles.role IS 'User role: admin (full access), team_member (staff with limited access), client (customer), user (general user)';
