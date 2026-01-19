import { useState, useCallback } from "react";
import { useAllSkills, useCreateSkill, useUpdateSkill, useDeleteSkill } from "@/hooks/usePortfolioData";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save, X, Eye, EyeOff, Award } from "lucide-react";

const categories = ["Frontend", "Backend", "CMS", "Tools", "Languages", "Frameworks", "Databases", "Design", "DevOps", "General"];

export default function AdminSkills() {
  const { data: skills, isLoading } = useAllSkills();
  const createSkill = useCreateSkill();
  const updateSkill = useUpdateSkill();
  const deleteSkill = useDeleteSkill();
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
        await createSkill.mutateAsync(data);
        toast({ title: "Skill created!" });
      } else {
        await updateSkill.mutateAsync(editing);
        toast({ title: "Skill updated!" });
      }
      setEditing(null);
      setIsNew(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    try {
      await deleteSkill.mutateAsync(id);
      toast({ title: "Skill deleted!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const togglePublished = async (skill: any) => {
    try {
      await updateSkill.mutateAsync({ ...skill, published: !skill.published });
      toast({ title: skill.published ? "Skill hidden" : "Skill published" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const startNew = () => {
    setEditing({ name: "", category: "General", level: 80, display_order: 0, published: true });
    setIsNew(true);
  };

  // Group skills by category
  const skillsByCategory = skills?.reduce((acc: any, skill: any) => {
    const cat = skill.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {}) || {};

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
        <h1 className="text-2xl font-display font-bold" style={{ color: "hsl(var(--admin-fg))" }}>Skills</h1>
        <button onClick={startNew} className="admin-btn"><Plus size={16} /> Add Skill</button>
      </div>

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => { if (e.target === e.currentTarget) { setEditing(null); setIsNew(false); } }}>
          <div className="admin-card p-6 w-full max-w-md" style={{ background: "hsl(var(--admin-bg))" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold" style={{ color: "hsl(var(--admin-fg))" }}>{isNew ? "New Skill" : "Edit Skill"}</h2>
              <button onClick={() => { setEditing(null); setIsNew(false); }} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="admin-label">Skill Name *</label>
                <input
                  type="text"
                  value={editing.name || ""}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  className="admin-input"
                  placeholder="e.g., React, WordPress, Figma"
                />
              </div>
              <div>
                <label className="admin-label">Category</label>
                <select
                  value={editing.category || "General"}
                  onChange={(e) => handleFieldChange("category", e.target.value)}
                  className="admin-input"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="admin-label">Proficiency Level: {editing.level || 80}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editing.level || 80}
                  onChange={(e) => handleFieldChange("level", parseInt(e.target.value))}
                  className="w-full"
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
                <button onClick={handleSave} disabled={createSkill.isPending || updateSkill.isPending} className="admin-btn">
                  <Save size={16} /> {createSkill.isPending || updateSkill.isPending ? "Saving..." : "Save Skill"}
                </button>
                <button onClick={() => { setEditing(null); setIsNew(false); }} className="admin-btn-outline">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Skills by Category */}
      {Object.keys(skillsByCategory).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(skillsByCategory).map(([category, categorySkills]: [string, any]) => (
            <div key={category}>
              <h2 className="text-lg font-semibold mb-4" style={{ color: "hsl(var(--admin-fg))" }}>{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorySkills.map((s: any) => (
                  <div key={s.id} className="admin-card p-4 relative">
                    {!s.published && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-medium bg-gray-800 text-white rounded-full">Hidden</span>
                    )}
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium" style={{ color: "hsl(var(--admin-fg))" }}>{s.name}</h3>
                      <span className="text-sm font-semibold" style={{ color: "hsl(var(--admin-fg))" }}>{s.level}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                      <div 
                        className="h-full bg-black rounded-full transition-all duration-500"
                        style={{ width: `${s.level}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => togglePublished(s)}
                        className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                        title={s.published ? "Hide" : "Publish"}
                      >
                        {s.published ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                      <div className="flex-1" />
                      <button onClick={() => setEditing(s)} className="p-1.5 rounded hover:bg-gray-100 transition-colors" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded hover:bg-gray-100 transition-colors text-red-500" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-card p-12 text-center">
          <Award size={48} className="mx-auto mb-4" style={{ color: "hsl(var(--admin-muted-fg))" }} />
          <p style={{ color: "hsl(var(--admin-muted-fg))" }}>No skills yet.</p>
          <button onClick={startNew} className="admin-btn mt-4"><Plus size={16} /> Add Your First Skill</button>
        </div>
      )}
    </div>
  );
}