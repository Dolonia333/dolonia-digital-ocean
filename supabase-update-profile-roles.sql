-- Update profiles table to support three roles: admin (team member), client, and user
-- This migration adds 'user' as a valid role option

-- First, drop the existing check constraint on the role column
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Add the new check constraint with three valid roles
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
CHECK (role IN ('admin', 'client', 'user'));

-- Update the comment to document the roles
COMMENT ON COLUMN profiles.role IS 'User role: admin (team member), client (customer), or user (general user)';
