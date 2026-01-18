import { useState, useEffect } from "react";
import { useProfile, useUpdateProfile } from "@/hooks/usePortfolioData";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

export default function AdminProfile() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();
  const [form, setForm] = useState<any>({});

  useEffect(() => { if (profile) setForm(profile); }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync(form);
      toast({ title: "Profile updated successfully!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold" style={{ color: "hsl(var(--admin-fg))" }}>Profile</h1>
      </div>
      <form onSubmit={handleSubmit} className="admin-card p-6 space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><label className="admin-label">Name</label><input type="text" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className="admin-input" /></div>
          <div><label className="admin-label">Title</label><input type="text" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} className="admin-input" /></div>
          <div><label className="admin-label">Email</label><input type="email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} className="admin-input" /></div>
          <div><label className="admin-label">Phone</label><input type="text" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="admin-input" /></div>
          <div><label className="admin-label">Location</label><input type="text" value={form.location || ""} onChange={(e) => setForm({ ...form, location: e.target.value })} className="admin-input" /></div>
          <div><label className="admin-label">Experience Start Year</label><input type="number" value={form.experience_start_year || ""} onChange={(e) => setForm({ ...form, experience_start_year: parseInt(e.target.value) })} className="admin-input" /></div>
        </div>
        <div><label className="admin-label">Education</label><input type="text" value={form.education || ""} onChange={(e) => setForm({ ...form, education: e.target.value })} className="admin-input" /></div>
        <div><label className="admin-label">Short Bio</label><input type="text" value={form.short_bio || ""} onChange={(e) => setForm({ ...form, short_bio: e.target.value })} className="admin-input" /></div>
        <div><label className="admin-label">Full Bio</label><textarea rows={5} value={form.bio || ""} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="admin-input" /></div>
        <div><label className="admin-label">Avatar URL</label><input type="url" value={form.avatar_url || ""} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} className="admin-input" /></div>
        <div><label className="admin-label">Resume URL</label><input type="url" value={form.resume_url || ""} onChange={(e) => setForm({ ...form, resume_url: e.target.value })} className="admin-input" /></div>
        <button type="submit" disabled={updateProfile.isPending} className="admin-btn"><Save size={16} /> {updateProfile.isPending ? "Saving..." : "Save Changes"}</button>
      </form>
    </div>
  );
}