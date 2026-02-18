import { useState } from "react";
import { useProfile, useUpdateProfile, useSiteSettings, useUpdateSiteSettings, useAllServices, useUpdateService, useAllProjects, useUpdateProject } from "@/hooks/usePortfolioData";
import { useToast } from "@/hooks/use-toast";
import { Save, FileText, Eye, ChevronRight, ArrowLeft, Loader2 } from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";

const pages = [
  { id: "home", name: "Home Page", description: "Hero section, stats, featured content" },
  { id: "about", name: "About Page", description: "Bio, education, personal info" },
  { id: "services", name: "Services Page", description: "All services listings" },
  { id: "portfolio", name: "Portfolio Page", description: "Project showcase" },
  { id: "contact", name: "Contact Page", description: "Contact form and info" },
];

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

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="admin-card-bordered p-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: "hsl(var(--admin-fg))" }}>Hero Section</h3>
        <div className="space-y-4">
          <div>
            <label className="admin-label">Hero Avatar</label>
            <ImageUpload value={form.avatar_url} onChange={(url) => setForm({ ...form, avatar_url: url })} onRemove={() => setForm({ ...form, avatar_url: "" })} folder="avatars" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Name / Heading</label>
              <input type="text" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className="admin-input-bordered" />
            </div>
            <div>
              <label className="admin-label">Professional Title</label>
              <input type="text" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} className="admin-input-bordered" />
            </div>
          </div>
          <div>
            <label className="admin-label">Short Bio (Hero subtitle)</label>
            <textarea rows={3} value={form.short_bio || ""} onChange={(e) => setForm({ ...form, short_bio: e.target.value })} className="admin-input-bordered resize-none" />
          </div>
        </div>
      </div>

      {/* Site Info */}
      <div className="admin-card-bordered p-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: "hsl(var(--admin-fg))" }}>Site Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Site Name</label>
            <input type="text" value={settingsForm.site_name || ""} onChange={(e) => setSettingsForm({ ...settingsForm, site_name: e.target.value })} className="admin-input-bordered" />
          </div>
          <div>
            <label className="admin-label">Tagline</label>
            <input type="text" value={settingsForm.tagline || ""} onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })} className="admin-input-bordered" />
          </div>
        </div>
      </div>

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
    <div className="space-y-6">
      <div className="admin-card-bordered p-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: "hsl(var(--admin-fg))" }}>About Content</h3>
        <div className="space-y-4">
          <div>
            <label className="admin-label">Full Bio</label>
            <textarea rows={8} value={form.bio || ""} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="admin-input-bordered resize-none" placeholder="Write your full biography..." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Education</label>
              <input type="text" value={form.education || ""} onChange={(e) => setForm({ ...form, education: e.target.value })} className="admin-input-bordered" />
            </div>
            <div>
              <label className="admin-label">Location</label>
              <input type="text" value={form.location || ""} onChange={(e) => setForm({ ...form, location: e.target.value })} className="admin-input-bordered" />
            </div>
          </div>
        </div>
      </div>
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
              <div>
                <label className="admin-label">Title</label>
                <input type="text" value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="admin-input-bordered" />
              </div>
              <div>
                <label className="admin-label">Short Description</label>
                <textarea rows={2} value={editing.short_description || ""} onChange={(e) => setEditing({ ...editing, short_description: e.target.value })} className="admin-input-bordered resize-none" />
              </div>
              <div>
                <label className="admin-label">Full Description</label>
                <textarea rows={4} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="admin-input-bordered resize-none" />
              </div>
              <div className="flex gap-3">
                <button onClick={handleSave} className="admin-btn"><Save size={16} /> Save</button>
                <button onClick={() => setEditing(null)} className="admin-btn-outline">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setEditing({ ...s })}>
              <div>
                <h4 className="font-semibold" style={{ color: "hsl(var(--admin-fg))" }}>{s.title}</h4>
                <p className="text-sm" style={{ color: "hsl(var(--admin-muted-fg))" }}>{s.short_description}</p>
              </div>
              <ChevronRight size={18} style={{ color: "hsl(var(--admin-muted-fg))" }} />
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
              <div>
                <label className="admin-label">Thumbnail</label>
                <ImageUpload value={editing.thumbnail_url} onChange={(url) => setEditing({ ...editing, thumbnail_url: url })} onRemove={() => setEditing({ ...editing, thumbnail_url: "" })} folder="projects" />
              </div>
              <div>
                <label className="admin-label">Title</label>
                <input type="text" value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="admin-input-bordered" />
              </div>
              <div>
                <label className="admin-label">Short Description</label>
                <textarea rows={2} value={editing.short_description || ""} onChange={(e) => setEditing({ ...editing, short_description: e.target.value })} className="admin-input-bordered resize-none" />
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
                <h4 className="font-semibold" style={{ color: "hsl(var(--admin-fg))" }}>{p.title}</h4>
                <p className="text-sm truncate" style={{ color: "hsl(var(--admin-muted-fg))" }}>{p.short_description}</p>
              </div>
              <ChevronRight size={18} style={{ color: "hsl(var(--admin-muted-fg))" }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ContactPageEditor() {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();
  const { toast } = useToast();
  const [form, setForm] = useState<any>({});
  const [initialized, setInitialized] = useState(false);

  if (settings && !initialized) { setForm(settings); setInitialized(true); }
  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin" size={32} /></div>;

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync(form);
      toast({ title: "Contact page updated!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="admin-card-bordered p-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: "hsl(var(--admin-fg))" }}>Contact Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Contact Email</label>
            <input type="email" value={form.contact_email || ""} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} className="admin-input-bordered" />
          </div>
          <div>
            <label className="admin-label">Contact Phone</label>
            <input type="text" value={form.contact_phone || ""} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} className="admin-input-bordered" />
          </div>
        </div>
      </div>
      <button onClick={handleSave} disabled={updateSettings.isPending} className="admin-btn-bordered">
        <Save size={16} /> Save Contact Page
      </button>
    </div>
  );
}

const editorComponents: Record<string, React.FC> = {
  home: HomePageEditor,
  about: AboutPageEditor,
  services: ServicesPageEditor,
  portfolio: PortfolioPageEditor,
  contact: ContactPageEditor,
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
