import { useState, useRef } from "react";
import { useMediaLibrary, useCreateMedia, useDeleteMedia } from "@/hooks/usePortfolioData";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, Copy, Image, ExternalLink, Loader2, X, FolderOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function AdminMedia() {
  const { data: media, isLoading, error } = useMediaLibrary();
  const createMedia = useCreateMedia();
  const deleteMedia = useDeleteMedia();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `uploads/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("media")
        .getPublicUrl(fileName);

      // Save to media library table
      await createMedia.mutateAsync({
        name: file.name,
        url: publicUrl,
        alt_text: file.name.replace(/\.[^/.]+$/, ""),
        type: file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "document",
        size: file.size
      });

      toast({ title: "File uploaded successfully!" });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(uploadFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files) {
      Array.from(files).forEach(uploadFile);
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
      </div>

      {/* Upload Area */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        className={`
          admin-card mb-8 p-12 flex flex-col items-center justify-center cursor-pointer transition-all border-2 border-dashed
          ${dragOver ? "border-black bg-gray-50" : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"}
        `}
      >
        {uploading ? (
          <>
            <Loader2 size={48} className="animate-spin mb-4" style={{ color: "hsl(var(--admin-muted-fg))" }} />
            <p style={{ color: "hsl(var(--admin-muted-fg))" }}>Uploading...</p>
          </>
        ) : (
          <>
            <Upload size={48} className="mb-4" style={{ color: "hsl(var(--admin-muted-fg))" }} />
            <p className="text-lg font-medium mb-2" style={{ color: "hsl(var(--admin-fg))" }}>
              Drop files here or click to upload
            </p>
            <p className="text-sm" style={{ color: "hsl(var(--admin-muted-fg))" }}>
              Supports: JPG, PNG, GIF, WebP, SVG, MP4, WebM, PDF
            </p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*,application/pdf"
          onChange={handleFileChange}
          className="hidden"
          multiple
        />
      </div>

      {/* Media Grid */}
      {media && media.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.map((m: any) => (
            <div key={m.id} className="admin-card overflow-hidden group relative">
              <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                {m.type === "image" || !m.type ? (
                  <img 
                    src={m.url} 
                    alt={m.alt_text || m.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <FolderOpen size={32} style={{ color: "hsl(var(--admin-muted-fg))" }} />
                    <span className="text-xs mt-1" style={{ color: "hsl(var(--admin-muted-fg))" }}>{m.type}</span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-xs truncate font-medium" style={{ color: "hsl(var(--admin-fg))" }}>{m.name}</p>
                <p className="text-xs" style={{ color: "hsl(var(--admin-muted-fg))" }}>
                  {m.size ? `${(m.size / 1024).toFixed(1)} KB` : new Date(m.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <a 
                  href={m.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2 bg-white rounded-full hover:bg-gray-100"
                  title="Open"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={16} />
                </a>
                <button 
                  onClick={(e) => { e.stopPropagation(); copyUrl(m.url); }} 
                  className="p-2 bg-white rounded-full hover:bg-gray-100"
                  title="Copy URL"
                >
                  <Copy size={16} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDelete(m.id); }} 
                  className="p-2 bg-white rounded-full hover:bg-gray-100 text-red-500"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-card p-12 text-center">
          <Image size={48} className="mx-auto mb-4" style={{ color: "hsl(var(--admin-muted-fg))" }} />
          <p style={{ color: "hsl(var(--admin-muted-fg))" }}>No media yet.</p>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--admin-muted-fg))" }}>
            Drag and drop files above or click to upload.
          </p>
        </div>
      )}
    </div>
  );
}