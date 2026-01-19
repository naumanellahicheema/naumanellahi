import { useState, useCallback } from "react";
import { useAllTestimonials, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial } from "@/hooks/usePortfolioData";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save, X, Eye, EyeOff, Star, Quote, User } from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";

export default function AdminTestimonials() {
  const { data: testimonials, isLoading } = useAllTestimonials();
  const createTestimonial = useCreateTestimonial();
  const updateTestimonial = useUpdateTestimonial();
  const deleteTestimonial = useDeleteTestimonial();
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
        await createTestimonial.mutateAsync(data);
        toast({ title: "Testimonial created!" });
      } else {
        await updateTestimonial.mutateAsync(editing);
        toast({ title: "Testimonial updated!" });
      }
      setEditing(null);
      setIsNew(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      await deleteTestimonial.mutateAsync(id);
      toast({ title: "Testimonial deleted!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const togglePublished = async (t: any) => {
    try {
      await updateTestimonial.mutateAsync({ ...t, published: !t.published });
      toast({ title: t.published ? "Testimonial hidden" : "Testimonial published" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const startNew = () => {
    setEditing({ client_name: "", company: "", role: "", message: "", rating: 5, avatar_url: "", display_order: 0, published: true });
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
        <h1 className="text-2xl font-display font-bold" style={{ color: "hsl(var(--admin-fg))" }}>Testimonials</h1>
        <button onClick={startNew} className="admin-btn"><Plus size={16} /> Add Testimonial</button>
      </div>

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => { if (e.target === e.currentTarget) { setEditing(null); setIsNew(false); } }}>
          <div className="admin-card p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto" style={{ background: "hsl(var(--admin-bg))" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold" style={{ color: "hsl(var(--admin-fg))" }}>{isNew ? "New Testimonial" : "Edit Testimonial"}</h2>
              <button onClick={() => { setEditing(null); setIsNew(false); }} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              {/* Avatar Upload */}
              <div>
                <label className="admin-label">Client Photo</label>
                <ImageUpload
                  value={editing.avatar_url}
                  onChange={(url) => handleFieldChange("avatar_url", url)}
                  onRemove={() => handleFieldChange("avatar_url", "")}
                  folder="testimonials"
                  placeholder="Upload client photo"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Client Name *</label>
                  <input
                    type="text"
                    value={editing.client_name || ""}
                    onChange={(e) => handleFieldChange("client_name", e.target.value)}
                    className="admin-input"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="admin-label">Company</label>
                  <input
                    type="text"
                    value={editing.company || ""}
                    onChange={(e) => handleFieldChange("company", e.target.value)}
                    className="admin-input"
                    placeholder="Company name"
                  />
                </div>
              </div>
              <div>
                <label className="admin-label">Role / Position</label>
                <input
                  type="text"
                  value={editing.role || ""}
                  onChange={(e) => handleFieldChange("role", e.target.value)}
                  className="admin-input"
                  placeholder="CEO, Marketing Director, etc."
                />
              </div>
              <div>
                <label className="admin-label">Testimonial Message *</label>
                <textarea
                  rows={4}
                  value={editing.message || ""}
                  onChange={(e) => handleFieldChange("message", e.target.value)}
                  className="admin-input resize-none"
                  placeholder="What did they say about your work?"
                />
              </div>
              <div>
                <label className="admin-label">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleFieldChange("rating", star)}
                      className="p-1"
                    >
                      <Star
                        size={24}
                        fill={(editing.rating || 5) >= star ? "currentColor" : "none"}
                        className={(editing.rating || 5) >= star ? "text-yellow-400" : "text-gray-300"}
                      />
                    </button>
                  ))}
                </div>
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
                <button onClick={handleSave} disabled={createTestimonial.isPending || updateTestimonial.isPending} className="admin-btn">
                  <Save size={16} /> {createTestimonial.isPending || updateTestimonial.isPending ? "Saving..." : "Save Testimonial"}
                </button>
                <button onClick={() => { setEditing(null); setIsNew(false); }} className="admin-btn-outline">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Testimonials Grid */}
      {testimonials && testimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t: any) => (
            <div key={t.id} className="admin-card p-6 relative">
              {!t.published && (
                <span className="absolute top-3 right-3 px-2 py-1 text-xs font-medium bg-gray-800 text-white rounded-full">Hidden</span>
              )}
              
              {/* Quote Icon */}
              <Quote size={32} className="mb-4 opacity-20" />
              
              {/* Message */}
              <p className="text-sm mb-6 line-clamp-4 italic" style={{ color: "hsl(var(--admin-muted-fg))" }}>
                "{t.message}"
              </p>
              
              {/* Rating */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < (t.rating || 5) ? "currentColor" : "none"}
                    className={i < (t.rating || 5) ? "text-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>
              
              {/* Client Info */}
              <div className="flex items-center gap-3 mb-4">
                {t.avatar_url ? (
                  <img src={t.avatar_url} alt={t.client_name} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <User size={24} style={{ color: "hsl(var(--admin-muted-fg))" }} />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold" style={{ color: "hsl(var(--admin-fg))" }}>{t.client_name}</h3>
                  <p className="text-sm" style={{ color: "hsl(var(--admin-muted-fg))" }}>
                    {t.role}{t.role && t.company ? ", " : ""}{t.company}
                  </p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t" style={{ borderColor: "hsl(var(--admin-border))" }}>
                <button
                  onClick={() => togglePublished(t)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title={t.published ? "Hide" : "Publish"}
                >
                  {t.published ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <div className="flex-1" />
                <button onClick={() => setEditing(t)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Edit">
                  <Edit size={18} />
                </button>
                <button onClick={() => handleDelete(t.id)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-red-500" title="Delete">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-card p-12 text-center">
          <Quote size={48} className="mx-auto mb-4" style={{ color: "hsl(var(--admin-muted-fg))" }} />
          <p style={{ color: "hsl(var(--admin-muted-fg))" }}>No testimonials yet.</p>
          <button onClick={startNew} className="admin-btn mt-4"><Plus size={16} /> Add Your First Testimonial</button>
        </div>
      )}
    </div>
  );
}