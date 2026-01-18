import { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, User, FolderOpen, Briefcase, GraduationCap, Award, MessageSquare, FileText, Mail, Image, Settings, Users, Search, LogOut, Menu, X } from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profile", icon: User },
  { href: "/admin/projects", label: "Projects", icon: FolderOpen },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/experience", label: "Experience", icon: GraduationCap },
  { href: "/admin/skills", label: "Skills", icon: Award },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { href: "/admin/posts", label: "Blog Posts", icon: FileText },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/media", label: "Media", icon: Image },
  { href: "/admin/seo", label: "SEO", icon: Search },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/users", label: "Users", icon: Users },
];

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => { await signOut(); navigate("/admin"); };

  return (
    <div className="admin-container flex">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform lg:transform-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`} style={{ background: "hsl(var(--admin-bg))", borderRight: "1px solid hsl(var(--admin-border))" }}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b" style={{ borderColor: "hsl(var(--admin-border))" }}>
            <Link to="/" className="text-xl font-display font-bold" style={{ color: "hsl(var(--admin-fg))" }}>Admin Panel</Link>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link key={item.href} to={item.href} onClick={() => setSidebarOpen(false)} className={`admin-nav-item ${location.pathname === item.href ? "active" : ""}`}>
                <item.icon size={18} />{item.label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t" style={{ borderColor: "hsl(var(--admin-border))" }}>
            <div className="text-sm mb-3 truncate" style={{ color: "hsl(var(--admin-muted-fg))" }}>{user?.email}</div>
            <button onClick={handleSignOut} className="admin-nav-item w-full justify-start"><LogOut size={18} />Sign Out</button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-h-screen">
        <header className="h-16 border-b flex items-center px-6 lg:hidden" style={{ background: "hsl(var(--admin-bg))", borderColor: "hsl(var(--admin-border))" }}>
          <button onClick={() => setSidebarOpen(true)} className="p-2"><Menu size={24} /></button>
          <span className="ml-4 font-display font-bold">Admin</span>
        </header>
        <main className="p-6 lg:p-8"><Outlet /></main>
      </div>
    </div>
  );
}