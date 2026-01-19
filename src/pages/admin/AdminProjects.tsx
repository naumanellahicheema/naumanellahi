import { useState, useCallback } from "react";
import { useAllProjects, useCreateProject, useUpdateProject, useDeleteProject } from "@/hooks/usePortfolioData";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save, X, ExternalLink, Eye, EyeOff, Star, Globe } from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { TagInput } from "@/components/ui/TagInput";

const emptyProject = {
  title: "", slug: "", description: "", short_description: "", industry: "", country: "",
  website_url: "", thumbnail_url: "", tech_stack: [] as string[], services_provided: [] as string[],
  images: [] as string[], featured: false, published: true, display_order: 0, status: "active"
};

export default function AdminProjects() {
  const { data: projects, isLoading } = useAllProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const { toast } = useToast();
  const [editing, setEditing] = useState<any>(null);
  const [isNew, setIsNew] = useState(false);

  const handleFieldChange = useCallback((field: string, value: any) => {
    setEditing((prev: any) => prev ? { ...prev, [field]: value } : null);
  }, []);

  const handleSave = async () => {
    if (!editing) return;
    try {
      const projectData = { ...editing };
      if (!projectData.slug && projectData.title) {
        projectData.slug = projectData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      }
      if (isNew) {
        const { id, created_at, updated_at, ...data } = projectData;
        await createProject.mutateAsync(data);
        toast({ title: "Project created successfully!" });
      } else {
        await updateProject.mutateAsync(projectData);
        toast({ title: "Project updated successfully!" });
      }
      setEditing(null);
      setIsNew(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try { await deleteProject.mutateAsync(id); toast({ title: "Project deleted!" }); }
    catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  const togglePublished = async (p: any) => {
    try { await updateProject.mutateAsync({ ...p, published: !p.published }); toast({ title: p.published ? "Hidden" : "Published" }); }
    catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  const toggleFeatured = async (p: any) => {
    try { await updateProject.mutateAsync({ ...p, featured: !p.featured }); toast({ title: p.featured ? "Unfeatured" : "Featured" }); }
    catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  if (isLoading) return <div className="flex items-center justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-current border-t-transparent rounded-full" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold" style={{ color: "hsl(var(--admin-fg))" }}>Projects</h1>
        <button onClick={() => { setEditing({ ...emptyProject }); setIsNew(true); }} className="admin-btn-bordered"><Plus size={16} /> Add Project</button>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => { if (e.target === e.currentTarget) { setEditing(null); setIsNew(false); } }}>
          <div className="p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl" style={{ background: "hsl(var(--admin-bg))", border: "2px solid hsl(0 0% 0%)" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold" style={{ color: "hsl(var(--admin-fg))" }}>{isNew ? "New Project" : "Edit Project"}</h2>
              <button onClick={() => { setEditing(null); setIsNew(false); }} className="p-2 rounded-lg hover:bg-gray-100" style={{ border: "1px solid hsl(var(--admin-border))" }}><X size={20} /></button>
            </div>
            <div className="space-y-6">
              <div><label className="admin-label">Thumbnail</label><ImageUpload value={editing.thumbnail_url} onChange={(url) => handleFieldChange("thumbnail_url", url)} onRemove={() => handleFieldChange("thumbnail_url", "")} folder="projects" /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="admin-label">Title *</label><input type="text" value={editing.title || ""} onChange={(e) => handleFieldChange("title", e.target.value)} className="admin-input-bordered" placeholder="Project title" /></div>
                <div><label className="admin-label">Slug</label><input type="text" value={editing.slug || ""} onChange={(e) => handleFieldChange("slug", e.target.value)} className="admin-input-bordered" placeholder="auto-generated" /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="admin-label">Industry</label><input type="text" value={editing.industry || ""} onChange={(e) => handleFieldChange("industry", e.target.value)} className="admin-input-bordered" /></div>
                <div><label className="admin-label">Country</label><input type="text" value={editing.country || ""} onChange={(e) => handleFieldChange("country", e.target.value)} className="admin-input-bordered" /></div>
              </div>
              <div><label className="admin-label">Short Description</label><input type="text" value={editing.short_description || ""} onChange={(e) => handleFieldChange("short_description", e.target.value)} className="admin-input-bordered" maxLength={200} /></div>
              <div><label className="admin-label">Full Description</label><textarea rows={4} value={editing.description || ""} onChange={(e) => handleFieldChange("description", e.target.value)} className="admin-input-bordered resize-none" /></div>
              <div><label className="admin-label">Website URL</label><input type="url" value={editing.website_url || ""} onChange={(e) => handleFieldChange("website_url", e.target.value)} className="admin-input-bordered" /></div>
              <div><label className="admin-label">Tech Stack</label><TagInput value={editing.tech_stack || []} onChange={(tags) => handleFieldChange("tech_stack", tags)} placeholder="Add technologies" /></div>
              <div><label className="admin-label">Services</label><TagInput value={editing.services_provided || []} onChange={(tags) => handleFieldChange("services_provided", tags)} placeholder="Add services" /></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                <div><label className="admin-label">Order</label><input type="number" value={editing.display_order || 0} onChange={(e) => handleFieldChange("display_order", parseInt(e.target.value) || 0)} className="admin-input-bordered" /></div>
                <div><label className="admin-label">Status</label><select value={editing.status || "active"} onChange={(e) => handleFieldChange("status", e.target.value)} className="admin-input-bordered"><option value="active">Active</option><option value="completed">Completed</option></select></div>
                <label className="flex items-center gap-2 pt-6"><input type="checkbox" checked={editing.featured || false} onChange={(e) => handleFieldChange("featured", e.target.checked)} className="w-4 h-4" /><span className="text-sm">Featured</span></label>
                <label className="flex items-center gap-2 pt-6"><input type="checkbox" checked={editing.published !== false} onChange={(e) => handleFieldChange("published", e.target.checked)} className="w-4 h-4" /><span className="text-sm">Published</span></label>
              </div>
              <div className="flex gap-3 pt-4 border-t-2" style={{ borderColor: "hsl(var(--admin-border))" }}>
                <button onClick={handleSave} disabled={createProject.isPending || updateProject.isPending} className="admin-btn-bordered"><Save size={16} /> {createProject.isPending || updateProject.isPending ? "Saving..." : "Save"}</button>
                <button onClick={() => { setEditing(null); setIsNew(false); }} className="admin-btn-outline">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p: any) => (
            <div key={p.id} className="admin-card-bordered overflow-hidden">
              <div className="aspect-video bg-gray-100 relative" style={{ borderBottom: "2px solid hsl(var(--admin-border))" }}>
                {p.thumbnail_url ? <img src={p.thumbnail_url} alt={p.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Globe size={48} style={{ color: "hsl(var(--admin-muted-fg))" }} /></div>}
                <div className="absolute top-3 left-3 flex gap-2">
                  {p.featured && <span className="px-2 py-1 text-xs font-medium bg-yellow-400 text-yellow-900 rounded-full flex items-center gap-1"><Star size={12} /> Featured</span>}
                  {!p.published && <span className="px-2 py-1 text-xs font-medium bg-gray-800 text-white rounded-full">Hidden</span>}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1" style={{ color: "hsl(var(--admin-fg))" }}>{p.title}</h3>
                <div className="text-xs mb-2" style={{ color: "hsl(var(--admin-muted-fg))" }}>{p.industry} {p.country && `• ${p.country}`}</div>
                {p.short_description && <p className="text-sm line-clamp-2 mb-4" style={{ color: "hsl(var(--admin-muted-fg))" }}>{p.short_description}</p>}
                {p.tech_stack?.length > 0 && <div className="flex flex-wrap gap-1 mb-4">{p.tech_stack.slice(0, 3).map((t: string, i: number) => <span key={i} className="px-2 py-0.5 text-xs rounded" style={{ background: "hsl(var(--admin-muted))", border: "1px solid hsl(var(--admin-border))" }}>{t}</span>)}</div>}
                <div className="flex items-center gap-2 pt-3 border-t-2" style={{ borderColor: "hsl(var(--admin-border))" }}>
                  <button onClick={() => togglePublished(p)} className="p-2 rounded-lg hover:bg-gray-100" style={{ border: "1px solid hsl(var(--admin-border))" }}>{p.published ? <Eye size={18} /> : <EyeOff size={18} />}</button>
                  <button onClick={() => toggleFeatured(p)} className={`p-2 rounded-lg hover:bg-gray-100 ${p.featured ? "text-yellow-500" : ""}`} style={{ border: "1px solid hsl(var(--admin-border))" }}><Star size={18} fill={p.featured ? "currentColor" : "none"} /></button>
                  {p.website_url && <a href={p.website_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-gray-100" style={{ border: "1px solid hsl(var(--admin-border))" }}><ExternalLink size={18} /></a>}
                  <div className="flex-1" />
                  <button onClick={() => { setEditing({ ...emptyProject, ...p, tech_stack: p.tech_stack || [], services_provided: p.services_provided || [] }); setIsNew(false); }} className="p-2 rounded-lg hover:bg-gray-100" style={{ border: "1px solid hsl(var(--admin-border))" }}><Edit size={18} /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500" style={{ border: "1px solid hsl(0 72% 80%)" }}><Trash2 size={18} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-card-bordered p-12 text-center">
          <Globe size={48} className="mx-auto mb-4" style={{ color: "hsl(var(--admin-muted-fg))" }} />
          <p style={{ color: "hsl(var(--admin-muted-fg))" }}>No projects yet.</p>
          <button onClick={() => { setEditing({ ...emptyProject }); setIsNew(true); }} className="admin-btn-bordered mt-4"><Plus size={16} /> Add First Project</button>
        </div>
      )}
    </div>
  );
}
