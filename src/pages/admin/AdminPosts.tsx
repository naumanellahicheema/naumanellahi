import { useState } from "react";
import { useAllPosts, useCreatePost, useUpdatePost, useDeletePost } from "@/hooks/usePortfolioData";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";

export default function AdminPosts() {
  const { data: posts, isLoading } = useAllPosts();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();
  const { toast } = useToast();
  const [editing, setEditing] = useState<any>(null);
  const [isNew, setIsNew] = useState(false);

  const handleSave = async () => {
    try {
      const data = { ...editing };
      if (data.published && !data.published_at) data.published_at = new Date().toISOString();
      if (isNew) { await createPost.mutateAsync(data); toast({ title: "Post created!" }); }
      else { await updatePost.mutateAsync(data); toast({ title: "Post updated!" }); }
      setEditing(null); setIsNew(false);
    } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    try { await deletePost.mutateAsync(id); toast({ title: "Deleted!" }); } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  const startNew = () => { setEditing({ title: "", slug: "", excerpt: "", content: "", cover_image: "", tags: [], published: false, seo_title: "", seo_description: "" }); setIsNew(true); };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold" style={{ color: "hsl(var(--admin-fg))" }}>Blog Posts</h1>
        <button onClick={startNew} className="admin-btn"><Plus size={16} /> Add Post</button>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="admin-card p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={{ background: "hsl(var(--admin-bg))" }}>
            <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-semibold">{isNew ? "New" : "Edit"} Post</h2><button onClick={() => { setEditing(null); setIsNew(false); }}><X size={20} /></button></div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="admin-label">Title</label><input type="text" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="admin-input" /></div>
                <div><label className="admin-label">Slug</label><input type="text" value={editing.slug || ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="admin-input" /></div>
              </div>
              <div><label className="admin-label">Excerpt</label><input type="text" value={editing.excerpt || ""} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} className="admin-input" /></div>
              <div><label className="admin-label">Content</label><textarea rows={10} value={editing.content || ""} onChange={(e) => setEditing({ ...editing, content: e.target.value })} className="admin-input" /></div>
              <div><label className="admin-label">Cover Image URL</label><input type="url" value={editing.cover_image || ""} onChange={(e) => setEditing({ ...editing, cover_image: e.target.value })} className="admin-input" /></div>
              <div><label className="admin-label">Tags (comma separated)</label><input type="text" value={(editing.tags || []).join(", ")} onChange={(e) => setEditing({ ...editing, tags: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) })} className="admin-input" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="admin-label">SEO Title</label><input type="text" value={editing.seo_title || ""} onChange={(e) => setEditing({ ...editing, seo_title: e.target.value })} className="admin-input" /></div>
                <div><label className="admin-label">SEO Description</label><input type="text" value={editing.seo_description || ""} onChange={(e) => setEditing({ ...editing, seo_description: e.target.value })} className="admin-input" /></div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} /> Published</label>
              <div className="flex gap-3 pt-4"><button onClick={handleSave} className="admin-btn"><Save size={16} /> Save</button><button onClick={() => { setEditing(null); setIsNew(false); }} className="admin-btn-outline">Cancel</button></div>
            </div>
          </div>
        </div>
      )}

      <div className="admin-card overflow-hidden">
        <table className="admin-table">
          <thead><tr><th>Title</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {posts?.map((p: any) => (
              <tr key={p.id}>
                <td className="font-medium">{p.title}</td>
                <td><span className={`px-2 py-1 text-xs rounded ${p.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>{p.published ? "Published" : "Draft"}</span></td>
                <td>{p.published_at ? new Date(p.published_at).toLocaleDateString() : "-"}</td>
                <td><div className="flex items-center gap-2"><button onClick={() => setEditing(p)} className="p-1 hover:bg-gray-100 rounded"><Edit size={16} /></button><button onClick={() => handleDelete(p.id)} className="p-1 hover:bg-gray-100 rounded text-red-500"><Trash2 size={16} /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}