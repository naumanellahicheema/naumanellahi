import { useAuth } from "@/hooks/useAuth";
import { Users } from "lucide-react";

export default function AdminUsers() {
  const { user } = useAuth();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold" style={{ color: "hsl(var(--admin-fg))" }}>Users & Roles</h1>
      </div>
      
      <div className="admin-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "hsl(var(--admin-muted))" }}><Users size={20} /></div>
          <div>
            <div className="font-semibold" style={{ color: "hsl(var(--admin-fg))" }}>{user?.email}</div>
            <div className="text-sm" style={{ color: "hsl(var(--admin-muted-fg))" }}>Admin</div>
          </div>
        </div>
        <p className="text-sm" style={{ color: "hsl(var(--admin-muted-fg))" }}>
          User management is handled through the backend. Contact the administrator to add or modify user roles.
        </p>
      </div>
    </div>
  );
}