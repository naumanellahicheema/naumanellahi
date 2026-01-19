import { useState, useEffect } from "react";
import { useProfile, useUpdateProfile } from "@/hooks/usePortfolioData";
import { useToast } from "@/hooks/use-toast";
import { Save, User, MapPin, Briefcase, GraduationCap, FileText } from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { FileUpload } from "@/components/ui/FileUpload";

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-current border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold" style={{ color: "hsl(var(--admin-fg))" }}>Profile</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
        {/* Avatar & Resume */}
        <div className="admin-card-bordered p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2" style={{ color: "hsl(var(--admin-fg))" }}>
            <User size={20} /> Profile Media
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="admin-label">Avatar</label>
              <ImageUpload 
                value={form.avatar_url} 
                onChange={(url) => setForm({ ...form, avatar_url: url })} 
                onRemove={() => setForm({ ...form, avatar_url: "" })} 
                folder="avatars" 
                placeholder="Upload profile photo" 
              />
            </div>
            <div>
              <label className="admin-label">Resume (PDF)</label>
              <FileUpload 
                value={form.resume_url} 
                onChange={(url) => setForm({ ...form, resume_url: url })} 
                onRemove={() => setForm({ ...form, resume_url: "" })} 
                folder="documents" 
                accept=".pdf"
                placeholder="Upload resume PDF" 
              />
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="admin-card-bordered p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2" style={{ color: "hsl(var(--admin-fg))" }}>
            <User size={20} /> Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="admin-label">Full Name</label>
              <input 
                type="text" 
                value={form.name || ""} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
                className="admin-input-bordered" 
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="admin-label">Professional Title</label>
              <input 
                type="text" 
                value={form.title || ""} 
                onChange={(e) => setForm({ ...form, title: e.target.value })} 
                className="admin-input-bordered" 
                placeholder="e.g. Senior Frontend Developer"
              />
            </div>
            <div>
              <label className="admin-label">Email Address</label>
              <input 
                type="email" 
                value={form.email || ""} 
                onChange={(e) => setForm({ ...form, email: e.target.value })} 
                className="admin-input-bordered" 
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="admin-label">Phone Number</label>
              <input 
                type="text" 
                value={form.phone || ""} 
                onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                className="admin-input-bordered" 
                placeholder="+1 234 567 890"
              />
            </div>
          </div>
        </div>

        {/* Location & Experience */}
        <div className="admin-card-bordered p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2" style={{ color: "hsl(var(--admin-fg))" }}>
            <MapPin size={20} /> Location & Experience
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="admin-label">Location</label>
              <input 
                type="text" 
                value={form.location || ""} 
                onChange={(e) => setForm({ ...form, location: e.target.value })} 
                className="admin-input-bordered" 
                placeholder="City, Country"
              />
            </div>
            <div>
              <label className="admin-label">Experience Start Year</label>
              <input 
                type="number" 
                value={form.experience_start_year || ""} 
                onChange={(e) => setForm({ ...form, experience_start_year: parseInt(e.target.value) })} 
                className="admin-input-bordered" 
                placeholder="2015"
              />
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="admin-card-bordered p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2" style={{ color: "hsl(var(--admin-fg))" }}>
            <GraduationCap size={20} /> Education
          </h2>
          <div>
            <label className="admin-label">Education Details</label>
            <input 
              type="text" 
              value={form.education || ""} 
              onChange={(e) => setForm({ ...form, education: e.target.value })} 
              className="admin-input-bordered" 
              placeholder="Bachelor's in Computer Science, XYZ University"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="admin-card-bordered p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2" style={{ color: "hsl(var(--admin-fg))" }}>
            <FileText size={20} /> Biography
          </h2>
          <div className="space-y-4">
            <div>
              <label className="admin-label">Short Bio (Tagline)</label>
              <input 
                type="text" 
                value={form.short_bio || ""} 
                onChange={(e) => setForm({ ...form, short_bio: e.target.value })} 
                className="admin-input-bordered" 
                placeholder="A brief one-liner about yourself"
              />
            </div>
            <div>
              <label className="admin-label">Full Bio</label>
              <textarea 
                rows={6} 
                value={form.bio || ""} 
                onChange={(e) => setForm({ ...form, bio: e.target.value })} 
                className="admin-input-bordered resize-none" 
                placeholder="Write a detailed biography about yourself, your experience, and what drives you..."
              />
            </div>
          </div>
        </div>

        <button type="submit" disabled={updateProfile.isPending} className="admin-btn-bordered">
          <Save size={16} /> {updateProfile.isPending ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
