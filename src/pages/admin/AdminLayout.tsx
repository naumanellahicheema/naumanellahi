import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, User, FolderOpen, Briefcase, GraduationCap, Award,
  MessageSquare, FileText, Mail, Image as ImageIcon, Settings, Users,
  Search, LogOut, Menu, X, PanelLeft, ChevronsLeft, ChevronsRight,
  Command as CommandIcon, ExternalLink, Sparkles,
} from "lucide-react";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput,
  CommandItem, CommandList, CommandSeparator,
} from "@/components/ui/command";

type NavItem = { href: string; label: string; icon: any; group: string };

const navItems: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, group: "Overview" },
  { href: "/admin/pages", label: "Pages", icon: PanelLeft, group: "Content" },
  { href: "/admin/projects", label: "Projects", icon: FolderOpen, group: "Content" },
  { href: "/admin/services", label: "Services", icon: Briefcase, group: "Content" },
  { href: "/admin/posts", label: "Blog Posts", icon: FileText, group: "Content" },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare, group: "Content" },
  { href: "/admin/experience", label: "Experience", icon: GraduationCap, group: "Profile" },
  { href: "/admin/skills", label: "Skills", icon: Award, group: "Profile" },
  { href: "/admin/profile", label: "Profile", icon: User, group: "Profile" },
  { href: "/admin/messages", label: "Messages", icon: Mail, group: "Inbox" },
  { href: "/admin/media", label: "Media", icon: ImageIcon, group: "Assets" },
  { href: "/admin/seo", label: "SEO", icon: Search, group: "System" },
  { href: "/admin/settings", label: "Settings", icon: Settings, group: "System" },
  { href: "/admin/users", label: "Users", icon: Users, group: "System" },
];

const groupOrder = ["Overview", "Content", "Profile", "Inbox", "Assets", "System"];

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("admin.sidebar.collapsed") === "1";
  });
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("admin.sidebar.collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleSignOut = async () => { await signOut(); navigate("/admin"); };

  const grouped = useMemo(() => {
    const out: Record<string, NavItem[]> = {};
    for (const item of navItems) {
      (out[item.group] ||= []).push(item);
    }
    return out;
  }, []);

  const currentTitle = navItems.find((n) => location.pathname.startsWith(n.href))?.label || "Admin";

  const runCommand = (href: string) => { setPaletteOpen(false); navigate(href); };

  const sidebarWidth = collapsed ? "lg:w-[76px]" : "lg:w-[264px]";

  return (
    <div className="admin-container flex">
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`admin-sidebar fixed lg:sticky top-0 inset-y-0 left-0 z-50 h-screen w-[264px] ${sidebarWidth} transform transition-all duration-300 lg:transform-none ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="h-full flex flex-col">
          {/* Brand */}
          <div className="h-16 flex items-center justify-between px-4 border-b" style={{ borderColor: "hsl(var(--admin-border))" }}>
            <Link to="/" className={`flex items-center gap-2 font-display font-bold tracking-tight ${collapsed ? "lg:justify-center lg:w-full" : ""}`} style={{ color: "hsl(var(--admin-fg))" }}>
              <span className="grid place-items-center w-9 h-9 rounded-xl text-white" style={{ background: "hsl(var(--admin-accent))" }}>
                <Sparkles size={16} />
              </span>
              {!collapsed && <span className="text-base">Studio Admin</span>}
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-black/5"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Search trigger */}
          <div className="p-3">
            <button
              onClick={() => setPaletteOpen(true)}
              className={`w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all ${collapsed ? "lg:justify-center lg:px-0" : ""}`}
              style={{ background: "hsl(var(--admin-muted))", border: "1px solid hsl(var(--admin-border))", color: "hsl(var(--admin-muted-fg))" }}
            >
              <Search size={15} />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">Quick search…</span>
                  <span className="admin-kbd">⌘K</span>
                </>
              )}
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 pb-3 overflow-y-auto space-y-5">
            {groupOrder.map((g) => (
              grouped[g] ? (
                <div key={g}>
                  {!collapsed && (
                    <div className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: "hsl(var(--admin-muted-fg))" }}>{g}</div>
                  )}
                  <div className="space-y-1">
                    {grouped[g].map((item) => {
                      const active = location.pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          title={collapsed ? item.label : undefined}
                          className={`admin-nav-item ${active ? "active" : ""} ${collapsed ? "lg:justify-center lg:px-0" : ""}`}
                        >
                          <item.icon size={17} className="shrink-0" />
                          {!collapsed && <span className="truncate">{item.label}</span>}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : null
            ))}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t" style={{ borderColor: "hsl(var(--admin-border))" }}>
            {!collapsed && (
              <div className="mb-2 px-2 text-xs truncate" style={{ color: "hsl(var(--admin-muted-fg))" }}>
                {user?.email}
              </div>
            )}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSignOut}
                className={`admin-nav-item flex-1 ${collapsed ? "lg:justify-center lg:px-0" : ""}`}
                title="Sign out"
              >
                <LogOut size={17} />
                {!collapsed && <span>Sign Out</span>}
              </button>
              <button
                onClick={() => setCollapsed((v) => !v)}
                className="hidden lg:grid place-items-center w-10 h-10 rounded-xl hover:bg-black/5"
                style={{ border: "1px solid hsl(var(--admin-border))", color: "hsl(var(--admin-muted-fg))" }}
                title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 min-h-screen flex flex-col">
        <header
          className="sticky top-0 z-30 h-16 flex items-center gap-3 px-4 lg:px-8 border-b"
          style={{
            background: "var(--admin-glass)",
            backdropFilter: "saturate(180%) blur(14px)",
            WebkitBackdropFilter: "saturate(180%) blur(14px)",
            borderColor: "hsl(var(--admin-border))",
          }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-black/5"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "hsl(var(--admin-muted-fg))" }}>Admin Studio</div>
            <h1 className="font-display font-bold text-base leading-tight truncate" style={{ color: "hsl(var(--admin-fg))" }}>{currentTitle}</h1>
          </div>
          <button
            onClick={() => setPaletteOpen(true)}
            className="hidden md:inline-flex admin-btn-outline"
            title="Command palette (⌘K)"
          >
            <CommandIcon size={15} /> <span>Command</span> <span className="admin-kbd">⌘K</span>
          </button>
          <a href="/" target="_blank" rel="noreferrer" className="admin-btn-outline hidden sm:inline-flex" title="View live site">
            <ExternalLink size={15} /> <span className="hidden md:inline">View Site</span>
          </a>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-10">
          <div className="max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      <CommandDialog open={paletteOpen} onOpenChange={setPaletteOpen}>
        <CommandInput placeholder="Jump to any section…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {groupOrder.map((g, idx) =>
            grouped[g] ? (
              <div key={g}>
                {idx > 0 && <CommandSeparator />}
                <CommandGroup heading={g}>
                  {grouped[g].map((item) => (
                    <CommandItem
                      key={item.href}
                      value={`${item.label} ${item.group}`}
                      onSelect={() => runCommand(item.href)}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </div>
            ) : null
          )}
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem value="sign out logout" onSelect={() => { setPaletteOpen(false); handleSignOut(); }}>
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </CommandItem>
            <CommandItem value="view live site" onSelect={() => { setPaletteOpen(false); window.open("/", "_blank"); }}>
              <ExternalLink className="mr-2 h-4 w-4" /> View Live Site
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
