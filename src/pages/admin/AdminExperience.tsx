import { useState, useCallback } from "react";
import { useAllExperiences, useCreateExperience, useUpdateExperience, useDeleteExperience } from "@/hooks/usePortfolioData";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save, X, Eye, EyeOff, Briefcase, Calendar, MapPin } from "lucide-react";

export default function AdminExperience() {
  const { data: experiences, isLoading } = useAllExperiences();
  const createExperience = useCreateExperience();
  const updateExperience = useUpdateExperience();
  const deleteExperience = useDeleteExperience();
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
        await createExperience.mutateAsync(data);
        toast({ title: "Experience created!" });
      } else {
        await updateExperience.mutateAsync(editing);
        toast({ title: "Experience updated!" });
      }
      setEditing(null);
      setIsNew(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this experience?")) return;
    try {
      await deleteExperience.mutateAsync(id);
      toast({ title: "Experience deleted!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const togglePublished = async (exp: any) => {
    try {
      await updateExperience.mutateAsync({ ...exp, published: !exp.published });
      toast({ title: exp.published ? "Experience hidden" : "Experience published" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const startNew = () => {
    setEditing({ company: "", role: "", location: "", start_date: "", end_date: "", is_current: false, description: "", highlights: [], display_order: 0, published: true });
    setIsNew(true);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", year: "numeric" });
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
        <h1 className="text-2xl font-display font-bold" style={{ color: "hsl(var(--admin-fg))" }}>Experience</h1>
        <button onClick={startNew} className="admin-btn"><Plus size={16} /> Add Experience</button>
      </div>

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => { if (e.target === e.currentTarget) { setEditing(null); setIsNew(false); } }}>
          <div className="admin-card p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto" style={{ background: "hsl(var(--admin-bg))" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold" style={{ color: "hsl(var(--admin-fg))" }}>{isNew ? "New Experience" : "Edit Experience"}</h2>
              <button onClick={() => { setEditing(null); setIsNew(false); }} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Company *</label>
                  <input
                    type="text"
                    value={editing.company || ""}
                    onChange={(e) => handleFieldChange("company", e.target.value)}
                    className="admin-input"
                    placeholder="Company name"
                  />
                </div>
                <div>
                  <label className="admin-label">Role *</label>
                  <input
                    type="text"
                    value={editing.role || ""}
                    onChange={(e) => handleFieldChange("role", e.target.value)}
                    className="admin-input"
                    placeholder="Your job title"
                  />
                </div>
              </div>
              <div>
                <label className="admin-label">Location</label>
                <input
                  type="text"
                  value={editing.location || ""}
                  onChange={(e) => handleFieldChange("location", e.target.value)}
                  className="admin-input"
                  placeholder="City, Country or Remote"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Start Date *</label>
                  <input
                    type="date"
                    value={editing.start_date || ""}
                    onChange={(e) => handleFieldChange("start_date", e.target.value)}
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="admin-label">End Date</label>
                  <input
                    type="date"
                    value={editing.end_date || ""}
                    onChange={(e) => handleFieldChange("end_date", e.target.value)}
                    className="admin-input"
                    disabled={editing.is_current}
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.is_current || false}
                  onChange={(e) => handleFieldChange("is_current", e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm" style={{ color: "hsl(var(--admin-fg))" }}>I currently work here</span>
              </label>
              <div>
                <label className="admin-label">Description</label>
                <textarea
                  rows={4}
                  value={editing.description || ""}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
                  className="admin-input resize-none"
                  placeholder="Describe your role and responsibilities"
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
                <button onClick={handleSave} disabled={createExperience.isPending || updateExperience.isPending} className="admin-btn">
                  <Save size={16} /> {createExperience.isPending || updateExperience.isPending ? "Saving..." : "Save Experience"}
                </button>
                <button onClick={() => { setEditing(null); setIsNew(false); }} className="admin-btn-outline">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Experience Timeline */}
      {experiences && experiences.length > 0 ? (
        <div className="space-y-4">
          {experiences.map((e: any) => (
            <div key={e.id} className="admin-card p-6 relative">
              {/* Status Badges */}
              <div className="absolute top-4 right-4 flex gap-2">
                {e.is_current && (
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Current</span>
                )}
                {!e.published && (
                  <span className="px-2 py-1 text-xs font-medium bg-gray-800 text-white rounded-full">Hidden</span>
                )}
              </div>
              
              <div className="flex gap-4">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center flex-shrink-0">
                  <Briefcase size={24} className="text-white" />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg" style={{ color: "hsl(var(--admin-fg))" }}>{e.role}</h3>
                  <p className="font-medium" style={{ color: "hsl(var(--admin-fg))" }}>{e.company}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm" style={{ color: "hsl(var(--admin-muted-fg))" }}>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDate(e.start_date)} - {e.is_current ? "Present" : formatDate(e.end_date)}
                    </span>
                    {e.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {e.location}
                      </span>
                    )}
                  </div>
                  
                  {e.description && (
                    <p className="text-sm mt-3 line-clamp-2" style={{ color: "hsl(var(--admin-muted-fg))" }}>
                      {e.description}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t" style={{ borderColor: "hsl(var(--admin-border))" }}>
                <button
                  onClick={() => togglePublished(e)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title={e.published ? "Hide" : "Publish"}
                >
                  {e.published ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <div className="flex-1" />
                <button onClick={() => setEditing(e)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Edit">
                  <Edit size={18} />
                </button>
                <button onClick={() => handleDelete(e.id)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-red-500" title="Delete">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-card p-12 text-center">
          <Briefcase size={48} className="mx-auto mb-4" style={{ color: "hsl(var(--admin-muted-fg))" }} />
          <p style={{ color: "hsl(var(--admin-muted-fg))" }}>No experience added yet.</p>
          <button onClick={startNew} className="admin-btn mt-4"><Plus size={16} /> Add Your First Experience</button>
        </div>
      )}
    </div>
  );
}