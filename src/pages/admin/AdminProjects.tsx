import { useState, useCallback } from "react";
import { useAllProjects, useCreateProject, useUpdateProject, useDeleteProject } from "@/hooks/usePortfolioData";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save, X, ExternalLink, Eye, EyeOff, Star, Globe } from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { TagInput } from "@/components/ui/TagInput";

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

  const togglePublished = async (project: any) => {
    try {
      await updateProject.mutateAsync({ ...project, published: !project.published });
      toast({ title: project.published ? "Project hidden" : "Project published" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const toggleFeatured = async (project: any) => {
    try {
      await updateProject.mutateAsync({ ...project, featured: !project.featured });
      toast({ title: project.featured ? "Removed from featured" : "Added to featured" });
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

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => { if (e.target === e.currentTarget) { setEditing(null); setIsNew(false); } }}>
          <div className="admin-card p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto" style={{ background: "hsl(var(--admin-bg))" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold" style={{ color: "hsl(var(--admin-fg))" }}>{isNew ? "New Project" : "Edit Project"}</h2>
              <button onClick={() => { setEditing(null); setIsNew(false); }} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
            </div>
            
            <div className="space-y-6">
              {/* Thumbnail Upload */}
              <div>
                <label className="admin-label">Thumbnail Image</label>
                <ImageUpload
                  value={editing.thumbnail_url}
                  onChange={(url) => handleFieldChange("thumbnail_url", url)}
                  onRemove={() => handleFieldChange("thumbnail_url", "")}
                  folder="projects"
                  placeholder="Upload project thumbnail"
                />
              </div>

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
                <label className="admin-label">Tech Stack</label>
                <TagInput
                  value={editing.tech_stack || []}
                  onChange={(tags) => handleFieldChange("tech_stack", tags)}
                  placeholder="Add technologies (press Enter)"
                />
              </div>
              
              <div>
                <label className="admin-label">Services Provided</label>
                <TagInput
                  value={editing.services_provided || []}
                  onChange={(tags) => handleFieldChange("services_provided", tags)}
                  placeholder="Add services (press Enter)"
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

      {/* Projects Grid */}
      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p: any) => (
            <div key={p.id} className="admin-card overflow-hidden group">
              {/* Thumbnail */}
              <div className="aspect-video bg-gray-100 relative overflow-hidden">
                {p.thumbnail_url ? (
                  <img src={p.thumbnail_url} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Globe size={48} style={{ color: "hsl(var(--admin-muted-fg))" }} />
                  </div>
                )}
                {/* Status Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {p.featured && (
                    <span className="px-2 py-1 text-xs font-medium bg-yellow-400 text-yellow-900 rounded-full flex items-center gap-1">
                      <Star size={12} /> Featured
                    </span>
                  )}
                  {!p.published && (
                    <span className="px-2 py-1 text-xs font-medium bg-gray-800 text-white rounded-full">Hidden</span>
                  )}
                </div>
              </div>
              
              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1" style={{ color: "hsl(var(--admin-fg))" }}>{p.title}</h3>
                <div className="flex items-center gap-2 text-xs mb-2" style={{ color: "hsl(var(--admin-muted-fg))" }}>
                  {p.industry && <span>{p.industry}</span>}
                  {p.industry && p.country && <span>•</span>}
                  {p.country && <span>{p.country}</span>}
                </div>
                {p.short_description && (
                  <p className="text-sm line-clamp-2 mb-4" style={{ color: "hsl(var(--admin-muted-fg))" }}>
                    {p.short_description}
                  </p>
                )}
                
                {/* Tech Stack Tags */}
                {p.tech_stack && p.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {p.tech_stack.slice(0, 3).map((tech: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 text-xs rounded bg-gray-100" style={{ color: "hsl(var(--admin-fg))" }}>
                        {tech}
                      </span>
                    ))}
                    {p.tech_stack.length > 3 && (
                      <span className="px-2 py-0.5 text-xs rounded bg-gray-100" style={{ color: "hsl(var(--admin-muted-fg))" }}>
                        +{p.tech_stack.length - 3}
                      </span>
                    )}
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t" style={{ borderColor: "hsl(var(--admin-border))" }}>
                  <button
                    onClick={() => togglePublished(p)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title={p.published ? "Hide" : "Publish"}
                  >
                    {p.published ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <button
                    onClick={() => toggleFeatured(p)}
                    className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${p.featured ? "text-yellow-500" : ""}`}
                    title={p.featured ? "Remove from featured" : "Add to featured"}
                  >
                    <Star size={18} fill={p.featured ? "currentColor" : "none"} />
                  </button>
                  {p.website_url && (
                    <a href={p.website_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Visit website">
                      <ExternalLink size={18} />
                    </a>
                  )}
                  <div className="flex-1" />
                  <button onClick={() => startEdit(p)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Edit">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-red-500" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-card p-12 text-center">
          <Globe size={48} className="mx-auto mb-4" style={{ color: "hsl(var(--admin-muted-fg))" }} />
          <p style={{ color: "hsl(var(--admin-muted-fg))" }}>No projects yet.</p>
          <button onClick={startNew} className="admin-btn mt-4"><Plus size={16} /> Add Your First Project</button>
        </div>
      )}
    </div>
  );
}