import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Users, Plus, Save, X, Shield, Edit, Key } from "lucide-react";

export default function AdminUsers() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newUser, setNewUser] = useState({ email: "", password: "", role: "admin" });
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.password) {
      toast({ title: "Error", description: "Email and password are required", variant: "destructive" });
      return;
    }
    
    if (newUser.password.length < 8) {
      toast({ title: "Error", description: "Password must be at least 8 characters", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Call the setup-admin edge function to create the user
      const { data, error } = await supabase.functions.invoke('setup-admin', {
        body: { email: newUser.email, password: newUser.password }
      });

      if (error) throw error;

      toast({ title: "Admin user created successfully!" });
      setShowCreateUser(false);
      setNewUser({ email: "", password: "", role: "admin" });
    } catch (error: any) {
      console.error("Create user error:", error);
      toast({ title: "Error", description: error.message || "Failed to create user", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwords.new || !passwords.confirm) {
      toast({ title: "Error", description: "Please fill in all password fields", variant: "destructive" });
      return;
    }
    
    if (passwords.new !== passwords.confirm) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }
    
    if (passwords.new.length < 8) {
      toast({ title: "Error", description: "Password must be at least 8 characters", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: passwords.new });
      
      if (error) throw error;

      toast({ title: "Password updated successfully!" });
      setShowChangePassword(false);
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (error: any) {
      console.error("Change password error:", error);
      toast({ title: "Error", description: error.message || "Failed to change password", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold" style={{ color: "hsl(var(--admin-fg))" }}>Users & Roles</h1>
        <button onClick={() => setShowCreateUser(true)} className="admin-btn"><Plus size={16} /> Add Admin</button>
      </div>

      {/* Create User Modal */}
      {showCreateUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowCreateUser(false); }}>
          <div className="admin-card p-6 w-full max-w-md" style={{ background: "hsl(var(--admin-bg))" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold" style={{ color: "hsl(var(--admin-fg))" }}>Create Admin User</h2>
              <button onClick={() => setShowCreateUser(false)} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="admin-label">Email *</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="admin-input"
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <label className="admin-label">Password *</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="admin-input"
                  placeholder="Minimum 8 characters"
                />
              </div>
              <div>
                <label className="admin-label">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="admin-input"
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={handleCreateUser} disabled={loading} className="admin-btn">
                  <Save size={16} /> {loading ? "Creating..." : "Create User"}
                </button>
                <button onClick={() => setShowCreateUser(false)} className="admin-btn-outline">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowChangePassword(false); }}>
          <div className="admin-card p-6 w-full max-w-md" style={{ background: "hsl(var(--admin-bg))" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold" style={{ color: "hsl(var(--admin-fg))" }}>Change Password</h2>
              <button onClick={() => setShowChangePassword(false)} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="admin-label">New Password *</label>
                <input
                  type="password"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  className="admin-input"
                  placeholder="Minimum 8 characters"
                />
              </div>
              <div>
                <label className="admin-label">Confirm New Password *</label>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  className="admin-input"
                  placeholder="Confirm new password"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={handleChangePassword} disabled={loading} className="admin-btn">
                  <Key size={16} /> {loading ? "Updating..." : "Update Password"}
                </button>
                <button onClick={() => setShowChangePassword(false)} className="admin-btn-outline">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Current User Card */}
      <div className="admin-card p-6">
        <h2 className="text-lg font-semibold mb-6" style={{ color: "hsl(var(--admin-fg))" }}>Current User</h2>
        <div className="flex items-center gap-4 p-4 rounded-lg" style={{ background: "hsl(var(--admin-muted))" }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "hsl(var(--admin-accent))", color: "hsl(var(--admin-accent-fg))" }}>
            <Shield size={24} />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-lg" style={{ color: "hsl(var(--admin-fg))" }}>{user?.email}</div>
            <div className="text-sm flex items-center gap-2" style={{ color: "hsl(var(--admin-muted-fg))" }}>
              <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ background: "hsl(var(--admin-accent))", color: "hsl(var(--admin-accent-fg))" }}>
                Admin
              </span>
              <span>•</span>
              <span>Created: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}</span>
            </div>
          </div>
          <button 
            onClick={() => setShowChangePassword(true)} 
            className="admin-btn-outline"
          >
            <Key size={16} /> Change Password
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="admin-card p-6 mt-6">
        <h2 className="text-lg font-semibold mb-4" style={{ color: "hsl(var(--admin-fg))" }}>User Management</h2>
        <div className="space-y-3 text-sm" style={{ color: "hsl(var(--admin-muted-fg))" }}>
          <p>• <strong>Admin</strong> - Full access to all features and settings</p>
          <p>• <strong>User</strong> - Limited access (view only)</p>
          <p className="pt-2">To add a new admin, click the "Add Admin" button above and fill in the user details.</p>
        </div>
      </div>
    </div>
  );
}
