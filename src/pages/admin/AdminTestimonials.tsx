import { useState } from "react";
import { useAllTestimonials, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial } from "@/hooks/usePortfolioData";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";

export default function AdminTestimonials() {
  const { data: testimonials, isLoading } = useAllTestimonials();
  const createTestimonial = useCreateTestimonial();
  const updateTestimonial = useUpdateTestimonial();
  const deleteTestimonial = useDeleteTestimonial();
  const { toast } = useToast();
  const [editing, setEditing] = useState<any>(null);
  const [isNew, setIsNew] = useState(false);

  const handleSave = async () => {
    try {
      if (isNew) { await createTestimonial.mutateAsync(editing); toast({ title: "Testimonial created!" }); }
      else { await updateTestimonial.mutateAsync(editing); toast({ title: "Testimonial updated!" }); }
      setEditing(null); setIsNew(false);
    } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    try { await deleteTestimonial.mutateAsync(id); toast({ title: "Deleted!" }); } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  const startNew = () => { setEditing({ client_name: "", company: "", role: "", message: "", rating: 5, avatar_url: "", display_order: 0, published: true }); setIsNew(true); };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold" style={{ color: "hsl(var(--admin-fg))" }}>Testimonials</h1>
        <button onClick={startNew} className="admin-btn"><Plus size={16} /> Add Testimonial</button>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="admin-card p-6 w-full max-w-xl" style={{ background: "hsl(var(--admin-bg))" }}>
            <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-semibold">{isNew ? "New" : "Edit"} Testimonial</h2><button onClick={() => { setEditing(null); setIsNew(false); }}><X size={20} /></button></div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="admin-label">Client Name</label><input type="text" value={editing.client_name} onChange={(e) => setEditing({ ...editing, client_name: e.target.value })} className="admin-input" /></div>
                <div><label className="admin-label">Company</label><input type="text" value={editing.company || ""} onChange={(e) => setEditing({ ...editing, company: e.target.value })} className="admin-input" /></div>
              </div>
              <div><label className="admin-label">Role</label><input type="text" value={editing.role || ""} onChange={(e) => setEditing({ ...editing, role: e.target.value })} className="admin-input" /></div>
              <div><label className="admin-label">Message</label><textarea rows={4} value={editing.message} onChange={(e) => setEditing({ ...editing, message: e.target.value })} className="admin-input" /></div>
              <div><label className="admin-label">Avatar URL</label><input type="url" value={editing.avatar_url || ""} onChange={(e) => setEditing({ ...editing, avatar_url: e.target.value })} className="admin-input" /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="admin-label">Rating (1-5)</label><input type="number" min="1" max="5" value={editing.rating || 5} onChange={(e) => setEditing({ ...editing, rating: parseInt(e.target.value) })} className="admin-input" /></div>
                <div><label className="admin-label">Order</label><input type="number" value={editing.display_order || 0} onChange={(e) => setEditing({ ...editing, display_order: parseInt(e.target.value) })} className="admin-input" /></div>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} /> Published</label>
              </div>
              <div className="flex gap-3 pt-4"><button onClick={handleSave} className="admin-btn"><Save size={16} /> Save</button><button onClick={() => { setEditing(null); setIsNew(false); }} className="admin-btn-outline">Cancel</button></div>
            </div>
          </div>
        </div>
      )}

      <div className="admin-card overflow-hidden">
        <table className="admin-table">
          <thead><tr><th>Client</th><th>Company</th><th>Rating</th><th>Published</th><th>Actions</th></tr></thead>
          <tbody>
            {testimonials?.map((t: any) => (
              <tr key={t.id}>
                <td className="font-medium">{t.client_name}</td>
                <td>{t.company}</td>
                <td>{"★".repeat(t.rating)}</td>
                <td>{t.published ? "Yes" : "No"}</td>
                <td><div className="flex items-center gap-2"><button onClick={() => setEditing(t)} className="p-1 hover:bg-gray-100 rounded"><Edit size={16} /></button><button onClick={() => handleDelete(t.id)} className="p-1 hover:bg-gray-100 rounded text-red-500"><Trash2 size={16} /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}