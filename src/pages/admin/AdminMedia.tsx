import { useState, useCallback } from "react";
import { useMediaLibrary, useCreateMedia, useDeleteMedia } from "@/hooks/usePortfolioData";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Copy, X, Image, ExternalLink } from "lucide-react";

export default function AdminMedia() {
  const { data: media, isLoading, error } = useMediaLibrary();
  const createMedia = useCreateMedia();
  const deleteMedia = useDeleteMedia();
  const { toast } = useToast();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", url: "", alt_text: "", type: "image" });

  const handleFieldChange = useCallback((field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleAdd = async () => {
    if (!form.name || !form.url) {
      toast({ title: "Error", description: "Name and URL are required", variant: "destructive" });
      return;
    }
    
    try {
      await createMedia.mutateAsync(form);
      toast({ title: "Media added successfully!" });
      setShowAdd(false);
      setForm({ name: "", url: "", alt_text: "", type: "image" });
    } catch (error: any) {
      console.error("Add error:", error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this media item?")) return;
    try {
      await deleteMedia.mutateAsync(id);
      toast({ title: "Media deleted!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "URL copied to clipboard!" });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-current border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20" style={{ color: "hsl(var(--admin-muted-fg))" }}>
        <p>Error loading media library. Please refresh the page.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold" style={{ color: "hsl(var(--admin-fg))" }}>Media Library</h1>
        <button onClick={() => setShowAdd(true)} className="admin-btn"><Plus size={16} /> Add Media</button>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowAdd(false); }}>
          <div className="admin-card p-6 w-full max-w-md" style={{ background: "hsl(var(--admin-bg))" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold" style={{ color: "hsl(var(--admin-fg))" }}>Add Media</h2>
              <button onClick={() => setShowAdd(false)} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="admin-label">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  className="admin-input"
                  placeholder="Image name"
                />
              </div>
              <div>
                <label className="admin-label">URL *</label>
                <input
                  type="url"
                  value={form.url}
                  onChange={(e) => handleFieldChange("url", e.target.value)}
                  className="admin-input"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="admin-label">Alt Text</label>
                <input
                  type="text"
                  value={form.alt_text}
                  onChange={(e) => handleFieldChange("alt_text", e.target.value)}
                  className="admin-input"
                  placeholder="Description for accessibility"
                />
              </div>
              <div>
                <label className="admin-label">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => handleFieldChange("type", e.target.value)}
                  className="admin-input"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="document">Document</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={handleAdd} 
                  disabled={createMedia.isPending}
                  className="admin-btn"
                >
                  {createMedia.isPending ? "Adding..." : "Add Media"}
                </button>
                <button onClick={() => setShowAdd(false)} className="admin-btn-outline">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {media && media.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.map((m: any) => (
            <div key={m.id} className="admin-card p-2 group relative">
              <div className="aspect-square rounded overflow-hidden mb-2 bg-gray-100 flex items-center justify-center">
                {m.type === "image" || !m.type ? (
                  <img 
                    src={m.url} 
                    alt={m.alt_text || m.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`flex flex-col items-center justify-center ${m.type === "image" || !m.type ? "hidden" : ""}`}>
                  <Image size={32} style={{ color: "hsl(var(--admin-muted-fg))" }} />
                  <span className="text-xs mt-1" style={{ color: "hsl(var(--admin-muted-fg))" }}>{m.type}</span>
                </div>
              </div>
              <p className="text-xs truncate font-medium" style={{ color: "hsl(var(--admin-fg))" }}>{m.name}</p>
              <p className="text-xs truncate" style={{ color: "hsl(var(--admin-muted-fg))" }}>{new Date(m.created_at).toLocaleDateString()}</p>
              <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <a 
                  href={m.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-1.5 bg-white rounded shadow hover:bg-gray-100"
                  title="Open in new tab"
                >
                  <ExternalLink size={14} />
                </a>
                <button 
                  onClick={() => copyUrl(m.url)} 
                  className="p-1.5 bg-white rounded shadow hover:bg-gray-100"
                  title="Copy URL"
                >
                  <Copy size={14} />
                </button>
                <button 
                  onClick={() => handleDelete(m.id)} 
                  className="p-1.5 bg-white rounded shadow hover:bg-gray-100 text-red-500"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-card p-12 text-center">
          <Image size={48} className="mx-auto mb-4" style={{ color: "hsl(var(--admin-muted-fg))" }} />
          <p style={{ color: "hsl(var(--admin-muted-fg))" }}>No media yet.</p>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--admin-muted-fg))" }}>Click "Add Media" to upload your first image.</p>
        </div>
      )}
    </div>
  );
}
