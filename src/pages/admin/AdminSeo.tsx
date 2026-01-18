import { useAllPageSeo, useUpdatePageSeo } from "@/hooks/usePortfolioData";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Edit, Save, X } from "lucide-react";

export default function AdminSeo() {
  const { data: pages, isLoading } = useAllPageSeo();
  const updateSeo = useUpdatePageSeo();
  const { toast } = useToast();
  const [editing, setEditing] = useState<any>(null);

  const handleSave = async () => {
    try { await updateSeo.mutateAsync(editing); toast({ title: "SEO updated!" }); setEditing(null); } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold" style={{ color: "hsl(var(--admin-fg))" }}>SEO Settings</h1>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="admin-card p-6 w-full max-w-xl" style={{ background: "hsl(var(--admin-bg))" }}>
            <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-semibold">Edit SEO: {editing.page_name}</h2><button onClick={() => setEditing(null)}><X size={20} /></button></div>
            <div className="space-y-4">
              <div><label className="admin-label">SEO Title</label><input type="text" value={editing.seo_title || ""} onChange={(e) => setEditing({ ...editing, seo_title: e.target.value })} className="admin-input" /></div>
              <div><label className="admin-label">SEO Description</label><textarea rows={3} value={editing.seo_description || ""} onChange={(e) => setEditing({ ...editing, seo_description: e.target.value })} className="admin-input" /></div>
              <div><label className="admin-label">OG Image URL</label><input type="url" value={editing.og_image || ""} onChange={(e) => setEditing({ ...editing, og_image: e.target.value })} className="admin-input" /></div>
              <div><label className="admin-label">Keywords (comma separated)</label><input type="text" value={(editing.seo_keywords || []).join(", ")} onChange={(e) => setEditing({ ...editing, seo_keywords: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) })} className="admin-input" /></div>
              <div className="flex gap-3 pt-4"><button onClick={handleSave} className="admin-btn"><Save size={16} /> Save</button><button onClick={() => setEditing(null)} className="admin-btn-outline">Cancel</button></div>
            </div>
          </div>
        </div>
      )}

      <div className="admin-card overflow-hidden">
        <table className="admin-table">
          <thead><tr><th>Page</th><th>SEO Title</th><th>Description</th><th>Actions</th></tr></thead>
          <tbody>
            {pages?.map((p: any) => (
              <tr key={p.id}>
                <td className="font-medium">{p.page_name}</td>
                <td className="max-w-xs truncate">{p.seo_title || "-"}</td>
                <td className="max-w-xs truncate">{p.seo_description || "-"}</td>
                <td><button onClick={() => setEditing(p)} className="p-1 hover:bg-gray-100 rounded"><Edit size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}