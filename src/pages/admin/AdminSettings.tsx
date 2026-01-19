import { useState, useEffect, useCallback } from "react";
import { useSiteSettings, useUpdateSiteSettings } from "@/hooks/usePortfolioData";
import { useToast } from "@/hooks/use-toast";
import { Save, Globe, Mail, Phone, Type, Image, Link2 } from "lucide-react";

export default function AdminSettings() {
  const { data: settings, isLoading, error } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();
  const { toast } = useToast();
  const [form, setForm] = useState<any>({
    site_name: "",
    tagline: "",
    logo_url: "",
    favicon_url: "",
    contact_email: "",
    contact_phone: "",
    meta_title: "",
    meta_description: "",
    footer_text: "",
    social_links: {}
  });

  useEffect(() => {
    if (settings) {
      setForm({
        ...settings,
        social_links: settings.social_links || {}
      });
    }
  }, [settings]);

  const handleFieldChange = useCallback((field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  }, []);

  const handleSocialChange = useCallback((platform: string, value: string) => {
    setForm((prev: any) => ({
      ...prev,
      social_links: { ...prev.social_links, [platform]: value }
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings.mutateAsync(form);
      toast({ title: "Settings saved successfully!" });
    } catch (error: any) {
      console.error("Save error:", error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
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
        <p>Error loading settings. Please refresh the page.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold" style={{ color: "hsl(var(--admin-fg))" }}>Site Settings</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
        {/* General Settings */}
        <div className="admin-card p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2" style={{ color: "hsl(var(--admin-fg))" }}>
            <Globe size={20} /> General Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="admin-label">Site Name</label>
              <input
                type="text"
                value={form.site_name || ""}
                onChange={(e) => handleFieldChange("site_name", e.target.value)}
                className="admin-input"
                placeholder="Your Site Name"
              />
            </div>
            <div>
              <label className="admin-label">Tagline</label>
              <input
                type="text"
                value={form.tagline || ""}
                onChange={(e) => handleFieldChange("tagline", e.target.value)}
                className="admin-input"
                placeholder="Your tagline"
              />
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="admin-card p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2" style={{ color: "hsl(var(--admin-fg))" }}>
            <Image size={20} /> Branding
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="admin-label">Logo URL</label>
              <input
                type="url"
                value={form.logo_url || ""}
                onChange={(e) => handleFieldChange("logo_url", e.target.value)}
                className="admin-input"
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div>
              <label className="admin-label">Favicon URL</label>
              <input
                type="url"
                value={form.favicon_url || ""}
                onChange={(e) => handleFieldChange("favicon_url", e.target.value)}
                className="admin-input"
                placeholder="https://example.com/favicon.ico"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="admin-card p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2" style={{ color: "hsl(var(--admin-fg))" }}>
            <Mail size={20} /> Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="admin-label">Contact Email</label>
              <input
                type="email"
                value={form.contact_email || ""}
                onChange={(e) => handleFieldChange("contact_email", e.target.value)}
                className="admin-input"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="admin-label">Contact Phone</label>
              <input
                type="text"
                value={form.contact_phone || ""}
                onChange={(e) => handleFieldChange("contact_phone", e.target.value)}
                className="admin-input"
                placeholder="+1234567890"
              />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="admin-card p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2" style={{ color: "hsl(var(--admin-fg))" }}>
            <Type size={20} /> SEO Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="admin-label">Meta Title</label>
              <input
                type="text"
                value={form.meta_title || ""}
                onChange={(e) => handleFieldChange("meta_title", e.target.value)}
                className="admin-input"
                placeholder="Page title for search engines"
              />
            </div>
            <div>
              <label className="admin-label">Meta Description</label>
              <textarea
                rows={3}
                value={form.meta_description || ""}
                onChange={(e) => handleFieldChange("meta_description", e.target.value)}
                className="admin-input resize-none"
                placeholder="Brief description for search engines (max 160 characters)"
              />
            </div>
            <div>
              <label className="admin-label">Footer Text</label>
              <input
                type="text"
                value={form.footer_text || ""}
                onChange={(e) => handleFieldChange("footer_text", e.target.value)}
                className="admin-input"
                placeholder="© 2024 Your Name. All rights reserved."
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="admin-card p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2" style={{ color: "hsl(var(--admin-fg))" }}>
            <Link2 size={20} /> Social Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="admin-label">GitHub</label>
              <input
                type="url"
                value={form.social_links?.github || ""}
                onChange={(e) => handleSocialChange("github", e.target.value)}
                className="admin-input"
                placeholder="https://github.com/username"
              />
            </div>
            <div>
              <label className="admin-label">LinkedIn</label>
              <input
                type="url"
                value={form.social_links?.linkedin || ""}
                onChange={(e) => handleSocialChange("linkedin", e.target.value)}
                className="admin-input"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div>
              <label className="admin-label">Twitter / X</label>
              <input
                type="url"
                value={form.social_links?.twitter || ""}
                onChange={(e) => handleSocialChange("twitter", e.target.value)}
                className="admin-input"
                placeholder="https://twitter.com/username"
              />
            </div>
            <div>
              <label className="admin-label">Instagram</label>
              <input
                type="url"
                value={form.social_links?.instagram || ""}
                onChange={(e) => handleSocialChange("instagram", e.target.value)}
                className="admin-input"
                placeholder="https://instagram.com/username"
              />
            </div>
            <div>
              <label className="admin-label">YouTube</label>
              <input
                type="url"
                value={form.social_links?.youtube || ""}
                onChange={(e) => handleSocialChange("youtube", e.target.value)}
                className="admin-input"
                placeholder="https://youtube.com/@username"
              />
            </div>
            <div>
              <label className="admin-label">WhatsApp</label>
              <input
                type="text"
                value={form.social_links?.whatsapp || ""}
                onChange={(e) => handleSocialChange("whatsapp", e.target.value)}
                className="admin-input"
                placeholder="+1234567890"
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={updateSettings.isPending} 
          className="admin-btn"
        >
          <Save size={16} /> 
          {updateSettings.isPending ? "Saving..." : "Save All Settings"}
        </button>
      </form>
    </div>
  );
}
