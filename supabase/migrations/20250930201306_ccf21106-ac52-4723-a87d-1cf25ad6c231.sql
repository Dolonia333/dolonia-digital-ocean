-- Make the leads SELECT policy more explicit to prevent any unauthorized access
DROP POLICY IF EXISTS "Admins can view all leads" ON public.leads;

CREATE POLICY "Only authenticated admins can view leads"
ON public.leads
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND 
  is_admin(auth.uid())
);