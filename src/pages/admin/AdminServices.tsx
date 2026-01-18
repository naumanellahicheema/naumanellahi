import { useState } from "react";
import { useAllServices, useCreateService, useUpdateService, useDeleteService } from "@/hooks/usePortfolioData";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";

export default function AdminServices() {
  const { data: services, isLoading } = useAllServices();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();
  const { toast } = useToast();
  const [editing, setEditing] = useState<any>(null);
  const [isNew, setIsNew] = useState(false);

  const handleSave = async () => {
    try {
      if (isNew) { await createService.mutateAsync(editing); toast({ title: "Service created!" }); }
      else { await updateService.mutateAsync(editing); toast({ title: "Service updated!" }); }
      setEditing(null); setIsNew(false);
    } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    try { await deleteService.mutateAsync(id); toast({ title: "Service deleted!" }); } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  const startNew = () => { setEditing({ title: "", description: "", short_description: "", icon: "", highlights: [], display_order: 0, published: true }); setIsNew(true); };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold" style={{ color: "hsl(var(--admin-fg))" }}>Services</h1>
        <button onClick={startNew} className="admin-btn"><Plus size={16} /> Add Service</button>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="admin-card p-6 w-full max-w-xl" style={{ background: "hsl(var(--admin-bg))" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">{isNew ? "New Service" : "Edit Service"}</h2>
              <button onClick={() => { setEditing(null); setIsNew(false); }}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div><label className="admin-label">Title</label><input type="text" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="admin-input" /></div>
              <div><label className="admin-label">Icon (Code, Layout, Zap, Globe, Palette, Building, Search)</label><input type="text" value={editing.icon || ""} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} className="admin-input" /></div>
              <div><label className="admin-label">Short Description</label><input type="text" value={editing.short_description || ""} onChange={(e) => setEditing({ ...editing, short_description: e.target.value })} className="admin-input" /></div>
              <div><label className="admin-label">Description</label><textarea rows={3} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="admin-input" /></div>
              <div><label className="admin-label">Highlights (comma separated)</label><input type="text" value={(editing.highlights || []).join(", ")} onChange={(e) => setEditing({ ...editing, highlights: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) })} className="admin-input" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="admin-label">Order</label><input type="number" value={editing.display_order || 0} onChange={(e) => setEditing({ ...editing, display_order: parseInt(e.target.value) })} className="admin-input" /></div>
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
          <thead><tr><th>Title</th><th>Icon</th><th>Order</th><th>Published</th><th>Actions</th></tr></thead>
          <tbody>
            {services?.map((s: any) => (
              <tr key={s.id}>
                <td className="font-medium">{s.title}</td>
                <td>{s.icon}</td>
                <td>{s.display_order}</td>
                <td>{s.published ? "Yes" : "No"}</td>
                <td><div className="flex items-center gap-2"><button onClick={() => setEditing(s)} className="p-1 hover:bg-gray-100 rounded"><Edit size={16} /></button><button onClick={() => handleDelete(s.id)} className="p-1 hover:bg-gray-100 rounded text-red-500"><Trash2 size={16} /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}