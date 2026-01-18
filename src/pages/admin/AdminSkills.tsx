import { useState } from "react";
import { useAllSkills, useCreateSkill, useUpdateSkill, useDeleteSkill } from "@/hooks/usePortfolioData";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";

export default function AdminSkills() {
  const { data: skills, isLoading } = useAllSkills();
  const createSkill = useCreateSkill();
  const updateSkill = useUpdateSkill();
  const deleteSkill = useDeleteSkill();
  const { toast } = useToast();
  const [editing, setEditing] = useState<any>(null);
  const [isNew, setIsNew] = useState(false);

  const handleSave = async () => {
    try {
      if (isNew) { await createSkill.mutateAsync(editing); toast({ title: "Skill created!" }); }
      else { await updateSkill.mutateAsync(editing); toast({ title: "Skill updated!" }); }
      setEditing(null); setIsNew(false);
    } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    try { await deleteSkill.mutateAsync(id); toast({ title: "Deleted!" }); } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  const startNew = () => { setEditing({ name: "", category: "General", level: 80, display_order: 0, published: true }); setIsNew(true); };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold" style={{ color: "hsl(var(--admin-fg))" }}>Skills</h1>
        <button onClick={startNew} className="admin-btn"><Plus size={16} /> Add Skill</button>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="admin-card p-6 w-full max-w-md" style={{ background: "hsl(var(--admin-bg))" }}>
            <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-semibold">{isNew ? "New" : "Edit"} Skill</h2><button onClick={() => { setEditing(null); setIsNew(false); }}><X size={20} /></button></div>
            <div className="space-y-4">
              <div><label className="admin-label">Name</label><input type="text" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="admin-input" /></div>
              <div><label className="admin-label">Category</label><input type="text" value={editing.category || ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="admin-input" placeholder="Frontend, Backend, CMS, Tools" /></div>
              <div><label className="admin-label">Level (0-100)</label><input type="number" min="0" max="100" value={editing.level || 80} onChange={(e) => setEditing({ ...editing, level: parseInt(e.target.value) })} className="admin-input" /></div>
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
          <thead><tr><th>Name</th><th>Category</th><th>Level</th><th>Published</th><th>Actions</th></tr></thead>
          <tbody>
            {skills?.map((s: any) => (
              <tr key={s.id}>
                <td className="font-medium">{s.name}</td>
                <td>{s.category}</td>
                <td>{s.level}%</td>
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