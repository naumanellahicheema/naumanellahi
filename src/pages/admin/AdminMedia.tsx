import { useMediaLibrary, useCreateMedia, useDeleteMedia } from "@/hooks/usePortfolioData";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Plus, Trash2, Copy, X } from "lucide-react";

export default function AdminMedia() {
  const { data: media, isLoading } = useMediaLibrary();
  const createMedia = useCreateMedia();
  const deleteMedia = useDeleteMedia();
  const { toast } = useToast();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", url: "", alt_text: "" });

  const handleAdd = async () => {
    try { await createMedia.mutateAsync(form); toast({ title: "Media added!" }); setShowAdd(false); setForm({ name: "", url: "", alt_text: "" }); } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    try { await deleteMedia.mutateAsync(id); toast({ title: "Deleted!" }); } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  const copyUrl = (url: string) => { navigator.clipboard.writeText(url); toast({ title: "URL copied!" }); };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold" style={{ color: "hsl(var(--admin-fg))" }}>Media Library</h1>
        <button onClick={() => setShowAdd(true)} className="admin-btn"><Plus size={16} /> Add Media</button>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="admin-card p-6 w-full max-w-md" style={{ background: "hsl(var(--admin-bg))" }}>
            <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-semibold">Add Media</h2><button onClick={() => setShowAdd(false)}><X size={20} /></button></div>
            <div className="space-y-4">
              <div><label className="admin-label">Name</label><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="admin-input" /></div>
              <div><label className="admin-label">URL</label><input type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="admin-input" /></div>
              <div><label className="admin-label">Alt Text</label><input type="text" value={form.alt_text} onChange={(e) => setForm({ ...form, alt_text: e.target.value })} className="admin-input" /></div>
              <div className="flex gap-3 pt-4"><button onClick={handleAdd} className="admin-btn">Add</button><button onClick={() => setShowAdd(false)} className="admin-btn-outline">Cancel</button></div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {media?.map((m: any) => (
          <div key={m.id} className="admin-card p-2 group relative">
            <div className="aspect-square rounded overflow-hidden mb-2 bg-gray-100">
              <img src={m.url} alt={m.alt_text || m.name} className="w-full h-full object-cover" />
            </div>
            <p className="text-xs truncate" style={{ color: "hsl(var(--admin-fg))" }}>{m.name}</p>
            <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => copyUrl(m.url)} className="p-1.5 bg-white rounded shadow hover:bg-gray-100"><Copy size={14} /></button>
              <button onClick={() => handleDelete(m.id)} className="p-1.5 bg-white rounded shadow hover:bg-gray-100 text-red-500"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
      {(!media || media.length === 0) && <p style={{ color: "hsl(var(--admin-muted-fg))" }}>No media yet.</p>}
    </div>
  );
}