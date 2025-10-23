-- Add new roles to the user_role enum
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'manager';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'supervisor';

-- Function to assign super admin by email
CREATE OR REPLACE FUNCTION assign_super_admin_by_email(_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid;
BEGIN
  -- Get user_id from profiles table
  SELECT id INTO _user_id FROM public.profiles WHERE email = _email;
  
  IF _user_id IS NOT NULL THEN
    -- Insert or update user role to super_admin
    INSERT INTO public.user_roles (user_id, role)
    VALUES (_user_id, 'super_admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END;
$$;

-- Assign super admin to jerryguma01@gmail.com
SELECT assign_super_admin_by_email('jerryguma01@gmail.com');