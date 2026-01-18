import { useState, useEffect } from "react";
import { useSiteSettings, useUpdateSiteSettings } from "@/hooks/usePortfolioData";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

export default function AdminSettings() {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();
  const { toast } = useToast();
  const [form, setForm] = useState<any>({});

  useEffect(() => { if (settings) setForm({ ...settings, social_links: settings.social_links || {} }); }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await updateSettings.mutateAsync(form); toast({ title: "Settings updated!" }); } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold" style={{ color: "hsl(var(--admin-fg))" }}>Site Settings</h1>
      </div>
      <form onSubmit={handleSubmit} className="admin-card p-6 space-y-6 max-w-2xl">
        <div className="grid grid-cols-2 gap-6">
          <div><label className="admin-label">Site Name</label><input type="text" value={form.site_name || ""} onChange={(e) => setForm({ ...form, site_name: e.target.value })} className="admin-input" /></div>
          <div><label className="admin-label">Tagline</label><input type="text" value={form.tagline || ""} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="admin-input" /></div>
        </div>
        <div><label className="admin-label">Logo URL</label><input type="url" value={form.logo_url || ""} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} className="admin-input" /></div>
        <div className="grid grid-cols-2 gap-6">
          <div><label className="admin-label">Contact Email</label><input type="email" value={form.contact_email || ""} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} className="admin-input" /></div>
          <div><label className="admin-label">Contact Phone</label><input type="text" value={form.contact_phone || ""} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} className="admin-input" /></div>
        </div>
        <div><label className="admin-label">Meta Title</label><input type="text" value={form.meta_title || ""} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} className="admin-input" /></div>
        <div><label className="admin-label">Meta Description</label><textarea rows={3} value={form.meta_description || ""} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} className="admin-input" /></div>
        <div><label className="admin-label">Footer Text</label><input type="text" value={form.footer_text || ""} onChange={(e) => setForm({ ...form, footer_text: e.target.value })} className="admin-input" /></div>
        <h3 className="text-lg font-semibold pt-4" style={{ color: "hsl(var(--admin-fg))" }}>Social Links</h3>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="admin-label">GitHub</label><input type="url" value={form.social_links?.github || ""} onChange={(e) => setForm({ ...form, social_links: { ...form.social_links, github: e.target.value } })} className="admin-input" /></div>
          <div><label className="admin-label">LinkedIn</label><input type="url" value={form.social_links?.linkedin || ""} onChange={(e) => setForm({ ...form, social_links: { ...form.social_links, linkedin: e.target.value } })} className="admin-input" /></div>
          <div><label className="admin-label">Twitter</label><input type="url" value={form.social_links?.twitter || ""} onChange={(e) => setForm({ ...form, social_links: { ...form.social_links, twitter: e.target.value } })} className="admin-input" /></div>
          <div><label className="admin-label">Instagram</label><input type="url" value={form.social_links?.instagram || ""} onChange={(e) => setForm({ ...form, social_links: { ...form.social_links, instagram: e.target.value } })} className="admin-input" /></div>
        </div>
        <button type="submit" disabled={updateSettings.isPending} className="admin-btn"><Save size={16} /> {updateSettings.isPending ? "Saving..." : "Save Settings"}</button>
      </form>
    </div>
  );
}