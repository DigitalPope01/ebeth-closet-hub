-- Fix critical security issues

-- 1. Fix audit logs: Remove permissive insert policy and restrict to service role only
DROP POLICY IF EXISTS "System can insert audit logs" ON public.security_audit_logs;

-- Create a new restrictive policy that only allows service role to insert
CREATE POLICY "Only service role can insert audit logs"
ON public.security_audit_logs
FOR INSERT
TO service_role
WITH CHECK (true);

-- Create a secure function to insert audit logs that can be called by authenticated users
CREATE OR REPLACE FUNCTION public.log_security_event(
  _action text,
  _resource_type text DEFAULT NULL,
  _resource_id text DEFAULT NULL,
  _details jsonb DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _log_id uuid;
BEGIN
  INSERT INTO public.security_audit_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    details,
    ip_address,
    user_agent
  ) VALUES (
    auth.uid(),
    _action,
    _resource_type,
    _resource_id,
    _details,
    current_setting('request.headers', true)::json->>'x-forwarded-for',
    current_setting('request.headers', true)::json->>'user-agent'
  )
  RETURNING id INTO _log_id;
  
  RETURN _log_id;
END;
$$;

-- 2. Strengthen profiles table security with additional validation
-- Add policy to prevent users from changing their own ID
CREATE OR REPLACE FUNCTION public.validate_profile_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Prevent users from changing their user ID
  IF NEW.id != OLD.id THEN
    RAISE EXCEPTION 'Cannot change profile ID';
  END IF;
  
  -- Prevent users from changing their email to someone else's
  IF NEW.email != OLD.email AND NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can change email addresses';
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_profile_update_trigger ON public.profiles;
CREATE TRIGGER validate_profile_update_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_profile_update();

-- 3. Add trigger to log sensitive profile changes
CREATE OR REPLACE FUNCTION public.log_profile_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log updates to sensitive fields
  IF (OLD.email != NEW.email OR OLD.phone != NEW.phone OR OLD.address != NEW.address) THEN
    PERFORM public.log_security_event(
      'profile_updated',
      'profile',
      NEW.id::text,
      jsonb_build_object(
        'changed_fields', ARRAY[
          CASE WHEN OLD.email != NEW.email THEN 'email' END,
          CASE WHEN OLD.phone != NEW.phone THEN 'phone' END,
          CASE WHEN OLD.address != NEW.address THEN 'address' END
        ],
        'timestamp', now()
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS log_profile_changes_trigger ON public.profiles;
CREATE TRIGGER log_profile_changes_trigger
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.log_profile_changes();

-- 4. Strengthen coupon access - create user-specific coupon grants
CREATE TABLE IF NOT EXISTS public.coupon_grants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id uuid NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  granted_at timestamp with time zone DEFAULT now(),
  used_at timestamp with time zone,
  UNIQUE(coupon_id, user_id)
);

ALTER TABLE public.coupon_grants ENABLE ROW LEVEL SECURITY;

-- Users can only see coupons granted to them
CREATE POLICY "Users can view their granted coupons"
ON public.coupon_grants
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admins can manage coupon grants
CREATE POLICY "Admins can manage coupon grants"
ON public.coupon_grants
FOR ALL
TO authenticated
USING (is_admin(auth.uid()));

-- Update coupons policy to be more restrictive
DROP POLICY IF EXISTS "Authenticated users can view active coupons" ON public.coupons;

-- Only show coupons that user has been granted or if they're admin
CREATE POLICY "Users can view granted or public coupons"
ON public.coupons
FOR SELECT
TO authenticated
USING (
  is_admin(auth.uid()) 
  OR EXISTS (
    SELECT 1 FROM public.coupon_grants 
    WHERE coupon_grants.coupon_id = coupons.id 
    AND coupon_grants.user_id = auth.uid()
  )
  OR code LIKE 'PUBLIC%' -- Allow codes starting with PUBLIC to be visible to all
);

-- 5. Add index for performance on security-critical queries
CREATE INDEX IF NOT EXISTS idx_coupon_grants_user_id ON public.coupon_grants(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_user_id ON public.security_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_created_at ON public.security_audit_logs(created_at DESC);