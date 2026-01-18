import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Code, Layout as LayoutIcon, Zap, Globe, Briefcase, Star, CheckCircle } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useProfile, useProjects, useServices, useExperiences, useTestimonials, useSkills } from "@/hooks/usePortfolioData";

const iconMap: Record<string, any> = { Code, Layout: LayoutIcon, Zap, Globe, Briefcase, Palette: Star, Building: CheckCircle, Search: Globe };

export default function Index() {
  const { data: profile } = useProfile();
  const { data: projects } = useProjects({ featured: true, limit: 6 });
  const { data: services } = useServices({ limit: 6 });
  const { data: experiences } = useExperiences();
  const { data: testimonials } = useTestimonials({ limit: 3 });
  const { data: skills } = useSkills();

  const yearsOfExperience = profile?.experience_start_year ? new Date().getFullYear() - profile.experience_start_year : 5;
  const skillsByCategory = skills?.reduce((acc: any, skill: any) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {}) || {};

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-glow top-1/4 left-1/4 float" />
        <div className="hero-glow bottom-1/4 right-1/4 float" style={{ animationDelay: "-3s" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block px-4 py-2 mb-6 text-sm font-medium bg-secondary rounded-full text-muted-foreground">Available for Freelance Projects</span>
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
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[{ value: `${yearsOfExperience}+`, label: "Years Experience" }, { value: `${projects?.length || 13}+`, label: "Projects Completed" }, { value: "5+", label: "Countries Served" }, { value: "100%", label: "Client Satisfaction" }].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-display font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-container">
        <div className="text-center mb-16">
          <h2 className="section-title">Services I Offer</h2>
          <p className="section-subtitle mx-auto">Comprehensive web development solutions tailored to your business needs.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services?.map((service: any, i: number) => {
            const IconComponent = iconMap[service.icon] || Globe;
            return (
              <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card p-8 hover:border-foreground/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-6"><IconComponent size={24} /></div>
                <h3 className="text-xl font-display font-semibold mb-3">{service.title}</h3>
                <p className="text-muted-foreground mb-4">{service.short_description}</p>
                {service.highlights && <ul className="space-y-2">{service.highlights.slice(0, 3).map((h: string, j: number) => <li key={j} className="text-sm text-muted-foreground flex items-center gap-2"><CheckCircle size={14} /> {h}</li>)}</ul>}
              </motion.div>
            );
          })}
        </div>
        <div className="text-center mt-12"><Link to="/services" className="btn-outline-hero">View All Services</Link></div>
      </section>

      {/* Featured Projects */}
      <section className="section-container bg-card/50">
        <div className="text-center mb-16">
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle mx-auto">A selection of my recent work for clients around the world.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.slice(0, 6).map((project: any, i: number) => (
            <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="project-card group">
              <div className="aspect-video bg-secondary overflow-hidden">
                {project.thumbnail_url ? <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /> : <div className="w-full h-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center"><Globe size={48} className="text-muted-foreground/50" /></div>}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2"><span>{project.industry}</span><span>•</span><span>{project.country}</span></div>
                <h3 className="text-lg font-display font-semibold mb-2">{project.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.short_description}</p>
                {project.website_url && <a href={project.website_url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-foreground hover:underline inline-flex items-center gap-1">Visit Website <ArrowRight size={14} /></a>}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12"><Link to="/portfolio" className="btn-hero">View All Projects <ArrowRight size={20} /></Link></div>
      </section>

      {/* Experience Timeline */}
      <section className="section-container">
        <div className="text-center mb-16">
          <h2 className="section-title">Experience</h2>
          <p className="section-subtitle mx-auto">My professional journey in web development.</p>
        </div>
        <div className="max-w-3xl mx-auto space-y-8">
          {experiences?.map((exp: any, i: number) => (
            <motion.div key={exp.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative pl-12">
              <div className="absolute left-0 top-2 w-8 h-8 rounded-full bg-foreground flex items-center justify-center"><Briefcase size={16} className="text-background" /></div>
              <div className="glass-card p-6">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-sm text-muted-foreground">{new Date(exp.start_date).getFullYear()} - {exp.is_current ? "Present" : exp.end_date ? new Date(exp.end_date).getFullYear() : ""}</span>
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
          <h2 className="section-title">Skills</h2>
          <p className="section-subtitle mx-auto">Technologies and tools I work with.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(skillsByCategory).map(([category, categorySkills]: [string, any]) => (
            <div key={category} className="glass-card p-6">
              <h3 className="text-lg font-display font-semibold mb-4">{category}</h3>
              <div className="space-y-4">
                {categorySkills.map((skill: any) => (
                  <div key={skill.id}>
                    <div className="flex justify-between text-sm mb-1"><span>{skill.name}</span><span className="text-muted-foreground">{skill.level}%</span></div>
                    <div className="skill-bar"><div className="skill-bar-fill" style={{ width: `${skill.level}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <section className="section-container">
          <div className="text-center mb-16">
            <h2 className="section-title">What Clients Say</h2>
            <p className="section-subtitle mx-auto">Feedback from clients I've had the pleasure of working with.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial: any, i: number) => (
              <motion.div key={testimonial.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card p-8">
                <div className="flex gap-1 mb-4">{Array.from({ length: testimonial.rating || 5 }).map((_, j) => <Star key={j} size={16} fill="currentColor" />)}</div>
                <p className="text-muted-foreground mb-6 italic">"{testimonial.message}"</p>
                <div><div className="font-semibold">{testimonial.client_name}</div><div className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</div></div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12"><Link to="/testimonials" className="btn-outline-hero">View All Testimonials</Link></div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section-container text-center">
        <div className="glass-card p-12 md:p-20">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Ready to Start Your Project?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">Let's discuss how I can help bring your vision to life with a stunning, high-performance website.</p>
          <Link to="/contact" className="btn-hero">Get In Touch <ArrowRight size={20} /></Link>
        </div>
      </section>
    </Layout>
  );
}