import { useAllProjects, useAllServices, useAllPosts, useContactMessages, useAllExperiences, useAllSkills, useAllTestimonials } from "@/hooks/usePortfolioData";
import { FolderOpen, Briefcase, FileText, Mail, GraduationCap, Award, MessageSquare } from "lucide-react";

export default function AdminDashboard() {
  const { data: projects } = useAllProjects();
  const { data: services } = useAllServices();
  const { data: posts } = useAllPosts();
  const { data: messages } = useContactMessages();
  const { data: experiences } = useAllExperiences();
  const { data: skills } = useAllSkills();
  const { data: testimonials } = useAllTestimonials();

  const unreadMessages = messages?.filter((m: any) => !m.is_read).length || 0;

  const stats = [
    { label: "Projects", value: projects?.length || 0, icon: FolderOpen },
    { label: "Services", value: services?.length || 0, icon: Briefcase },
    { label: "Blog Posts", value: posts?.length || 0, icon: FileText },
    { label: "Messages", value: messages?.length || 0, badge: unreadMessages, icon: Mail },
    { label: "Experience", value: experiences?.length || 0, icon: GraduationCap },
    { label: "Skills", value: skills?.length || 0, icon: Award },
    { label: "Testimonials", value: testimonials?.length || 0, icon: MessageSquare },
  ];

  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-8" style={{ color: "hsl(var(--admin-fg))" }}>Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="admin-card p-6">
            <div className="flex items-center justify-between mb-4">
              <stat.icon size={24} style={{ color: "hsl(var(--admin-muted-fg))" }} />
              {stat.badge ? <span className="px-2 py-0.5 text-xs rounded-full" style={{ background: "hsl(var(--admin-accent))", color: "hsl(var(--admin-accent-fg))" }}>{stat.badge} new</span> : null}
            </div>
            <div className="text-3xl font-bold mb-1" style={{ color: "hsl(var(--admin-fg))" }}>{stat.value}</div>
            <div className="text-sm" style={{ color: "hsl(var(--admin-muted-fg))" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-12 admin-card p-6">
        <h2 className="text-lg font-semibold mb-4" style={{ color: "hsl(var(--admin-fg))" }}>Recent Messages</h2>
        {messages && messages.length > 0 ? (
          <div className="space-y-4">
            {messages.slice(0, 5).map((msg: any) => (
              <div key={msg.id} className="flex items-start gap-4 pb-4 border-b" style={{ borderColor: "hsl(var(--admin-border))" }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium" style={{ background: "hsl(var(--admin-muted))" }}>{msg.name.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium" style={{ color: "hsl(var(--admin-fg))" }}>{msg.name}</span>
                    {!msg.is_read && <span className="w-2 h-2 rounded-full" style={{ background: "hsl(var(--admin-accent))" }} />}
                  </div>
                  <p className="text-sm truncate" style={{ color: "hsl(var(--admin-muted-fg))" }}>{msg.message}</p>
                </div>
                <span className="text-xs" style={{ color: "hsl(var(--admin-muted-fg))" }}>{new Date(msg.received_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        ) : <p style={{ color: "hsl(var(--admin-muted-fg))" }}>No messages yet.</p>}
      </div>
    </div>
  );
}