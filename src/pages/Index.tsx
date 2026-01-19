import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Code, Layout as LayoutIcon, Zap, Globe, Briefcase, Star, CheckCircle, Download } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useProfile, useProjects, useServices, useExperiences, useTestimonials, useSkills, useSiteSettings } from "@/hooks/usePortfolioData";

const iconMap: Record<string, any> = { Code, Layout: LayoutIcon, Zap, Globe, Briefcase, Palette: Star, Building: CheckCircle, Search: Globe };

// Floating geometric shapes component
function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large circle */}
      <motion.div
        className="absolute w-96 h-96 rounded-full border border-foreground/10"
        style={{ top: "10%", right: "-10%" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      />
      {/* Square */}
      <motion.div
        className="absolute w-32 h-32 border border-foreground/10 rotate-45"
        style={{ top: "30%", left: "5%" }}
        animate={{ y: [0, 20, 0], rotate: [45, 55, 45] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Small circles */}
      <motion.div
        className="absolute w-4 h-4 rounded-full bg-foreground/20"
        style={{ top: "20%", right: "30%" }}
        animate={{ y: [0, -30, 0], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-6 h-6 rounded-full bg-foreground/10"
        style={{ top: "60%", left: "10%" }}
        animate={{ y: [0, 20, 0], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute w-3 h-3 rounded-full bg-foreground/30"
        style={{ bottom: "30%", right: "15%" }}
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      {/* Triangle */}
      <motion.div
        className="absolute w-0 h-0 border-l-[30px] border-r-[30px] border-b-[50px] border-l-transparent border-r-transparent border-b-foreground/10"
        style={{ bottom: "20%", left: "20%" }}
        animate={{ rotate: [0, 10, -10, 0], y: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Dotted line */}
      <motion.div
        className="absolute w-px h-40 bg-gradient-to-b from-transparent via-foreground/20 to-transparent"
        style={{ top: "40%", right: "25%" }}
        animate={{ opacity: [0.2, 0.5, 0.2], scaleY: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Cross/Plus shape */}
      <motion.div
        className="absolute"
        style={{ top: "70%", right: "35%" }}
        animate={{ rotate: [0, 90, 180, 270, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-8 h-0.5 bg-foreground/15 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="w-0.5 h-8 bg-foreground/15 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </motion.div>
      {/* Large ring */}
      <motion.div
        className="absolute w-64 h-64 rounded-full border-2 border-dashed border-foreground/5"
        style={{ bottom: "-10%", left: "-5%" }}
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

export default function Index() {
  const { data: profile } = useProfile();
  const { data: projects } = useProjects({ featured: true, limit: 6 });
  const { data: services } = useServices({ limit: 6 });
  const { data: experiences } = useExperiences();
  const { data: testimonials } = useTestimonials({ limit: 3 });
  const { data: skills } = useSkills();
  const { data: settings } = useSiteSettings();

  const yearsOfExperience = profile?.experience_start_year ? new Date().getFullYear() - profile.experience_start_year : 5;
  const skillsByCategory = skills?.reduce((acc: any, skill: any) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {}) || {};

  return (
    <Layout>
      {/* Hero Section with Floating Elements */}
      <section className="hero-section relative">
        <FloatingElements />
        <div className="hero-glow top-1/4 left-1/4 float" />
        <div className="hero-glow bottom-1/4 right-1/4 float" style={{ animationDelay: "-3s" }} />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          {/* Avatar */}
          {profile?.avatar_url && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <img 
                src={profile.avatar_url} 
                alt={profile.name || "Profile"} 
                className="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto object-cover border-4 border-foreground/20 shadow-2xl"
              />
            </motion.div>
          )}
          
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block px-4 py-2 mb-6 text-sm font-medium bg-secondary rounded-full text-muted-foreground">
              Available for Freelance Projects
            </span>
          </motion.div>
          
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6">
            <span className="text-gradient">{profile?.name || "Nauman Ellahi"}</span>
          </motion.h1>
          
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {profile?.title || "WordPress & Frontend Developer"} with {yearsOfExperience}+ years of experience building stunning websites for clients worldwide.
          </motion.p>
          
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/portfolio" className="btn-hero">View My Work <ArrowRight size={20} /></Link>
            <Link to="/contact" className="btn-outline-hero">Get In Touch</Link>
            {profile?.resume_url && (
              <a 
                href={profile.resume_url} 
                download 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-outline-hero"
              >
                <Download size={20} /> Download CV
              </a>
            )}
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: `${yearsOfExperience}+`, label: "Years Experience" },
              { value: `${projects?.length || 13}+`, label: "Projects Completed" },
              { value: "5+", label: "Countries Served" },
              { value: "100%", label: "Client Satisfaction" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <motion.div 
                  className="text-4xl md:text-5xl font-display font-bold text-foreground"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-container relative">
        <FloatingElements />
        <div className="text-center mb-16">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Services I Offer
          </motion.h2>
          <p className="section-subtitle mx-auto">Comprehensive web development solutions tailored to your business needs.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {services?.map((service: any, i: number) => {
            const IconComponent = iconMap[service.icon] || Globe;
            return (
              <motion.div 
                key={service.id} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1 }} 
                className="glass-card p-8 hover:border-foreground/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <IconComponent size={24} />
                </div>
                <h3 className="text-xl font-display font-semibold mb-3">{service.title}</h3>
                <p className="text-muted-foreground mb-4">{service.short_description}</p>
                {service.highlights && (
                  <ul className="space-y-2">
                    {service.highlights.slice(0, 3).map((h: string, j: number) => (
                      <li key={j} className="text-sm text-muted-foreground flex items-center gap-2">
                        <CheckCircle size={14} className="text-foreground/70" /> {h}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            );
          })}
        </div>
        <div className="text-center mt-12"><Link to="/services" className="btn-outline-hero">View All Services</Link></div>
      </section>

      {/* Featured Projects */}
      <section className="section-container bg-card/50 relative">
        <div className="text-center mb-16">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Featured Projects
          </motion.h2>
          <p className="section-subtitle mx-auto">A selection of my recent work for clients around the world.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.slice(0, 6).map((project: any, i: number) => (
            <motion.div 
              key={project.id} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: i * 0.1 }} 
              className="project-card group"
            >
              <div className="aspect-video bg-secondary overflow-hidden">
                {project.thumbnail_url ? (
                  <img 
                    src={project.thumbnail_url} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                    <Globe size={48} className="text-muted-foreground/50" />
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <span>{project.industry}</span>
                  <span>•</span>
                  <span>{project.country}</span>
                </div>
                <h3 className="text-lg font-display font-semibold mb-2">{project.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.short_description}</p>
                {project.website_url && (
                  <a 
                    href={project.website_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm font-medium text-foreground hover:underline inline-flex items-center gap-1"
                  >
                    Visit Website <ArrowRight size={14} />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12"><Link to="/portfolio" className="btn-hero">View All Projects <ArrowRight size={20} /></Link></div>
      </section>

      {/* Experience Timeline */}
      <section className="section-container relative">
        <FloatingElements />
        <div className="text-center mb-16">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Experience
          </motion.h2>
          <p className="section-subtitle mx-auto">My professional journey in web development.</p>
        </div>
        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          {experiences?.map((exp: any, i: number) => (
            <motion.div 
              key={exp.id} 
              initial={{ opacity: 0, x: -20 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: i * 0.1 }} 
              className="relative pl-12"
            >
              <div className="absolute left-0 top-2 w-8 h-8 rounded-full bg-foreground flex items-center justify-center">
                <Briefcase size={16} className="text-background" />
              </div>
              <div className="glass-card p-6 hover:border-foreground/30 transition-all duration-300">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-sm text-muted-foreground">
                    {new Date(exp.start_date).getFullYear()} - {exp.is_current ? "Present" : exp.end_date ? new Date(exp.end_date).getFullYear() : ""}
                  </span>
                  {exp.is_current && <span className="px-2 py-0.5 text-xs bg-foreground text-background rounded-full">Current</span>}
                </div>
                <h3 className="text-xl font-display font-semibold">{exp.role}</h3>
                <p className="text-muted-foreground">{exp.company} • {exp.location}</p>
                {exp.description && <p className="text-sm text-muted-foreground mt-3">{exp.description}</p>}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12"><Link to="/experience" className="btn-outline-hero">View Full Experience</Link></div>
      </section>

      {/* Skills */}
      <section className="section-container bg-card/50">
        <div className="text-center mb-16">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Skills
          </motion.h2>
          <p className="section-subtitle mx-auto">Technologies and tools I work with.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(skillsByCategory).map(([category, categorySkills]: [string, any], idx) => (
            <motion.div 
              key={category} 
              className="glass-card p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <h3 className="text-lg font-display font-semibold mb-4">{category}</h3>
              <div className="space-y-4">
                {categorySkills.map((skill: any) => (
                  <div key={skill.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{skill.name}</span>
                      <span className="text-muted-foreground">{skill.level}%</span>
                    </div>
                    <div className="skill-bar">
                      <motion.div 
                        className="skill-bar-fill" 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <section className="section-container relative">
          <FloatingElements />
          <div className="text-center mb-16">
            <motion.h2 
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              What Clients Say
            </motion.h2>
            <p className="section-subtitle mx-auto">Feedback from clients I've had the pleasure of working with.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {testimonials.map((testimonial: any, i: number) => (
              <motion.div 
                key={testimonial.id} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1 }} 
                className="glass-card p-8 hover:border-foreground/30 transition-all duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating || 5 }).map((_, j) => (
                    <Star key={j} size={16} fill="currentColor" className="text-foreground" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">"{testimonial.message}"</p>
                <div className="flex items-center gap-3">
                  {testimonial.avatar_url && (
                    <img src={testimonial.avatar_url} alt={testimonial.client_name} className="w-12 h-12 rounded-full object-cover" />
                  )}
                  <div>
                    <div className="font-semibold">{testimonial.client_name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12"><Link to="/testimonials" className="btn-outline-hero">View All Testimonials</Link></div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section-container text-center">
        <motion.div 
          className="glass-card p-12 md:p-20 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 opacity-50">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-foreground/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-foreground/5 blur-3xl" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Ready to Start Your Project?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Let's discuss how I can help bring your vision to life with a stunning, high-performance website.
            </p>
            <Link to="/contact" className="btn-hero">Get In Touch <ArrowRight size={20} /></Link>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
}
