import { useState, useCallback } from "react";
import { useAllPageSeo, useUpdatePageSeo } from "@/hooks/usePortfolioData";
import { useToast } from "@/hooks/use-toast";
import { Edit, Save, X, Search, Globe } from "lucide-react";

export default function AdminSeo() {
  const { data: pages, isLoading, error } = useAllPageSeo();
  const updateSeo = useUpdatePageSeo();
  const { toast } = useToast();
  const [editing, setEditing] = useState<any>(null);

  const handleFieldChange = useCallback((field: string, value: any) => {
    setEditing((prev: any) => prev ? { ...prev, [field]: value } : null);
  }, []);

  const handleSave = async () => {
    if (!editing) return;
    
    try {
      await updateSeo.mutateAsync(editing);
      toast({ title: "SEO settings updated successfully!" });
      setEditing(null);
    } catch (error: any) {
      console.error("Save error:", error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const startEdit = (page: any) => {
    setEditing({
      ...page,
      seo_keywords: page.seo_keywords || []
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-current border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20" style={{ color: "hsl(var(--admin-muted-fg))" }}>
        <p>Error loading SEO settings. Please refresh the page.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold" style={{ color: "hsl(var(--admin-fg))" }}>SEO Settings</h1>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => { if (e.target === e.currentTarget) setEditing(null); }}>
          <div className="admin-card p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto" style={{ background: "hsl(var(--admin-bg))" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold" style={{ color: "hsl(var(--admin-fg))" }}>
                Edit SEO: {editing.page_name}
              </h2>
              <button onClick={() => setEditing(null)} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="admin-label">SEO Title</label>
                <input
                  type="text"
                  value={editing.seo_title || ""}
                  onChange={(e) => handleFieldChange("seo_title", e.target.value)}
                  className="admin-input"
                  placeholder="Page title for search engines (max 60 chars)"
                  maxLength={60}
                />
                <p className="text-xs mt-1" style={{ color: "hsl(var(--admin-muted-fg))" }}>
                  {(editing.seo_title || "").length}/60 characters
                </p>
              </div>
              
              <div>
                <label className="admin-label">SEO Description</label>
                <textarea
                  rows={3}
                  value={editing.seo_description || ""}
                  onChange={(e) => handleFieldChange("seo_description", e.target.value)}
                  className="admin-input resize-none"
                  placeholder="Brief description for search engines (max 160 chars)"
                  maxLength={160}
                />
                <p className="text-xs mt-1" style={{ color: "hsl(var(--admin-muted-fg))" }}>
                  {(editing.seo_description || "").length}/160 characters
                </p>
              </div>
              
              <div>
                <label className="admin-label">OG Image URL</label>
                <input
                  type="url"
                  value={editing.og_image || ""}
                  onChange={(e) => handleFieldChange("og_image", e.target.value)}
                  className="admin-input"
                  placeholder="https://example.com/og-image.jpg"
                />
                <p className="text-xs mt-1" style={{ color: "hsl(var(--admin-muted-fg))" }}>
                  Recommended size: 1200x630 pixels
                </p>
              </div>
              
              <div>
                <label className="admin-label">Keywords (comma separated)</label>
                <input
                  type="text"
                  value={Array.isArray(editing.seo_keywords) ? editing.seo_keywords.join(", ") : ""}
                  onChange={(e) => handleFieldChange("seo_keywords", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))}
                  className="admin-input"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
              
              <div className="flex gap-3 pt-4 border-t" style={{ borderColor: "hsl(var(--admin-border))" }}>
                <button 
                  onClick={handleSave} 
                  disabled={updateSeo.isPending}
                  className="admin-btn"
                >
                  <Save size={16} /> 
                  {updateSeo.isPending ? "Saving..." : "Save SEO Settings"}
                </button>
                <button onClick={() => setEditing(null)} className="admin-btn-outline">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {pages && pages.length > 0 ? (
        <div className="admin-card overflow-hidden">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Page</th>
                <th>SEO Title</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((p: any) => (
                <tr key={p.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <Globe size={16} style={{ color: "hsl(var(--admin-muted-fg))" }} />
                      <span className="font-medium">{p.page_name}</span>
                    </div>
                    <span className="text-xs" style={{ color: "hsl(var(--admin-muted-fg))" }}>/{p.page_slug}</span>
                  </td>
                  <td className="max-w-xs">
                    <span className="truncate block">{p.seo_title || <span style={{ color: "hsl(var(--admin-muted-fg))" }}>Not set</span>}</span>
                  </td>
                  <td className="max-w-xs">
                    <span className="truncate block text-sm" style={{ color: "hsl(var(--admin-muted-fg))" }}>
                      {p.seo_description || "Not set"}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => startEdit(p)} className="p-1 hover:bg-gray-100 rounded" title="Edit">
                      <Edit size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-card p-12 text-center">
          <Search size={48} className="mx-auto mb-4" style={{ color: "hsl(var(--admin-muted-fg))" }} />
          <p style={{ color: "hsl(var(--admin-muted-fg))" }}>No pages found.</p>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--admin-muted-fg))" }}>SEO data will appear here once pages are configured.</p>
        </div>
      )}
    </div>
  );
}
