import { useState } from "react";
import { useAllExperiences, useCreateExperience, useUpdateExperience, useDeleteExperience } from "@/hooks/usePortfolioData";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";

export default function AdminExperience() {
  const { data: experiences, isLoading } = useAllExperiences();
  const createExperience = useCreateExperience();
  const updateExperience = useUpdateExperience();
  const deleteExperience = useDeleteExperience();
  const { toast } = useToast();
  const [editing, setEditing] = useState<any>(null);
  const [isNew, setIsNew] = useState(false);

  const handleSave = async () => {
    try {
      if (isNew) { await createExperience.mutateAsync(editing); toast({ title: "Experience created!" }); }
      else { await updateExperience.mutateAsync(editing); toast({ title: "Experience updated!" }); }
      setEditing(null); setIsNew(false);
    } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    try { await deleteExperience.mutateAsync(id); toast({ title: "Deleted!" }); } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  const startNew = () => { setEditing({ company: "", role: "", location: "", start_date: "", end_date: "", is_current: false, description: "", display_order: 0, published: true }); setIsNew(true); };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold" style={{ color: "hsl(var(--admin-fg))" }}>Experience</h1>
        <button onClick={startNew} className="admin-btn"><Plus size={16} /> Add Experience</button>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="admin-card p-6 w-full max-w-xl" style={{ background: "hsl(var(--admin-bg))" }}>
            <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-semibold">{isNew ? "New" : "Edit"} Experience</h2><button onClick={() => { setEditing(null); setIsNew(false); }}><X size={20} /></button></div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="admin-label">Company</label><input type="text" value={editing.company} onChange={(e) => setEditing({ ...editing, company: e.target.value })} className="admin-input" /></div>
                <div><label className="admin-label">Role</label><input type="text" value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })} className="admin-input" /></div>
              </div>
              <div><label className="admin-label">Location</label><input type="text" value={editing.location || ""} onChange={(e) => setEditing({ ...editing, location: e.target.value })} className="admin-input" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="admin-label">Start Date</label><input type="date" value={editing.start_date || ""} onChange={(e) => setEditing({ ...editing, start_date: e.target.value })} className="admin-input" /></div>
                <div><label className="admin-label">End Date</label><input type="date" value={editing.end_date || ""} onChange={(e) => setEditing({ ...editing, end_date: e.target.value })} className="admin-input" disabled={editing.is_current} /></div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={editing.is_current} onChange={(e) => setEditing({ ...editing, is_current: e.target.checked, end_date: e.target.checked ? null : editing.end_date })} /> Current Role</label>
              <div><label className="admin-label">Description</label><textarea rows={3} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="admin-input" /></div>
              <div className="grid grid-cols-2 gap-4">
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
          <thead><tr><th>Role</th><th>Company</th><th>Period</th><th>Current</th><th>Actions</th></tr></thead>
          <tbody>
            {experiences?.map((e: any) => (
              <tr key={e.id}>
                <td className="font-medium">{e.role}</td>
                <td>{e.company}</td>
                <td>{new Date(e.start_date).getFullYear()} - {e.is_current ? "Present" : e.end_date ? new Date(e.end_date).getFullYear() : ""}</td>
                <td>{e.is_current ? "Yes" : "No"}</td>
                <td><div className="flex items-center gap-2"><button onClick={() => setEditing(e)} className="p-1 hover:bg-gray-100 rounded"><Edit size={16} /></button><button onClick={() => handleDelete(e.id)} className="p-1 hover:bg-gray-100 rounded text-red-500"><Trash2 size={16} /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}