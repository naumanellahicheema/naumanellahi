import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { useProfile, useExperiences, useSkills } from "@/hooks/usePortfolioData";
import { MapPin, Mail, Phone, Calendar, GraduationCap, Briefcase } from "lucide-react";

export default function About() {
  const { data: profile } = useProfile();
  const { data: experiences } = useExperiences();
  const { data: skills } = useSkills();

  const yearsOfExperience = profile?.experience_start_year ? new Date().getFullYear() - profile.experience_start_year : 5;

  return (
    <Layout>
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="section-title">About Me</h1>
            <p className="section-subtitle mx-auto">Get to know more about my journey and expertise.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Profile Card */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-1">
              <div className="glass-card p-8 sticky top-32">
                <div className="w-32 h-32 mx-auto rounded-full bg-secondary flex items-center justify-center mb-6 overflow-hidden">
                  {profile?.avatar_url ? <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" /> : <span className="text-4xl font-display font-bold">{profile?.name?.charAt(0) || "N"}</span>}
                </div>
                <h2 className="text-2xl font-display font-bold text-center mb-2">{profile?.name || "Nauman Ellahi"}</h2>
                <p className="text-muted-foreground text-center mb-6">{profile?.title || "WordPress & Frontend Developer"}</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm"><MapPin size={18} className="text-muted-foreground" /><span>{profile?.location || "Pakistan"}</span></div>
                  <div className="flex items-center gap-3 text-sm"><Mail size={18} className="text-muted-foreground" /><span>{profile?.email}</span></div>
                  <div className="flex items-center gap-3 text-sm"><Phone size={18} className="text-muted-foreground" /><span>{profile?.phone}</span></div>
                  <div className="flex items-center gap-3 text-sm"><Calendar size={18} className="text-muted-foreground" /><span>{yearsOfExperience}+ Years Experience</span></div>
                  <div className="flex items-center gap-3 text-sm"><GraduationCap size={18} className="text-muted-foreground" /><span>{profile?.education}</span></div>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 space-y-12">
              {/* Bio */}
              <div>
                <h3 className="text-2xl font-display font-bold mb-4">My Story</h3>
                <p className="text-muted-foreground leading-relaxed">{profile?.bio || "I am a passionate web developer with expertise in WordPress and modern frontend technologies. My journey in web development started in 2020, and since then, I have been dedicated to creating exceptional digital experiences for clients worldwide."}</p>
              </div>

              {/* Experience */}
              <div>
                <h3 className="text-2xl font-display font-bold mb-6">Work Experience</h3>
                <div className="space-y-6">
                  {experiences?.map((exp: any) => (
                    <div key={exp.id} className="glass-card p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0"><Briefcase size={20} /></div>
                        <div className="flex-grow">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                            <h4 className="text-lg font-semibold">{exp.role}</h4>
                            <span className="text-sm text-muted-foreground">{new Date(exp.start_date).getFullYear()} - {exp.is_current ? "Present" : exp.end_date ? new Date(exp.end_date).getFullYear() : ""}</span>
                          </div>
                          <p className="text-muted-foreground mb-2">{exp.company} • {exp.location}</p>
                          {exp.description && <p className="text-sm text-muted-foreground">{exp.description}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-2xl font-display font-bold mb-6">Skills & Technologies</h3>
                <div className="flex flex-wrap gap-3">
                  {skills?.map((skill: any) => (
                    <span key={skill.id} className="px-4 py-2 bg-secondary rounded-full text-sm font-medium">{skill.name}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}