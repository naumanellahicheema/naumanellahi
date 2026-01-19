import { useState, useEffect, useCallback } from "react";
import { useSiteSettings, useUpdateSiteSettings } from "@/hooks/usePortfolioData";
import { useToast } from "@/hooks/use-toast";
import { Save, Globe, Mail, Phone, Type, Image, Link2, Menu, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";

const defaultMenuItems = { home: true, about: true, portfolio: true, services: true, experience: true, blog: true, contact: true };
const defaultSocialLinks: Record<string, { url: string; visible: boolean }> = {};

export default function AdminSettings() {
  const { data: settings, isLoading, error } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();
  const { toast } = useToast();
  const [form, setForm] = useState<any>({});
  const [newSocialKey, setNewSocialKey] = useState("");

  useEffect(() => {
    if (settings) {
      setForm({
        ...settings,
        menu_items: settings.menu_items || defaultMenuItems,
        social_links: settings.social_links || {}
      });
    }
  }, [settings]);

  const handleFieldChange = useCallback((field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  }, []);

  const handleMenuToggle = (key: string) => {
    setForm((prev: any) => ({
      ...prev,
      menu_items: { ...prev.menu_items, [key]: !prev.menu_items?.[key] }
    }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setForm((prev: any) => ({
      ...prev,
      social_links: { ...prev.social_links, [platform]: value }
    }));
  };

  const removeSocialLink = (platform: string) => {
    setForm((prev: any) => {
      const newLinks = { ...prev.social_links };
      delete newLinks[platform];
      return { ...prev, social_links: newLinks };
    });
  };

  const addSocialLink = () => {
    if (!newSocialKey.trim()) return;
    const key = newSocialKey.toLowerCase().replace(/\s+/g, "_");
    handleSocialChange(key, "");
    setNewSocialKey("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings.mutateAsync(form);
      toast({ title: "Settings saved successfully!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  if (isLoading) return <div className="flex items-center justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-current border-t-transparent rounded-full" /></div>;
  if (error) return <div className="text-center py-20" style={{ color: "hsl(var(--admin-muted-fg))" }}>Error loading settings.</div>;

  const menuLabels: Record<string, string> = { home: "Home", about: "About", portfolio: "Portfolio", services: "Services", experience: "Experience", blog: "Blog", contact: "Contact" };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold" style={{ color: "hsl(var(--admin-fg))" }}>Site Settings</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
        {/* General */}
        <div className="admin-card p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2"><Globe size={20} /> General</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="admin-label">Site Name</label><input type="text" value={form.site_name || ""} onChange={(e) => handleFieldChange("site_name", e.target.value)} className="admin-input" /></div>
            <div><label className="admin-label">Tagline</label><input type="text" value={form.tagline || ""} onChange={(e) => handleFieldChange("tagline", e.target.value)} className="admin-input" /></div>
          </div>
        </div>

        {/* Branding with Upload */}
        <div className="admin-card p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2"><Image size={20} /> Branding</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="admin-label">Logo</label><ImageUpload value={form.logo_url} onChange={(url) => handleFieldChange("logo_url", url)} onRemove={() => handleFieldChange("logo_url", "")} folder="branding" placeholder="Upload logo" /></div>
            <div><label className="admin-label">Favicon</label><ImageUpload value={form.favicon_url} onChange={(url) => handleFieldChange("favicon_url", url)} onRemove={() => handleFieldChange("favicon_url", "")} folder="branding" placeholder="Upload favicon" /></div>
          </div>
        </div>

        {/* Menu Visibility */}
        <div className="admin-card p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2"><Menu size={20} /> Menu Items</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(menuLabels).map(([key, label]) => (
              <label key={key} className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50" style={{ borderColor: "hsl(var(--admin-border))" }}>
                <input type="checkbox" checked={form.menu_items?.[key] !== false} onChange={() => handleMenuToggle(key)} className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
                {form.menu_items?.[key] !== false ? <Eye size={14} className="ml-auto text-green-600" /> : <EyeOff size={14} className="ml-auto text-gray-400" />}
              </label>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="admin-card p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2"><Mail size={20} /> Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="admin-label">Email</label><input type="email" value={form.contact_email || ""} onChange={(e) => handleFieldChange("contact_email", e.target.value)} className="admin-input" /></div>
            <div><label className="admin-label">Phone</label><input type="text" value={form.contact_phone || ""} onChange={(e) => handleFieldChange("contact_phone", e.target.value)} className="admin-input" /></div>
          </div>
        </div>

        {/* SEO */}
        <div className="admin-card p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2"><Type size={20} /> SEO</h2>
          <div className="space-y-4">
            <div><label className="admin-label">Meta Title</label><input type="text" value={form.meta_title || ""} onChange={(e) => handleFieldChange("meta_title", e.target.value)} className="admin-input" /></div>
            <div><label className="admin-label">Meta Description</label><textarea rows={3} value={form.meta_description || ""} onChange={(e) => handleFieldChange("meta_description", e.target.value)} className="admin-input resize-none" /></div>
            <div><label className="admin-label">Footer Text</label><input type="text" value={form.footer_text || ""} onChange={(e) => handleFieldChange("footer_text", e.target.value)} className="admin-input" /></div>
          </div>
        </div>

        {/* Social Links with Add/Remove */}
        <div className="admin-card p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2"><Link2 size={20} /> Social Links</h2>
          <div className="space-y-4">
            {Object.entries(form.social_links || {}).map(([platform, url]: [string, any]) => (
              <div key={platform} className="flex items-center gap-3">
                <span className="w-24 text-sm font-medium capitalize">{platform.replace("_", " ")}</span>
                <input type="text" value={url || ""} onChange={(e) => handleSocialChange(platform, e.target.value)} className="admin-input flex-1" placeholder={`https://${platform}.com/...`} />
                <button type="button" onClick={() => removeSocialLink(platform)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
              </div>
            ))}
            <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: "hsl(var(--admin-border))" }}>
              <input type="text" value={newSocialKey} onChange={(e) => setNewSocialKey(e.target.value)} className="admin-input flex-1" placeholder="New social platform name..." />
              <button type="button" onClick={addSocialLink} className="admin-btn-outline"><Plus size={16} /> Add</button>
            </div>
          </div>
        </div>

        <button type="submit" disabled={updateSettings.isPending} className="admin-btn">
          <Save size={16} /> {updateSettings.isPending ? "Saving..." : "Save All Settings"}
        </button>
      </form>
    </div>
  );
}