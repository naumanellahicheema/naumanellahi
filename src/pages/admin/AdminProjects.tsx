import { useState } from "react";
import { useAllProjects, useCreateProject, useUpdateProject, useDeleteProject } from "@/hooks/usePortfolioData";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save, X, ExternalLink } from "lucide-react";

export default function AdminProjects() {
  const { data: projects, isLoading } = useAllProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const { toast } = useToast();
  const [editing, setEditing] = useState<any>(null);
  const [isNew, setIsNew] = useState(false);

  const handleSave = async () => {
    try {
      if (isNew) { await createProject.mutateAsync(editing); toast({ title: "Project created!" }); }
      else { await updateProject.mutateAsync(editing); toast({ title: "Project updated!" }); }
      setEditing(null); setIsNew(false);
    } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try { await deleteProject.mutateAsync(id); toast({ title: "Project deleted!" }); } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  const startNew = () => { setEditing({ title: "", slug: "", description: "", short_description: "", industry: "", country: "", website_url: "", tech_stack: [], services_provided: [], featured: false, published: true, display_order: 0 }); setIsNew(true); };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold" style={{ color: "hsl(var(--admin-fg))" }}>Projects</h1>
        <button onClick={startNew} className="admin-btn"><Plus size={16} /> Add Project</button>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="admin-card p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={{ background: "hsl(var(--admin-bg))" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">{isNew ? "New Project" : "Edit Project"}</h2>
              <button onClick={() => { setEditing(null); setIsNew(false); }}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="admin-label">Title</label><input type="text" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="admin-input" /></div>
                <div><label className="admin-label">Slug</label><input type="text" value={editing.slug || ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="admin-input" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="admin-label">Industry</label><input type="text" value={editing.industry || ""} onChange={(e) => setEditing({ ...editing, industry: e.target.value })} className="admin-input" /></div>
                <div><label className="admin-label">Country</label><input type="text" value={editing.country || ""} onChange={(e) => setEditing({ ...editing, country: e.target.value })} className="admin-input" /></div>
              </div>
              <div><label className="admin-label">Short Description</label><input type="text" value={editing.short_description || ""} onChange={(e) => setEditing({ ...editing, short_description: e.target.value })} className="admin-input" /></div>
              <div><label className="admin-label">Description</label><textarea rows={4} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="admin-input" /></div>
              <div><label className="admin-label">Website URL</label><input type="url" value={editing.website_url || ""} onChange={(e) => setEditing({ ...editing, website_url: e.target.value })} className="admin-input" /></div>
              <div><label className="admin-label">Thumbnail URL</label><input type="url" value={editing.thumbnail_url || ""} onChange={(e) => setEditing({ ...editing, thumbnail_url: e.target.value })} className="admin-input" /></div>
              <div><label className="admin-label">Tech Stack (comma separated)</label><input type="text" value={(editing.tech_stack || []).join(", ")} onChange={(e) => setEditing({ ...editing, tech_stack: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) })} className="admin-input" /></div>
              <div><label className="admin-label">Services Provided (comma separated)</label><input type="text" value={(editing.services_provided || []).join(", ")} onChange={(e) => setEditing({ ...editing, services_provided: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) })} className="admin-input" /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="admin-label">Order</label><input type="number" value={editing.display_order || 0} onChange={(e) => setEditing({ ...editing, display_order: parseInt(e.target.value) })} className="admin-input" /></div>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} /> Featured</label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} /> Published</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={handleSave} className="admin-btn"><Save size={16} /> Save</button>
                <button onClick={() => { setEditing(null); setIsNew(false); }} className="admin-btn-outline">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="admin-card overflow-hidden">
        <table className="admin-table">
          <thead><tr><th>Title</th><th>Industry</th><th>Country</th><th>Featured</th><th>Published</th><th>Actions</th></tr></thead>
          <tbody>
            {projects?.map((p: any) => (
              <tr key={p.id}>
                <td className="font-medium">{p.title}</td>
                <td>{p.industry}</td>
                <td>{p.country}</td>
                <td>{p.featured ? "Yes" : "No"}</td>
                <td>{p.published ? "Yes" : "No"}</td>
                <td>
                  <div className="flex items-center gap-2">
                    {p.website_url && <a href={p.website_url} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-gray-100 rounded"><ExternalLink size={16} /></a>}
                    <button onClick={() => setEditing(p)} className="p-1 hover:bg-gray-100 rounded"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-1 hover:bg-gray-100 rounded text-red-500"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}