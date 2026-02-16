-- Allow admins to read all profiles for notification recipient selection
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow admins to read all profiles" ON profiles;

-- Create new policy allowing admins to read all profiles
CREATE POLICY "Allow admins to read all profiles"
ON profiles
FOR SELECT
TO authenticated
USING (
  -- Allow users to read their own profile
  auth.uid() = id
  OR
  -- Allow admins to read all profiles
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);
