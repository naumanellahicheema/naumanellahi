import { useState, useCallback } from "react";
import { useAllProjects, useCreateProject, useUpdateProject, useDeleteProject } from "@/hooks/usePortfolioData";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save, X, ExternalLink, Image } from "lucide-react";

const emptyProject = {
  title: "",
  slug: "",
  description: "",
  short_description: "",
  industry: "",
  country: "",
  website_url: "",
  thumbnail_url: "",
  tech_stack: [] as string[],
  services_provided: [] as string[],
  images: [] as string[],
  featured: false,
  published: true,
  display_order: 0,
  status: "active"
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
      // Generate slug if not provided
      if (!projectData.slug && projectData.title) {
        projectData.slug = projectData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      }
      
      if (isNew) {
        const { id, ...data } = projectData;
        await createProject.mutateAsync(data);
        toast({ title: "Project created successfully!" });
      } else {
        await updateProject.mutateAsync(projectData);
        toast({ title: "Project updated successfully!" });
      }
      setEditing(null);
      setIsNew(false);
    } catch (error: any) {
      console.error("Save error:", error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteProject.mutateAsync(id);
      toast({ title: "Project deleted!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const startNew = () => {
    setEditing({ ...emptyProject });
    setIsNew(true);
  };

  const startEdit = (project: any) => {
    setEditing({ 
      ...emptyProject, 
      ...project,
      tech_stack: project.tech_stack || [],
      services_provided: project.services_provided || [],
      images: project.images || []
    });
    setIsNew(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-current border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold" style={{ color: "hsl(var(--admin-fg))" }}>Projects</h1>
        <button onClick={startNew} className="admin-btn"><Plus size={16} /> Add Project</button>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => { if (e.target === e.currentTarget) { setEditing(null); setIsNew(false); } }}>
          <div className="admin-card p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto" style={{ background: "hsl(var(--admin-bg))" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold" style={{ color: "hsl(var(--admin-fg))" }}>{isNew ? "New Project" : "Edit Project"}</h2>
              <button onClick={() => { setEditing(null); setIsNew(false); }} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
            </div>
            
            <div className="space-y-5">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Title *</label>
                  <input
                    type="text"
                    value={editing.title || ""}
                    onChange={(e) => handleFieldChange("title", e.target.value)}
                    className="admin-input"
                    placeholder="Project title"
                  />
                </div>
                <div>
                  <label className="admin-label">Slug</label>
                  <input
                    type="text"
                    value={editing.slug || ""}
                    onChange={(e) => handleFieldChange("slug", e.target.value)}
                    className="admin-input"
                    placeholder="auto-generated-from-title"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Industry</label>
                  <input
                    type="text"
                    value={editing.industry || ""}
                    onChange={(e) => handleFieldChange("industry", e.target.value)}
                    className="admin-input"
                    placeholder="e.g., E-commerce, Healthcare"
                  />
                </div>
                <div>
                  <label className="admin-label">Country</label>
                  <input
                    type="text"
                    value={editing.country || ""}
                    onChange={(e) => handleFieldChange("country", e.target.value)}
                    className="admin-input"
                    placeholder="e.g., USA, UK"
                  />
                </div>
              </div>
              
              <div>
                <label className="admin-label">Short Description</label>
                <input
                  type="text"
                  value={editing.short_description || ""}
                  onChange={(e) => handleFieldChange("short_description", e.target.value)}
                  className="admin-input"
                  placeholder="Brief description for cards"
                  maxLength={200}
                />
              </div>
              
              <div>
                <label className="admin-label">Full Description</label>
                <textarea
                  rows={5}
                  value={editing.description || ""}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
                  className="admin-input resize-none"
                  placeholder="Detailed project description..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Website URL</label>
                  <input
                    type="url"
                    value={editing.website_url || ""}
                    onChange={(e) => handleFieldChange("website_url", e.target.value)}
                    className="admin-input"
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="admin-label">Thumbnail URL</label>
                  <input
                    type="url"
                    value={editing.thumbnail_url || ""}
                    onChange={(e) => handleFieldChange("thumbnail_url", e.target.value)}
                    className="admin-input"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              
              <div>
                <label className="admin-label">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={Array.isArray(editing.tech_stack) ? editing.tech_stack.join(", ") : ""}
                  onChange={(e) => handleFieldChange("tech_stack", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                  className="admin-input"
                  placeholder="React, Node.js, PostgreSQL"
                />
              </div>
              
              <div>
                <label className="admin-label">Services Provided (comma separated)</label>
                <input
                  type="text"
                  value={Array.isArray(editing.services_provided) ? editing.services_provided.join(", ") : ""}
                  onChange={(e) => handleFieldChange("services_provided", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                  className="admin-input"
                  placeholder="Web Development, UI/UX Design"
                />
              </div>

              <div>
                <label className="admin-label">Image Gallery URLs (comma separated)</label>
                <textarea
                  rows={3}
                  value={Array.isArray(editing.images) ? editing.images.join(", ") : ""}
                  onChange={(e) => handleFieldChange("images", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                  className="admin-input resize-none"
                  placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                <div>
                  <label className="admin-label">Display Order</label>
                  <input
                    type="number"
                    value={editing.display_order || 0}
                    onChange={(e) => handleFieldChange("display_order", parseInt(e.target.value) || 0)}
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="admin-label">Status</label>
                  <select
                    value={editing.status || "active"}
                    onChange={(e) => handleFieldChange("status", e.target.value)}
                    className="admin-input"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 cursor-pointer pt-6">
                  <input
                    type="checkbox"
                    checked={editing.featured || false}
                    onChange={(e) => handleFieldChange("featured", e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm" style={{ color: "hsl(var(--admin-fg))" }}>Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer pt-6">
                  <input
                    type="checkbox"
                    checked={editing.published !== false}
                    onChange={(e) => handleFieldChange("published", e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm" style={{ color: "hsl(var(--admin-fg))" }}>Published</span>
                </label>
              </div>
              
              <div className="flex gap-3 pt-4 border-t" style={{ borderColor: "hsl(var(--admin-border))" }}>
                <button 
                  onClick={handleSave} 
                  disabled={createProject.isPending || updateProject.isPending}
                  className="admin-btn"
                >
                  <Save size={16} /> 
                  {createProject.isPending || updateProject.isPending ? "Saving..." : "Save Project"}
                </button>
                <button onClick={() => { setEditing(null); setIsNew(false); }} className="admin-btn-outline">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="admin-card overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Industry</th>
              <th>Country</th>
              <th>Featured</th>
              <th>Published</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects?.map((p: any) => (
              <tr key={p.id}>
                <td className="font-medium">{p.title}</td>
                <td>{p.industry || "-"}</td>
                <td>{p.country || "-"}</td>
                <td>{p.featured ? "Yes" : "No"}</td>
                <td>{p.published ? "Yes" : "No"}</td>
                <td>
                  <div className="flex items-center gap-2">
                    {p.thumbnail_url && (
                      <a href={p.thumbnail_url} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-gray-100 rounded" title="View thumbnail">
                        <Image size={16} />
                      </a>
                    )}
                    {p.website_url && (
                      <a href={p.website_url} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-gray-100 rounded" title="Visit website">
                        <ExternalLink size={16} />
                      </a>
                    )}
                    <button onClick={() => startEdit(p)} className="p-1 hover:bg-gray-100 rounded" title="Edit">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-1 hover:bg-gray-100 rounded text-red-500" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {(!projects || projects.length === 0) && (
              <tr>
                <td colSpan={6} className="text-center py-8" style={{ color: "hsl(var(--admin-muted-fg))" }}>
                  No projects yet. Click "Add Project" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
