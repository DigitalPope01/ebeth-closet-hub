import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type User = {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
};

type UserRole = {
  user_id: string;
  role: string;
};

export default function AdminUsers() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
      return;
    }

    const checkAdminStatus = async () => {
      if (!user) return;

      const { data } = await supabase.rpc("is_admin", { _user_id: user.id });

      if (!data) {
        navigate("/");
        return;
      }

      setIsAdmin(true);
      fetchUsers();
      fetchUserRoles();
    };

    if (user) {
      checkAdminStatus();
    }
  }, [user, loading, navigate]);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch users");
      return;
    }

    setUsers(data || []);
  };

  const fetchUserRoles = async () => {
    const { data } = await supabase.from("user_roles").select("*");
    setUserRoles(data || []);
  };

  const getUserRole = (userId: string) => {
    const role = userRoles.find((r) => r.user_id === userId);
    return role?.role || "user";
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    const existingRole = userRoles.find((r) => r.user_id === userId);

    if (existingRole) {
      const { error } = await supabase
        .from("user_roles")
        .update({ role: newRole as "user" | "supervisor" | "manager" | "admin" | "super_admin" })
        .eq("user_id", userId);

      if (error) {
        toast.error("Failed to update role");
        return;
      }
    } else {
      const { error } = await supabase
        .from("user_roles")
        .insert([{ user_id: userId, role: newRole as "user" | "supervisor" | "manager" | "admin" | "super_admin" }]);

      if (error) {
        toast.error("Failed to assign role");
        return;
      }
    }

    toast.success("Role updated successfully");
    fetchUserRoles();
  };

  if (loading || !isAdmin) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">User Management</h1>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.full_name || "-"}</TableCell>
                <TableCell>
                  <Select value={getUserRole(user.id)} onValueChange={(value) => handleRoleChange(user.id, value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
