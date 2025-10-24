-- Fix security vulnerabilities

-- 1. Restrict coupon SELECT to authenticated users only
DROP POLICY IF EXISTS "Anyone can view active coupons" ON public.coupons;

CREATE POLICY "Authenticated users can view active coupons" 
ON public.coupons 
FOR SELECT 
TO authenticated
USING (is_active = true);

-- 2. Add DELETE policy for profiles (GDPR compliance)
CREATE POLICY "Users can delete their own profile" 
ON public.profiles 
FOR DELETE 
USING (auth.uid() = id OR is_admin(auth.uid()));

-- 3. Add DELETE policy for user_roles (prevent privilege escalation)
CREATE POLICY "Admins can delete user roles" 
ON public.user_roles 
FOR DELETE 
USING (is_admin(auth.uid()));

-- 4. Add UPDATE policy for wishlist
CREATE POLICY "Users can update their wishlist" 
ON public.wishlist 
FOR UPDATE 
USING (auth.uid() = user_id);

-- 5. Add proper policies for security_audit_logs
CREATE POLICY "System can insert audit logs" 
ON public.security_audit_logs 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Prevent audit log tampering" 
ON public.security_audit_logs 
FOR UPDATE 
USING (false);

CREATE POLICY "Prevent audit log deletion" 
ON public.security_audit_logs 
FOR DELETE 
USING (false);