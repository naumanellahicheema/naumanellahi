import { useState, useCallback } from "react";
import { useAllPageSeo, useUpdatePageSeo, useAllProjects, useAllServices, useAllPosts } from "@/hooks/usePortfolioData";
import { useToast } from "@/hooks/use-toast";
import { Edit, Save, X, Globe, Sparkles, Loader2, ExternalLink, FileText, Code, Map } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function AdminSeo() {
  const { data: pages, isLoading, error } = useAllPageSeo();
  const { data: projects } = useAllProjects();
  const { data: services } = useAllServices();
  const { data: posts } = useAllPosts();
  const updateSeo = useUpdatePageSeo();
  const { toast } = useToast();
  const [editing, setEditing] = useState<any>(null);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"pages" | "schema" | "sitemap">("pages");

  const handleFieldChange = useCallback((field: string, value: any) => {
    setEditing((prev: any) => prev ? { ...prev, [field]: value } : null);
  }, []);

  const handleSave = async () => {
    if (!editing) return;
    try {
      await updateSeo.mutateAsync(editing);
      toast({ title: "SEO settings updated!" });
      setEditing(null);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const startEdit = (page: any) => {
    setEditing({ ...page, seo_keywords: page.seo_keywords || [] });
  };

  const handleGenerateAll = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-seo", {
        body: { type: "all" },
      });
      if (error) throw error;
      toast({ title: `SEO generated for ${data.results?.length || 0} items!` });
      // Refetch
      window.location.reload();
    } catch (error: any) {
      console.error(error);
      toast({ title: "Error", description: error.message || "Failed to generate SEO", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const siteUrl = "https://naumanellahi.lovable.app";

  const generateSchemaMarkup = () => {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Nauman Ellahi",
      "jobTitle": "WordPress & Frontend Developer",
      "url": siteUrl,
      "sameAs": [],
      "knowsAbout": services?.map((s: any) => s.title) || [],
      "hasOccupation": {
        "@type": "Occupation",
        "name": "Web Developer"
      }
    }, null, 2);
  };

  const generateSitemap = () => {
    const urls = [
      { loc: "/", priority: "1.0" },
      { loc: "/about", priority: "0.8" },
      { loc: "/portfolio", priority: "0.9" },
      { loc: "/services", priority: "0.8" },
      { loc: "/experience", priority: "0.7" },
      { loc: "/testimonials", priority: "0.6" },
      { loc: "/blog", priority: "0.8" },
      { loc: "/contact", priority: "0.7" },
    ];
    if (projects) {
      projects.forEach((p: any) => {
        if (p.slug && p.published) urls.push({ loc: `/portfolio/${p.slug}`, priority: "0.7" });
      });
    }
    if (posts) {
      posts.forEach((p: any) => {
        if (p.slug && p.published) urls.push({ loc: `/blog/${p.slug}`, priority: "0.6" });
      });
    }
    return urls;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20" style={{ color: "hsl(var(--admin-muted-fg))" }}>
        <p>Error loading SEO settings.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="text-2xl font-display font-bold" style={{ color: "hsl(var(--admin-fg))" }}>SEO Management</h1>
        <button onClick={handleGenerateAll} disabled={generating} className="admin-btn">
          {generating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {generating ? "Generating..." : "Auto-Generate All SEO"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b-2 pb-0" style={{ borderColor: "hsl(var(--admin-border))" }}>
        {[
          { id: "pages" as const, label: "Page SEO", icon: Globe },
          { id: "schema" as const, label: "Schema Markup", icon: Code },
          { id: "sitemap" as const, label: "Sitemap", icon: Map },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-[2px] transition-colors ${
              activeTab === tab.id
                ? "border-current"
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
            style={{ color: "hsl(var(--admin-fg))" }}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => { if (e.target === e.currentTarget) setEditing(null); }}>
          <div className="admin-card p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto" style={{ background: "hsl(var(--admin-bg))" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold" style={{ color: "hsl(var(--admin-fg))" }}>Edit SEO: {editing.page_name}</h2>
              <button onClick={() => setEditing(null)} className="p-1 rounded" style={{ color: "hsl(var(--admin-muted-fg))" }}><X size={20} /></button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="admin-label">SEO Title</label>
                <input type="text" value={editing.seo_title || ""} onChange={(e) => handleFieldChange("seo_title", e.target.value)} className="admin-input" placeholder="Page title (max 60 chars)" maxLength={60} />
                <p className="text-xs mt-1" style={{ color: "hsl(var(--admin-muted-fg))" }}>{(editing.seo_title || "").length}/60</p>
              </div>
              <div>
                <label className="admin-label">SEO Description</label>
                <textarea rows={3} value={editing.seo_description || ""} onChange={(e) => handleFieldChange("seo_description", e.target.value)} className="admin-input resize-none" placeholder="Description (max 160 chars)" maxLength={160} />
                <p className="text-xs mt-1" style={{ color: "hsl(var(--admin-muted-fg))" }}>{(editing.seo_description || "").length}/160</p>
              </div>
              <div>
                <label className="admin-label">OG Image URL</label>
                <input type="url" value={editing.og_image || ""} onChange={(e) => handleFieldChange("og_image", e.target.value)} className="admin-input" placeholder="https://example.com/og-image.jpg" />
              </div>
              <div>
                <label className="admin-label">Keywords (comma separated)</label>
                <input type="text" value={Array.isArray(editing.seo_keywords) ? editing.seo_keywords.join(", ") : ""} onChange={(e) => handleFieldChange("seo_keywords", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))} className="admin-input" />
              </div>
              <div className="flex gap-3 pt-4 border-t" style={{ borderColor: "hsl(var(--admin-border))" }}>
                <button onClick={handleSave} disabled={updateSeo.isPending} className="admin-btn">
                  <Save size={16} /> {updateSeo.isPending ? "Saving..." : "Save"}
                </button>
                <button onClick={() => setEditing(null)} className="admin-btn-outline">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pages Tab - Cards */}
      {activeTab === "pages" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages?.map((p: any) => (
            <div key={p.id} className="admin-card-bordered p-5 hover:border-gray-400 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Globe size={18} style={{ color: "hsl(var(--admin-muted-fg))" }} />
                  <span className="font-semibold" style={{ color: "hsl(var(--admin-fg))" }}>{p.page_name}</span>
                </div>
                <button onClick={() => startEdit(p)} className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "hsl(var(--admin-muted-fg))" }}>
                  <Edit size={16} />
                </button>
              </div>
              <p className="text-xs mb-2" style={{ color: "hsl(var(--admin-muted-fg))" }}>/{p.page_slug}</p>
              <div className="space-y-2">
                <div>
                  <span className="text-xs font-medium" style={{ color: "hsl(var(--admin-muted-fg))" }}>Title:</span>
                  <p className="text-sm truncate" style={{ color: p.seo_title ? "hsl(var(--admin-fg))" : "hsl(var(--admin-muted-fg))" }}>
                    {p.seo_title || "Not set"}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium" style={{ color: "hsl(var(--admin-muted-fg))" }}>Description:</span>
                  <p className="text-xs line-clamp-2" style={{ color: "hsl(var(--admin-muted-fg))" }}>
                    {p.seo_description || "Not set"}
                  </p>
                </div>
                {p.seo_keywords?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {p.seo_keywords.slice(0, 3).map((k: string, i: number) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "hsl(var(--admin-muted))", color: "hsl(var(--admin-muted-fg))" }}>{k}</span>
                    ))}
                    {p.seo_keywords.length > 3 && <span className="text-xs" style={{ color: "hsl(var(--admin-muted-fg))" }}>+{p.seo_keywords.length - 3}</span>}
                  </div>
                )}
              </div>
              {/* SEO Score indicator */}
              <div className="mt-3 pt-3 border-t" style={{ borderColor: "hsl(var(--admin-border))" }}>
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: "hsl(var(--admin-muted-fg))" }}>Completeness</span>
                  <span style={{ color: p.seo_title && p.seo_description ? "hsl(142 76% 36%)" : "hsl(0 72% 51%)" }}>
                    {[p.seo_title, p.seo_description, p.og_image, p.seo_keywords?.length].filter(Boolean).length}/4
                  </span>
                </div>
                <div className="h-1.5 rounded-full mt-1.5" style={{ background: "hsl(var(--admin-muted))" }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${([p.seo_title, p.seo_description, p.og_image, p.seo_keywords?.length].filter(Boolean).length / 4) * 100}%`,
                      background: [p.seo_title, p.seo_description, p.og_image, p.seo_keywords?.length].filter(Boolean).length >= 3 ? "hsl(142 76% 36%)" : "hsl(40 90% 50%)",
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schema Tab */}
      {activeTab === "schema" && (
        <div className="space-y-6">
          <div className="admin-card-bordered p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: "hsl(var(--admin-fg))" }}>JSON-LD Schema Markup</h3>
              <button
                onClick={() => { navigator.clipboard.writeText(generateSchemaMarkup()); toast({ title: "Schema copied!" }); }}
                className="admin-btn-outline text-xs"
              >
                Copy to Clipboard
              </button>
            </div>
            <p className="text-sm mb-4" style={{ color: "hsl(var(--admin-muted-fg))" }}>
              This structured data helps search engines understand your website. It's automatically generated based on your profile and services.
            </p>
            <pre className="p-4 rounded-lg text-xs overflow-x-auto" style={{ background: "hsl(var(--admin-muted))", color: "hsl(var(--admin-fg))" }}>
              {generateSchemaMarkup()}
            </pre>
          </div>

          <div className="admin-card-bordered p-6">
            <h3 className="text-lg font-semibold mb-3" style={{ color: "hsl(var(--admin-fg))" }}>Schema Types</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { type: "Person", status: "Active", desc: "Your professional identity" },
                { type: "WebSite", status: "Active", desc: "Site-level metadata" },
                { type: "Organization", status: "Optional", desc: "Business entity data" },
              ].map((schema) => (
                <div key={schema.type} className="p-4 rounded-lg" style={{ background: "hsl(var(--admin-muted))" }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm" style={{ color: "hsl(var(--admin-fg))" }}>{schema.type}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${schema.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {schema.status}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: "hsl(var(--admin-muted-fg))" }}>{schema.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sitemap Tab */}
      {activeTab === "sitemap" && (
        <div className="space-y-6">
          <div className="admin-card-bordered p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: "hsl(var(--admin-fg))" }}>Sitemap URLs</h3>
              <a href={`${siteUrl}/sitemap.xml`} target="_blank" rel="noopener noreferrer" className="admin-btn-outline text-xs">
                <ExternalLink size={14} /> View Sitemap
              </a>
            </div>
            <p className="text-sm mb-4" style={{ color: "hsl(var(--admin-muted-fg))" }}>
              Your sitemap includes all public pages, portfolio projects, and blog posts. It helps search engines discover and index your content.
            </p>
            <div className="space-y-2">
              {generateSitemap().map((url, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg" style={{ background: "hsl(var(--admin-muted))" }}>
                  <div className="flex items-center gap-2">
                    <FileText size={14} style={{ color: "hsl(var(--admin-muted-fg))" }} />
                    <span className="text-sm font-mono" style={{ color: "hsl(var(--admin-fg))" }}>{siteUrl}{url.loc}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: "hsl(var(--admin-border))", color: "hsl(var(--admin-muted-fg))" }}>
                    Priority: {url.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-card-bordered p-6">
            <h3 className="text-lg font-semibold mb-3" style={{ color: "hsl(var(--admin-fg))" }}>robots.txt</h3>
            <pre className="p-4 rounded-lg text-xs" style={{ background: "hsl(var(--admin-muted))", color: "hsl(var(--admin-fg))" }}>
{`User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
