import { useState } from "react";
import { useProfile, useUpdateProfile, useSiteSettings, useUpdateSiteSettings, useAllServices, useUpdateService, useAllProjects, useUpdateProject, useAllExperiences, useUpdateExperience, useAllTestimonials, useUpdateTestimonial, useAllPosts, useUpdatePost } from "@/hooks/usePortfolioData";
import { useToast } from "@/hooks/use-toast";
import { Save, FileText, Eye, ChevronRight, ArrowLeft, Loader2, Edit2, X } from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";

const pages = [
  { id: "home", name: "Home Page", description: "Hero section, stats, featured content" },
  { id: "about", name: "About Page", description: "Bio, education, experience, skills" },
  { id: "services", name: "Services Page", description: "All services with details" },
  { id: "portfolio", name: "Portfolio Page", description: "Project showcase & details" },
  { id: "contact", name: "Contact Page", description: "Contact form, info & social links" },
  { id: "experience", name: "Experience Page", description: "Work timeline & skills" },
  { id: "testimonials", name: "Testimonials Page", description: "Client reviews & ratings" },
  { id: "blog", name: "Blog Page", description: "Blog posts & articles" },
];

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="admin-card-bordered p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4" style={{ color: "hsl(var(--admin-fg))" }}>{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="admin-label">{label}</label>{children}</div>;
}

function HomePageEditor() {
  const { data: profile, isLoading: pl } = useProfile();
  const { data: settings, isLoading: sl } = useSiteSettings();
  const updateProfile = useUpdateProfile();
  const updateSettings = useUpdateSiteSettings();
  const { toast } = useToast();
  const [form, setForm] = useState<any>({});
  const [settingsForm, setSettingsForm] = useState<any>({});
  const [initialized, setInitialized] = useState(false);

  if (profile && settings && !initialized) {
    setForm(profile);
    setSettingsForm(settings);
    setInitialized(true);
  }

  if (pl || sl) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin" size={32} /></div>;

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync(form);
      await updateSettings.mutateAsync(settingsForm);
      toast({ title: "Home page updated!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const socialLinks = settingsForm.social_links || {};

  return (
    <div className="space-y-0">
      <SectionCard title="Hero Section">
        <div className="space-y-4">
          <Field label="Hero Avatar">
            <ImageUpload value={form.avatar_url} onChange={(url) => setForm({ ...form, avatar_url: url })} onRemove={() => setForm({ ...form, avatar_url: "" })} folder="avatars" />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Name / Heading">
              <input type="text" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className="admin-input-bordered" />
            </Field>
            <Field label="Professional Title">
              <input type="text" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} className="admin-input-bordered" />
            </Field>
          </div>
          <Field label="Short Bio (Hero subtitle)">
            <textarea rows={3} value={form.short_bio || ""} onChange={(e) => setForm({ ...form, short_bio: e.target.value })} className="admin-input-bordered resize-none" />
          </Field>
          <Field label="Experience Start Year (for stats)">
            <input type="number" value={form.experience_start_year || ""} onChange={(e) => setForm({ ...form, experience_start_year: parseInt(e.target.value) || null })} className="admin-input-bordered" placeholder="2020" />
          </Field>
          <Field label="Resume URL">
            <input type="text" value={form.resume_url || ""} onChange={(e) => setForm({ ...form, resume_url: e.target.value })} className="admin-input-bordered" placeholder="https://..." />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Site Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Site Name">
            <input type="text" value={settingsForm.site_name || ""} onChange={(e) => setSettingsForm({ ...settingsForm, site_name: e.target.value })} className="admin-input-bordered" />
          </Field>
          <Field label="Tagline">
            <input type="text" value={settingsForm.tagline || ""} onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })} className="admin-input-bordered" />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Footer Text">
            <input type="text" value={settingsForm.footer_text || ""} onChange={(e) => setSettingsForm({ ...settingsForm, footer_text: e.target.value })} className="admin-input-bordered" />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Social Links">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="LinkedIn URL">
            <input type="text" value={socialLinks.linkedin || ""} onChange={(e) => setSettingsForm({ ...settingsForm, social_links: { ...socialLinks, linkedin: e.target.value } })} className="admin-input-bordered" placeholder="https://linkedin.com/in/..." />
          </Field>
          <Field label="GitHub URL">
            <input type="text" value={socialLinks.github || ""} onChange={(e) => setSettingsForm({ ...settingsForm, social_links: { ...socialLinks, github: e.target.value } })} className="admin-input-bordered" placeholder="https://github.com/..." />
          </Field>
          <Field label="Twitter / X URL">
            <input type="text" value={socialLinks.twitter || ""} onChange={(e) => setSettingsForm({ ...settingsForm, social_links: { ...socialLinks, twitter: e.target.value } })} className="admin-input-bordered" placeholder="https://x.com/..." />
          </Field>
          <Field label="WhatsApp Number">
            <input type="text" value={socialLinks.whatsapp || ""} onChange={(e) => setSettingsForm({ ...settingsForm, social_links: { ...socialLinks, whatsapp: e.target.value } })} className="admin-input-bordered" placeholder="+923..." />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Menu Visibility">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["home", "about", "services", "portfolio", "experience", "blog", "contact"].map((item) => (
            <label key={item} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settingsForm.menu_items?.[item] ?? true}
                onChange={(e) => setSettingsForm({ ...settingsForm, menu_items: { ...settingsForm.menu_items, [item]: e.target.checked } })}
                className="rounded"
              />
              <span className="text-sm capitalize" style={{ color: "hsl(var(--admin-fg))" }}>{item}</span>
            </label>
          ))}
        </div>
      </SectionCard>

      <button onClick={handleSave} disabled={updateProfile.isPending || updateSettings.isPending} className="admin-btn-bordered">
        <Save size={16} /> {updateProfile.isPending ? "Saving..." : "Save Home Page"}
      </button>
    </div>
  );
}

function AboutPageEditor() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();
  const [form, setForm] = useState<any>({});
  const [initialized, setInitialized] = useState(false);

  if (profile && !initialized) { setForm(profile); setInitialized(true); }
  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin" size={32} /></div>;

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync(form);
      toast({ title: "About page updated!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-0">
      <SectionCard title="Profile Info">
        <div className="space-y-4">
          <Field label="Avatar">
            <ImageUpload value={form.avatar_url} onChange={(url) => setForm({ ...form, avatar_url: url })} onRemove={() => setForm({ ...form, avatar_url: "" })} folder="avatars" />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Full Name">
              <input type="text" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className="admin-input-bordered" />
            </Field>
            <Field label="Professional Title">
              <input type="text" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} className="admin-input-bordered" />
            </Field>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="About Content">
        <div className="space-y-4">
          <Field label="Full Bio">
            <textarea rows={8} value={form.bio || ""} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="admin-input-bordered resize-none" placeholder="Write your full biography..." />
          </Field>
          <Field label="Short Bio">
            <textarea rows={2} value={form.short_bio || ""} onChange={(e) => setForm({ ...form, short_bio: e.target.value })} className="admin-input-bordered resize-none" />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Personal Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Education">
            <input type="text" value={form.education || ""} onChange={(e) => setForm({ ...form, education: e.target.value })} className="admin-input-bordered" />
          </Field>
          <Field label="Location">
            <input type="text" value={form.location || ""} onChange={(e) => setForm({ ...form, location: e.target.value })} className="admin-input-bordered" />
          </Field>
          <Field label="Email">
            <input type="email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} className="admin-input-bordered" />
          </Field>
          <Field label="Phone">
            <input type="text" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="admin-input-bordered" />
          </Field>
          <Field label="Experience Start Year">
            <input type="number" value={form.experience_start_year || ""} onChange={(e) => setForm({ ...form, experience_start_year: parseInt(e.target.value) || null })} className="admin-input-bordered" />
          </Field>
          <Field label="Resume URL">
            <input type="text" value={form.resume_url || ""} onChange={(e) => setForm({ ...form, resume_url: e.target.value })} className="admin-input-bordered" />
          </Field>
        </div>
      </SectionCard>

      <button onClick={handleSave} disabled={updateProfile.isPending} className="admin-btn-bordered">
        <Save size={16} /> Save About Page
      </button>
    </div>
  );
}

function ServicesPageEditor() {
  const { data: services, isLoading } = useAllServices();
  const updateService = useUpdateService();
  const { toast } = useToast();
  const [editing, setEditing] = useState<any>(null);

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin" size={32} /></div>;

  const handleSave = async () => {
    if (!editing) return;
    try {
      await updateService.mutateAsync(editing);
      toast({ title: "Service updated!" });
      setEditing(null);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      {services?.map((s: any) => (
        <div key={s.id} className="admin-card-bordered p-5">
          {editing?.id === s.id ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Title">
                  <input type="text" value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="admin-input-bordered" />
                </Field>
                <Field label="Icon Name">
                  <input type="text" value={editing.icon || ""} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} className="admin-input-bordered" placeholder="Code, Layout, Zap, etc." />
                </Field>
              </div>
              <Field label="Short Description">
                <textarea rows={2} value={editing.short_description || ""} onChange={(e) => setEditing({ ...editing, short_description: e.target.value })} className="admin-input-bordered resize-none" />
              </Field>
              <Field label="Full Description">
                <textarea rows={4} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="admin-input-bordered resize-none" />
              </Field>
              <Field label="Highlights (one per line)">
                <textarea rows={4} value={(editing.highlights || []).join("\n")} onChange={(e) => setEditing({ ...editing, highlights: e.target.value.split("\n").filter(Boolean) })} className="admin-input-bordered resize-none" placeholder="Custom Theme Development&#10;Plugin Development" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Display Order">
                  <input type="number" value={editing.display_order || ""} onChange={(e) => setEditing({ ...editing, display_order: parseInt(e.target.value) || null })} className="admin-input-bordered" />
                </Field>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer mb-2">
                    <input type="checkbox" checked={editing.published ?? true} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} className="rounded" />
                    <span className="text-sm" style={{ color: "hsl(var(--admin-fg))" }}>Published</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={handleSave} className="admin-btn"><Save size={16} /> Save</button>
                <button onClick={() => setEditing(null)} className="admin-btn-outline">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setEditing({ ...s })}>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold" style={{ color: "hsl(var(--admin-fg))" }}>{s.title}</h4>
                  {!s.published && <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">Draft</span>}
                </div>
                <p className="text-sm" style={{ color: "hsl(var(--admin-muted-fg))" }}>{s.short_description}</p>
              </div>
              <Edit2 size={16} style={{ color: "hsl(var(--admin-muted-fg))" }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function PortfolioPageEditor() {
  const { data: projects, isLoading } = useAllProjects();
  const updateProject = useUpdateProject();
  const { toast } = useToast();
  const [editing, setEditing] = useState<any>(null);

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin" size={32} /></div>;

  const handleSave = async () => {
    if (!editing) return;
    try {
      await updateProject.mutateAsync(editing);
      toast({ title: "Project updated!" });
      setEditing(null);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      {projects?.map((p: any) => (
        <div key={p.id} className="admin-card-bordered p-5">
          {editing?.id === p.id ? (
            <div className="space-y-4">
              <Field label="Thumbnail">
                <ImageUpload value={editing.thumbnail_url} onChange={(url) => setEditing({ ...editing, thumbnail_url: url })} onRemove={() => setEditing({ ...editing, thumbnail_url: "" })} folder="projects" />
              </Field>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Title">
                  <input type="text" value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="admin-input-bordered" />
                </Field>
                <Field label="Slug">
                  <input type="text" value={editing.slug || ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="admin-input-bordered" />
                </Field>
              </div>
              <Field label="Short Description">
                <textarea rows={2} value={editing.short_description || ""} onChange={(e) => setEditing({ ...editing, short_description: e.target.value })} className="admin-input-bordered resize-none" />
              </Field>
              <Field label="Full Description">
                <textarea rows={4} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="admin-input-bordered resize-none" />
              </Field>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Industry">
                  <input type="text" value={editing.industry || ""} onChange={(e) => setEditing({ ...editing, industry: e.target.value })} className="admin-input-bordered" />
                </Field>
                <Field label="Country">
                  <input type="text" value={editing.country || ""} onChange={(e) => setEditing({ ...editing, country: e.target.value })} className="admin-input-bordered" />
                </Field>
                <Field label="Website URL">
                  <input type="text" value={editing.website_url || ""} onChange={(e) => setEditing({ ...editing, website_url: e.target.value })} className="admin-input-bordered" />
                </Field>
              </div>
              <Field label="Tech Stack (one per line)">
                <textarea rows={3} value={(editing.tech_stack || []).join("\n")} onChange={(e) => setEditing({ ...editing, tech_stack: e.target.value.split("\n").filter(Boolean) })} className="admin-input-bordered resize-none" />
              </Field>
              <Field label="Services Provided (one per line)">
                <textarea rows={3} value={(editing.services_provided || []).join("\n")} onChange={(e) => setEditing({ ...editing, services_provided: e.target.value.split("\n").filter(Boolean) })} className="admin-input-bordered resize-none" />
              </Field>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Field label="Display Order">
                  <input type="number" value={editing.display_order || ""} onChange={(e) => setEditing({ ...editing, display_order: parseInt(e.target.value) || null })} className="admin-input-bordered" />
                </Field>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer mb-2">
                    <input type="checkbox" checked={editing.published ?? true} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} className="rounded" />
                    <span className="text-sm" style={{ color: "hsl(var(--admin-fg))" }}>Published</span>
                  </label>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer mb-2">
                    <input type="checkbox" checked={editing.featured ?? false} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} className="rounded" />
                    <span className="text-sm" style={{ color: "hsl(var(--admin-fg))" }}>Featured</span>
                  </label>
                </div>
                <Field label="Status">
                  <select value={editing.status || "active"} onChange={(e) => setEditing({ ...editing, status: e.target.value })} className="admin-input-bordered">
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </Field>
              </div>
              <div className="flex gap-3">
                <button onClick={handleSave} className="admin-btn"><Save size={16} /> Save</button>
                <button onClick={() => setEditing(null)} className="admin-btn-outline">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => setEditing({ ...p })}>
              {p.thumbnail_url && <img src={p.thumbnail_url} alt="" className="w-16 h-12 object-cover rounded-lg" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold" style={{ color: "hsl(var(--admin-fg))" }}>{p.title}</h4>
                  {p.featured && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">Featured</span>}
                  {!p.published && <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">Draft</span>}
                </div>
                <p className="text-sm truncate" style={{ color: "hsl(var(--admin-muted-fg))" }}>{p.short_description}</p>
              </div>
              <Edit2 size={16} style={{ color: "hsl(var(--admin-muted-fg))" }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ContactPageEditor() {
  const { data: settings, isLoading: sl } = useSiteSettings();
  const { data: profile, isLoading: pl } = useProfile();
  const updateSettings = useUpdateSiteSettings();
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();
  const [form, setForm] = useState<any>({});
  const [profileForm, setProfileForm] = useState<any>({});
  const [initialized, setInitialized] = useState(false);

  if (settings && profile && !initialized) { setForm(settings); setProfileForm(profile); setInitialized(true); }
  if (sl || pl) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin" size={32} /></div>;

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync(form);
      await updateProfile.mutateAsync(profileForm);
      toast({ title: "Contact page updated!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const socialLinks = form.social_links || {};

  return (
    <div className="space-y-0">
      <SectionCard title="Contact Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Contact Email">
            <input type="email" value={form.contact_email || ""} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} className="admin-input-bordered" />
          </Field>
          <Field label="Contact Phone">
            <input type="text" value={form.contact_phone || ""} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} className="admin-input-bordered" />
          </Field>
          <Field label="Location">
            <input type="text" value={profileForm.location || ""} onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })} className="admin-input-bordered" />
          </Field>
          <Field label="WhatsApp">
            <input type="text" value={socialLinks.whatsapp || ""} onChange={(e) => setForm({ ...form, social_links: { ...socialLinks, whatsapp: e.target.value } })} className="admin-input-bordered" />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Social Links">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="LinkedIn">
            <input type="text" value={socialLinks.linkedin || ""} onChange={(e) => setForm({ ...form, social_links: { ...socialLinks, linkedin: e.target.value } })} className="admin-input-bordered" />
          </Field>
          <Field label="GitHub">
            <input type="text" value={socialLinks.github || ""} onChange={(e) => setForm({ ...form, social_links: { ...socialLinks, github: e.target.value } })} className="admin-input-bordered" />
          </Field>
          <Field label="Twitter / X">
            <input type="text" value={socialLinks.twitter || ""} onChange={(e) => setForm({ ...form, social_links: { ...socialLinks, twitter: e.target.value } })} className="admin-input-bordered" />
          </Field>
        </div>
      </SectionCard>

      <button onClick={handleSave} disabled={updateSettings.isPending} className="admin-btn-bordered">
        <Save size={16} /> Save Contact Page
      </button>
    </div>
  );
}

function ExperiencePageEditor() {
  const { data: experiences, isLoading } = useAllExperiences();
  const updateExperience = useUpdateExperience();
  const { toast } = useToast();
  const [editing, setEditing] = useState<any>(null);

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin" size={32} /></div>;

  const handleSave = async () => {
    if (!editing) return;
    try {
      await updateExperience.mutateAsync(editing);
      toast({ title: "Experience updated!" });
      setEditing(null);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      {experiences?.map((exp: any) => (
        <div key={exp.id} className="admin-card-bordered p-5">
          {editing?.id === exp.id ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Role / Position">
                  <input type="text" value={editing.role || ""} onChange={(e) => setEditing({ ...editing, role: e.target.value })} className="admin-input-bordered" />
                </Field>
                <Field label="Company">
                  <input type="text" value={editing.company || ""} onChange={(e) => setEditing({ ...editing, company: e.target.value })} className="admin-input-bordered" />
                </Field>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Location">
                  <input type="text" value={editing.location || ""} onChange={(e) => setEditing({ ...editing, location: e.target.value })} className="admin-input-bordered" />
                </Field>
                <Field label="Start Date">
                  <input type="date" value={editing.start_date || ""} onChange={(e) => setEditing({ ...editing, start_date: e.target.value })} className="admin-input-bordered" />
                </Field>
                <Field label="End Date">
                  <input type="date" value={editing.end_date || ""} onChange={(e) => setEditing({ ...editing, end_date: e.target.value })} className="admin-input-bordered" disabled={editing.is_current} />
                </Field>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editing.is_current ?? false} onChange={(e) => setEditing({ ...editing, is_current: e.target.checked, end_date: e.target.checked ? null : editing.end_date })} className="rounded" />
                <span className="text-sm" style={{ color: "hsl(var(--admin-fg))" }}>Currently working here</span>
              </label>
              <Field label="Description">
                <textarea rows={4} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="admin-input-bordered resize-none" />
              </Field>
              <Field label="Highlights (one per line)">
                <textarea rows={3} value={(editing.highlights || []).join("\n")} onChange={(e) => setEditing({ ...editing, highlights: e.target.value.split("\n").filter(Boolean) })} className="admin-input-bordered resize-none" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Display Order">
                  <input type="number" value={editing.display_order || ""} onChange={(e) => setEditing({ ...editing, display_order: parseInt(e.target.value) || null })} className="admin-input-bordered" />
                </Field>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer mb-2">
                    <input type="checkbox" checked={editing.published ?? true} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} className="rounded" />
                    <span className="text-sm" style={{ color: "hsl(var(--admin-fg))" }}>Published</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={handleSave} className="admin-btn"><Save size={16} /> Save</button>
                <button onClick={() => setEditing(null)} className="admin-btn-outline">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setEditing({ ...exp })}>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold" style={{ color: "hsl(var(--admin-fg))" }}>{exp.role}</h4>
                  {exp.is_current && <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">Current</span>}
                </div>
                <p className="text-sm" style={{ color: "hsl(var(--admin-muted-fg))" }}>{exp.company} • {exp.location}</p>
              </div>
              <Edit2 size={16} style={{ color: "hsl(var(--admin-muted-fg))" }} />
            </div>
          )}
        </div>
      ))}
      {(!experiences || experiences.length === 0) && <p style={{ color: "hsl(var(--admin-muted-fg))" }}>No experiences added yet.</p>}
    </div>
  );
}

function TestimonialsPageEditor() {
  const { data: testimonials, isLoading } = useAllTestimonials();
  const updateTestimonial = useUpdateTestimonial();
  const { toast } = useToast();
  const [editing, setEditing] = useState<any>(null);

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin" size={32} /></div>;

  const handleSave = async () => {
    if (!editing) return;
    try {
      await updateTestimonial.mutateAsync(editing);
      toast({ title: "Testimonial updated!" });
      setEditing(null);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      {testimonials?.map((t: any) => (
        <div key={t.id} className="admin-card-bordered p-5">
          {editing?.id === t.id ? (
            <div className="space-y-4">
              <Field label="Avatar">
                <ImageUpload value={editing.avatar_url} onChange={(url) => setEditing({ ...editing, avatar_url: url })} onRemove={() => setEditing({ ...editing, avatar_url: "" })} folder="avatars" />
              </Field>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Client Name">
                  <input type="text" value={editing.client_name || ""} onChange={(e) => setEditing({ ...editing, client_name: e.target.value })} className="admin-input-bordered" />
                </Field>
                <Field label="Role">
                  <input type="text" value={editing.role || ""} onChange={(e) => setEditing({ ...editing, role: e.target.value })} className="admin-input-bordered" />
                </Field>
                <Field label="Company">
                  <input type="text" value={editing.company || ""} onChange={(e) => setEditing({ ...editing, company: e.target.value })} className="admin-input-bordered" />
                </Field>
              </div>
              <Field label="Testimonial Message">
                <textarea rows={4} value={editing.message || ""} onChange={(e) => setEditing({ ...editing, message: e.target.value })} className="admin-input-bordered resize-none" />
              </Field>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Rating (1-5)">
                  <input type="number" min={1} max={5} value={editing.rating || 5} onChange={(e) => setEditing({ ...editing, rating: parseInt(e.target.value) || 5 })} className="admin-input-bordered" />
                </Field>
                <Field label="Display Order">
                  <input type="number" value={editing.display_order || ""} onChange={(e) => setEditing({ ...editing, display_order: parseInt(e.target.value) || null })} className="admin-input-bordered" />
                </Field>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer mb-2">
                    <input type="checkbox" checked={editing.published ?? true} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} className="rounded" />
                    <span className="text-sm" style={{ color: "hsl(var(--admin-fg))" }}>Published</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={handleSave} className="admin-btn"><Save size={16} /> Save</button>
                <button onClick={() => setEditing(null)} className="admin-btn-outline">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setEditing({ ...t })}>
              <div className="flex items-center gap-3">
                {t.avatar_url ? <img src={t.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">{t.client_name?.charAt(0)}</div>}
                <div>
                  <h4 className="font-semibold" style={{ color: "hsl(var(--admin-fg))" }}>{t.client_name}</h4>
                  <p className="text-sm" style={{ color: "hsl(var(--admin-muted-fg))" }}>{t.role}, {t.company}</p>
                </div>
              </div>
              <Edit2 size={16} style={{ color: "hsl(var(--admin-muted-fg))" }} />
            </div>
          )}
        </div>
      ))}
      {(!testimonials || testimonials.length === 0) && <p style={{ color: "hsl(var(--admin-muted-fg))" }}>No testimonials added yet.</p>}
    </div>
  );
}

function BlogPageEditor() {
  const { data: posts, isLoading } = useAllPosts();
  const updatePost = useUpdatePost();
  const { toast } = useToast();
  const [editing, setEditing] = useState<any>(null);

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin" size={32} /></div>;

  const handleSave = async () => {
    if (!editing) return;
    try {
      await updatePost.mutateAsync(editing);
      toast({ title: "Post updated!" });
      setEditing(null);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      {posts?.map((post: any) => (
        <div key={post.id} className="admin-card-bordered p-5">
          {editing?.id === post.id ? (
            <div className="space-y-4">
              <Field label="Cover Image">
                <ImageUpload value={editing.cover_image} onChange={(url) => setEditing({ ...editing, cover_image: url })} onRemove={() => setEditing({ ...editing, cover_image: "" })} folder="posts" />
              </Field>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Title">
                  <input type="text" value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="admin-input-bordered" />
                </Field>
                <Field label="Slug">
                  <input type="text" value={editing.slug || ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="admin-input-bordered" />
                </Field>
              </div>
              <Field label="Excerpt">
                <textarea rows={2} value={editing.excerpt || ""} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} className="admin-input-bordered resize-none" />
              </Field>
              <Field label="Content">
                <textarea rows={10} value={editing.content || ""} onChange={(e) => setEditing({ ...editing, content: e.target.value })} className="admin-input-bordered resize-none font-mono text-sm" />
              </Field>
              <Field label="Tags (one per line)">
                <textarea rows={2} value={(editing.tags || []).join("\n")} onChange={(e) => setEditing({ ...editing, tags: e.target.value.split("\n").filter(Boolean) })} className="admin-input-bordered resize-none" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Publish Date">
                  <input type="datetime-local" value={editing.published_at ? editing.published_at.slice(0, 16) : ""} onChange={(e) => setEditing({ ...editing, published_at: e.target.value })} className="admin-input-bordered" />
                </Field>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer mb-2">
                    <input type="checkbox" checked={editing.published ?? false} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} className="rounded" />
                    <span className="text-sm" style={{ color: "hsl(var(--admin-fg))" }}>Published</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={handleSave} className="admin-btn"><Save size={16} /> Save</button>
                <button onClick={() => setEditing(null)} className="admin-btn-outline">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => setEditing({ ...post })}>
              {post.cover_image && <img src={post.cover_image} alt="" className="w-16 h-12 object-cover rounded-lg" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold" style={{ color: "hsl(var(--admin-fg))" }}>{post.title}</h4>
                  {!post.published && <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">Draft</span>}
                </div>
                <p className="text-sm truncate" style={{ color: "hsl(var(--admin-muted-fg))" }}>{post.excerpt || "No excerpt"}</p>
              </div>
              <Edit2 size={16} style={{ color: "hsl(var(--admin-muted-fg))" }} />
            </div>
          )}
        </div>
      ))}
      {(!posts || posts.length === 0) && <p style={{ color: "hsl(var(--admin-muted-fg))" }}>No blog posts yet.</p>}
    </div>
  );
}

const editorComponents: Record<string, React.FC> = {
  home: HomePageEditor,
  about: AboutPageEditor,
  services: ServicesPageEditor,
  portfolio: PortfolioPageEditor,
  contact: ContactPageEditor,
  experience: ExperiencePageEditor,
  testimonials: TestimonialsPageEditor,
  blog: BlogPageEditor,
};

export default function AdminPages() {
  const [selectedPage, setSelectedPage] = useState<string | null>(null);

  if (selectedPage) {
    const Editor = editorComponents[selectedPage];
    const page = pages.find((p) => p.id === selectedPage);
    return (
      <div>
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => setSelectedPage(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-display font-bold" style={{ color: "hsl(var(--admin-fg))" }}>
              {page?.name}
            </h1>
            <p className="text-sm" style={{ color: "hsl(var(--admin-muted-fg))" }}>
              Edit content that appears on the live website
            </p>
          </div>
          <a href={`/${selectedPage === "home" ? "" : selectedPage}`} target="_blank" rel="noopener noreferrer" className="ml-auto admin-btn-outline">
            <Eye size={16} /> Preview
          </a>
        </div>
        <Editor />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold" style={{ color: "hsl(var(--admin-fg))" }}>Pages</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pages.map((page) => (
          <div
            key={page.id}
            onClick={() => setSelectedPage(page.id)}
            className="admin-card-bordered p-6 cursor-pointer hover:border-gray-400 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <FileText size={24} style={{ color: "hsl(var(--admin-muted-fg))" }} />
              <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "hsl(var(--admin-muted-fg))" }} />
            </div>
            <h3 className="font-semibold mb-1" style={{ color: "hsl(var(--admin-fg))" }}>{page.name}</h3>
            <p className="text-sm" style={{ color: "hsl(var(--admin-muted-fg))" }}>{page.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
