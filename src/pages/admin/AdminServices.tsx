import { useState, useCallback } from "react";
import { useAllServices, useCreateService, useUpdateService, useDeleteService } from "@/hooks/usePortfolioData";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save, X, Eye, EyeOff, Briefcase, GripVertical } from "lucide-react";
import { TagInput } from "@/components/ui/TagInput";

const iconOptions = ["Code", "Layout", "Zap", "Globe", "Palette", "Building", "Search", "Smartphone", "Database", "Cloud", "Shield", "Rocket"];

export default function AdminServices() {
  const { data: services, isLoading } = useAllServices();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();
  const { toast } = useToast();
  const [editing, setEditing] = useState<any>(null);
  const [isNew, setIsNew] = useState(false);

  const handleFieldChange = useCallback((field: string, value: any) => {
    setEditing((prev: any) => prev ? { ...prev, [field]: value } : null);
  }, []);

  const handleSave = async () => {
    if (!editing) return;
    try {
      if (isNew) {
        const { id, created_at, updated_at, ...data } = editing;
        await createService.mutateAsync(data);
        toast({ title: "Service created!" });
      } else {
        await updateService.mutateAsync(editing);
        toast({ title: "Service updated!" });
      }
      setEditing(null);
      setIsNew(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    try {
      await deleteService.mutateAsync(id);
      toast({ title: "Service deleted!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const togglePublished = async (service: any) => {
    try {
      await updateService.mutateAsync({ ...service, published: !service.published });
      toast({ title: service.published ? "Service hidden" : "Service published" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const startNew = () => {
    setEditing({ title: "", description: "", short_description: "", icon: "Code", highlights: [], display_order: 0, published: true });
    setIsNew(true);
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
        <h1 className="text-2xl font-display font-bold" style={{ color: "hsl(var(--admin-fg))" }}>Services</h1>
        <button onClick={startNew} className="admin-btn"><Plus size={16} /> Add Service</button>
      </div>

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => { if (e.target === e.currentTarget) { setEditing(null); setIsNew(false); } }}>
          <div className="admin-card p-6 w-full max-w-xl" style={{ background: "hsl(var(--admin-bg))" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold" style={{ color: "hsl(var(--admin-fg))" }}>{isNew ? "New Service" : "Edit Service"}</h2>
              <button onClick={() => { setEditing(null); setIsNew(false); }} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="admin-label">Title *</label>
                <input
                  type="text"
                  value={editing.title || ""}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  className="admin-input"
                  placeholder="Service title"
                />
              </div>
              <div>
                <label className="admin-label">Icon</label>
                <select
                  value={editing.icon || "Code"}
                  onChange={(e) => handleFieldChange("icon", e.target.value)}
                  className="admin-input"
                >
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="admin-label">Short Description</label>
                <input
                  type="text"
                  value={editing.short_description || ""}
                  onChange={(e) => handleFieldChange("short_description", e.target.value)}
                  className="admin-input"
                  placeholder="Brief description for cards"
                />
              </div>
              <div>
                <label className="admin-label">Full Description</label>
                <textarea
                  rows={4}
                  value={editing.description || ""}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
                  className="admin-input resize-none"
                  placeholder="Detailed service description"
                />
              </div>
              <div>
                <label className="admin-label">Highlights</label>
                <TagInput
                  value={editing.highlights || []}
                  onChange={(tags) => handleFieldChange("highlights", tags)}
                  placeholder="Add highlights (press Enter)"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Display Order</label>
                  <input
                    type="number"
                    value={editing.display_order || 0}
                    onChange={(e) => handleFieldChange("display_order", parseInt(e.target.value) || 0)}
                    className="admin-input"
                  />
                </div>
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
                <button onClick={handleSave} disabled={createService.isPending || updateService.isPending} className="admin-btn">
                  <Save size={16} /> {createService.isPending || updateService.isPending ? "Saving..." : "Save Service"}
                </button>
                <button onClick={() => { setEditing(null); setIsNew(false); }} className="admin-btn-outline">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Services Grid */}
      {services && services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s: any) => (
            <div key={s.id} className="admin-card p-6 relative group">
              {/* Status Badge */}
              {!s.published && (
                <span className="absolute top-3 right-3 px-2 py-1 text-xs font-medium bg-gray-800 text-white rounded-full">Hidden</span>
              )}
              
              {/* Icon & Title */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Briefcase size={24} style={{ color: "hsl(var(--admin-fg))" }} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg" style={{ color: "hsl(var(--admin-fg))" }}>{s.title}</h3>
                  <p className="text-sm" style={{ color: "hsl(var(--admin-muted-fg))" }}>Order: {s.display_order}</p>
                </div>
              </div>
              
              {s.short_description && (
                <p className="text-sm mb-4 line-clamp-2" style={{ color: "hsl(var(--admin-muted-fg))" }}>
                  {s.short_description}
                </p>
              )}
              
              {/* Highlights */}
              {s.highlights && s.highlights.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {s.highlights.slice(0, 3).map((h: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 text-xs rounded bg-gray-100">
                      {h}
                    </span>
                  ))}
                  {s.highlights.length > 3 && (
                    <span className="px-2 py-0.5 text-xs rounded bg-gray-100" style={{ color: "hsl(var(--admin-muted-fg))" }}>
                      +{s.highlights.length - 3}
                    </span>
                  )}
                </div>
              )}
              
              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t" style={{ borderColor: "hsl(var(--admin-border))" }}>
                <button
                  onClick={() => togglePublished(s)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title={s.published ? "Hide" : "Publish"}
                >
                  {s.published ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <div className="flex-1" />
                <button onClick={() => setEditing(s)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Edit">
                  <Edit size={18} />
                </button>
                <button onClick={() => handleDelete(s.id)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-red-500" title="Delete">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-card p-12 text-center">
          <Briefcase size={48} className="mx-auto mb-4" style={{ color: "hsl(var(--admin-muted-fg))" }} />
          <p style={{ color: "hsl(var(--admin-muted-fg))" }}>No services yet.</p>
          <button onClick={startNew} className="admin-btn mt-4"><Plus size={16} /> Add Your First Service</button>
        </div>
      )}
    </div>
  );
}