import { useState, useRef } from "react";
import { Upload, X, FileText, Loader2, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  accept?: string;
  bucket?: string;
  folder?: string;
  className?: string;
  placeholder?: string;
  showDownload?: boolean;
}

export function FileUpload({
  value,
  onChange,
  onRemove,
  accept = ".pdf,.doc,.docx",
  bucket = "media",
  folder = "documents",
  className = "",
  placeholder = "Upload file",
  showDownload = true
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadFile = async (file: File) => {
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      onChange(publicUrl);
      toast({ title: "File uploaded successfully!" });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const getFileName = (url: string) => {
    try {
      const parts = url.split('/');
      return parts[parts.length - 1].split('-').slice(1).join('-') || 'document';
    } catch {
      return 'document';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {value ? (
        <div className="flex items-center gap-3 p-4 rounded-lg" style={{ border: "1px solid hsl(var(--admin-border))", background: "hsl(var(--admin-muted))" }}>
          <FileText size={24} className="text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: "hsl(var(--admin-fg))" }}>{getFileName(value)}</p>
            <p className="text-xs" style={{ color: "hsl(var(--admin-muted-fg))" }}>File uploaded</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {showDownload && (
              <a
                href={value}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                style={{ border: "1px solid hsl(var(--admin-border))" }}
              >
                <Download size={16} style={{ color: "hsl(var(--admin-fg))" }} />
              </a>
            )}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
              style={{ border: "1px solid hsl(var(--admin-border))" }}
            >
              <Upload size={16} style={{ color: "hsl(var(--admin-fg))" }} />
            </button>
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                style={{ border: "1px solid hsl(var(--admin-border))" }}
              >
                <X size={16} className="text-red-500" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            flex flex-col items-center justify-center h-24 border-2 border-dashed rounded-lg cursor-pointer transition-all
            ${dragOver ? "border-primary bg-primary/5" : "hover:border-primary/50 hover:bg-gray-50"}
          `}
          style={{ borderColor: dragOver ? undefined : "hsl(var(--admin-border))" }}
        >
          {uploading ? (
            <Loader2 size={24} className="animate-spin" style={{ color: "hsl(var(--admin-muted-fg))" }} />
          ) : (
            <>
              <FileText size={24} className="mb-2" style={{ color: "hsl(var(--admin-muted-fg))" }} />
              <p className="text-sm text-center px-4" style={{ color: "hsl(var(--admin-muted-fg))" }}>{placeholder}</p>
            </>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
