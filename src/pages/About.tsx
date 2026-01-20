import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { useProfile, useExperiences, useSkills } from "@/hooks/usePortfolioData";
import { MapPin, Mail, Phone, Calendar, GraduationCap, Briefcase, CheckCircle } from "lucide-react";

export default function About() {
  const { data: profile } = useProfile();
  const { data: experiences } = useExperiences();
  const { data: skills } = useSkills();

  const yearsOfExperience = profile?.experience_start_year ? new Date().getFullYear() - profile.experience_start_year : 5;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Layout>
      <section className="pt-28 sm:pt-32 pb-16 sm:pb-20 px-5 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <span className="inline-block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">
              Get to Know Me
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
              About Me
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Passionate about building secure, user-friendly web applications.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Profile Card */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.2, duration: 0.6 }} 
              className="lg:col-span-1"
            >
              <div className="glass-card p-6 sm:p-8 sticky top-28 sm:top-32">
                <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-full bg-secondary flex items-center justify-center mb-6 overflow-hidden border-4 border-foreground/10">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl sm:text-4xl font-display font-bold">{profile?.name?.charAt(0) || "N"}</span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-center mb-2">{profile?.name || "Nauman Ellahi"}</h2>
                <p className="text-sm sm:text-base text-muted-foreground text-center mb-6">{profile?.title || "WordPress & Frontend Developer"}</p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin size={18} className="text-muted-foreground flex-shrink-0" />
                    <span className="text-foreground/90">{profile?.location || "Pakistan"}</span>
                  </div>
                  {profile?.email && (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail size={18} className="text-muted-foreground flex-shrink-0" />
                      <span className="text-foreground/90 truncate">{profile.email}</span>
                    </div>
                  )}
                  {profile?.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone size={18} className="text-muted-foreground flex-shrink-0" />
                      <span className="text-foreground/90">{profile.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar size={18} className="text-muted-foreground flex-shrink-0" />
                    <span className="text-foreground/90">{yearsOfExperience}+ Years Experience</span>
                  </div>
                  {profile?.education && (
                    <div className="flex items-center gap-3 text-sm">
                      <GraduationCap size={18} className="text-muted-foreground flex-shrink-0" />
                      <span className="text-foreground/90">{profile.education}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.3, duration: 0.6 }} 
              className="lg:col-span-2 space-y-10 sm:space-y-12"
            >
              {/* Bio */}
              <div>
                <h3 className="text-xl sm:text-2xl font-display font-bold mb-4">My Story</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {profile?.bio || "I am a passionate web developer with expertise in WordPress and modern frontend technologies. My journey in web development started in 2020, and since then, I have been dedicated to creating exceptional digital experiences for clients worldwide."}
                </p>
              </div>

              {/* Experience */}
              <div>
                <h3 className="text-xl sm:text-2xl font-display font-bold mb-6">Work Experience</h3>
                <motion.div 
                  className="space-y-5 sm:space-y-6"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {experiences?.map((exp: any) => (
                    <motion.div key={exp.id} variants={itemVariants} className="glass-card p-5 sm:p-6 hover-lift">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                          <Briefcase size={18} className="sm:w-5 sm:h-5" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                            <h4 className="text-base sm:text-lg font-semibold">{exp.role}</h4>
                            <span className="text-xs sm:text-sm text-muted-foreground">
                              {new Date(exp.start_date).getFullYear()} - {exp.is_current ? "Present" : exp.end_date ? new Date(exp.end_date).getFullYear() : ""}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{exp.company} • {exp.location}</p>
                          {exp.description && (
                            <p className="text-sm text-muted-foreground leading-relaxed">{exp.description}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-xl sm:text-2xl font-display font-bold mb-6">Skills & Technologies</h3>
                <motion.div 
                  className="flex flex-wrap gap-2 sm:gap-3"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {skills?.map((skill: any) => (
                    <motion.span 
                      key={skill.id} 
                      variants={itemVariants}
                      className="px-3 sm:px-4 py-2 bg-secondary rounded-full text-xs sm:text-sm font-medium border border-border/50 hover:bg-accent transition-colors"
                    >
                      {skill.name}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
