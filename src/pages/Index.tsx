import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Code, Layout as LayoutIcon, Zap, Globe, Briefcase, Star, CheckCircle, Download, Shield, Users, Settings, Database, Lock, Gauge } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useProfile, useProjects, useServices, useExperiences, useTestimonials, useSiteSettings } from "@/hooks/usePortfolioData";

const iconMap: Record<string, any> = { Code, Layout: LayoutIcon, Zap, Globe, Briefcase, Palette: Star, Building: CheckCircle, Search: Globe };

// Minimal floating elements for visual interest
function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-96 h-96 rounded-full border border-foreground/5"
        style={{ top: "10%", right: "-10%" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-64 h-64 rounded-full border-2 border-dashed border-foreground/5"
        style={{ bottom: "-10%", left: "-5%" }}
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

// Admin Panel Showcase Component
function AdminPanelShowcase() {
  const features = [
    { icon: Lock, title: "Role-Based Access Control", desc: "Secure multi-level permissions for teams" },
    { icon: Database, title: "Secure Data Management", desc: "Protected CRUD operations with validation" },
    { icon: Settings, title: "Easy Content Control", desc: "Intuitive interface for non-technical users" },
  ];

  return (
    <section className="section-container relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-3 py-1 text-xs font-medium bg-foreground text-background rounded-full mb-4">
            PREMIUM CAPABILITY
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Custom Admin Panels That Put You In Control
          </h2>
          <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
            Manage your users, content, and data through a powerful admin dashboard—built specifically for your business needs, not generic templates.
          </p>
          
          <div className="space-y-6">
            {features.map((feature, i) => (
              <motion.div 
                key={i}
                className="flex items-start gap-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <feature.icon size={20} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Admin Panel Visual Mock */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="glass-card p-6 rounded-2xl">
            {/* Mock Admin Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
              <div className="w-8 h-8 rounded-lg bg-foreground/10" />
              <div className="flex-1">
                <div className="h-3 w-24 bg-foreground/10 rounded mb-1" />
                <div className="h-2 w-16 bg-foreground/5 rounded" />
              </div>
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded bg-foreground/5" />
                <div className="w-6 h-6 rounded bg-foreground/5" />
              </div>
            </div>
            
            {/* Mock Dashboard Grid */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-4 rounded-lg bg-secondary/50">
                  <div className="h-6 w-12 bg-foreground/20 rounded mb-2 font-bold" />
                  <div className="h-2 w-16 bg-foreground/10 rounded" />
                </div>
              ))}
            </div>
            
            {/* Mock Table */}
            <div className="space-y-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                  <div className="w-8 h-8 rounded-full bg-foreground/10" />
                  <div className="flex-1">
                    <div className="h-2.5 w-32 bg-foreground/15 rounded mb-1" />
                    <div className="h-2 w-20 bg-foreground/5 rounded" />
                  </div>
                  <div className="h-6 w-16 bg-foreground/10 rounded-full" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-foreground/5 blur-2xl" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-foreground/5 blur-2xl" />
        </motion.div>
      </div>
    </section>
  );
}

export default function Index() {
  const { data: profile } = useProfile();
  const { data: projects } = useProjects({ featured: true, limit: 6 });
  const { data: services } = useServices({ limit: 6 });
  const { data: experiences } = useExperiences();
  const { data: testimonials } = useTestimonials({ limit: 3 });
  const { data: settings } = useSiteSettings();

  const yearsOfExperience = profile?.experience_start_year ? new Date().getFullYear() - profile.experience_start_year : 5;
  
  // Separate primary service from secondary services
  const primaryService = services?.[0];
  const secondaryServices = services?.slice(1, 4);

  // Core features/capabilities (outcome-focused, not tool-focused)
  const coreCapabilities = [
    { icon: Shield, label: "Secure Authentication" },
    { icon: Database, label: "Protected Data" },
    { icon: Settings, label: "Admin Dashboards" },
    { icon: Gauge, label: "Performance Optimized" },
  ];

  return (
    <Layout>
      {/* HERO SECTION - Mobile-First, Clean Above-the-Fold */}
      <section className="hero-section relative min-h-[90vh] md:min-h-screen">
        <FloatingElements />
        <div className="hero-glow top-1/4 left-1/4 float opacity-10" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
          {/* Avatar - smaller on mobile */}
          {profile?.avatar_url && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.6 }}
              className="mb-6 md:mb-8"
            >
              <img 
                src={profile.avatar_url} 
                alt={profile.name || "Profile"} 
                className="w-24 h-24 md:w-36 md:h-36 rounded-full mx-auto object-cover border-4 border-foreground/20 shadow-2xl"
              />
            </motion.div>
          )}
          
          {/* Clear Value Proposition - ONE message */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }} 
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-4 md:mb-6 leading-tight"
          >
            I Build Secure Web Apps{" "}
            <span className="text-gradient">With Admin Panels</span>
          </motion.h1>
          
          {/* Who it's for - Target Audience */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.1 }} 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Helping <strong className="text-foreground">startups, solo founders, and small teams</strong> manage their users and data through custom dashboards—without the complexity.
          </motion.p>
          
          {/* ONE Primary CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }} 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/contact" className="btn-hero w-full sm:w-auto">
              Get a Free Project Review <ArrowRight size={20} />
            </Link>
            <Link to="/portfolio" className="btn-outline-hero w-full sm:w-auto">
              See My Work
            </Link>
          </motion.div>

          {/* Capability Pills - Hidden on mobile, visible on desktop */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.4 }} 
            className="hidden md:flex flex-wrap items-center justify-center gap-3 mt-12"
          >
            {coreCapabilities.map((cap, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full text-sm">
                <cap.icon size={16} className="text-muted-foreground" />
                <span>{cap.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SOCIAL PROOF - Quick Stats (builds trust before services) */}
      <section className="py-12 md:py-16 border-y border-border bg-card/30">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          >
            {[
              { value: `${yearsOfExperience}+`, label: "Years Experience" },
              { value: `${projects?.length || 13}+`, label: "Projects Delivered" },
              { value: "5+", label: "Countries Served" },
              { value: "100%", label: "Client Satisfaction" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-display font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* PRIMARY SERVICE - Featured, Expanded */}
      {primaryService && (
        <section className="section-container">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block px-3 py-1 text-xs font-medium bg-foreground text-background rounded-full mb-4">
                CORE SERVICE
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
                {primaryService.title}
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {primaryService.description || primaryService.short_description}
              </p>
            </motion.div>

            {/* Feature Grid - Outcome-focused */}
            {primaryService.highlights && primaryService.highlights.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10"
              >
                {primaryService.highlights.map((h: string, j: number) => (
                  <div key={j} className="flex items-start gap-3 p-4 glass-card">
                    <CheckCircle size={20} className="text-foreground flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{h}</span>
                  </div>
                ))}
              </motion.div>
            )}

            <div className="text-center">
              <Link to="/contact" className="btn-hero">
                Discuss Your Project <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* PROOF - Featured Projects (before secondary services) */}
      <section className="section-container bg-card/50 relative">
        <div className="text-center mb-12 md:mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-display font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Recent Projects
          </motion.h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Real results for real clients—secure, scalable, and delivered on time.
          </p>
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
              <div className="p-5 md:p-6">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <span>{project.industry}</span>
                  {project.country && (
                    <>
                      <span>•</span>
                      <span>{project.country}</span>
                    </>
                  )}
                </div>
                <h3 className="text-lg font-display font-semibold mb-2">{project.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{project.short_description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-10 md:mt-12">
          <Link to="/portfolio" className="btn-outline-hero">
            View All Projects <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* EXPERIENCE - Professional Journey (builds credibility) */}
      <section className="section-container relative">
        <FloatingElements />
        <div className="text-center mb-12 md:mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-display font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Professional Experience
          </motion.h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {yearsOfExperience}+ years building web solutions for businesses worldwide.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          {experiences?.slice(0, 3).map((exp: any, i: number) => (
            <motion.div 
              key={exp.id} 
              initial={{ opacity: 0, x: -20 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: i * 0.1 }} 
              className="relative pl-10 md:pl-12"
            >
              <div className="absolute left-0 top-2 w-6 h-6 md:w-8 md:h-8 rounded-full bg-foreground flex items-center justify-center">
                <Briefcase size={12} className="text-background md:hidden" />
                <Briefcase size={16} className="text-background hidden md:block" />
              </div>
              <div className="glass-card p-5 md:p-6">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-sm text-muted-foreground">
                    {new Date(exp.start_date).getFullYear()} - {exp.is_current ? "Present" : exp.end_date ? new Date(exp.end_date).getFullYear() : ""}
                  </span>
                  {exp.is_current && <span className="px-2 py-0.5 text-xs bg-foreground text-background rounded-full">Current</span>}
                </div>
                <h3 className="text-lg md:text-xl font-display font-semibold">{exp.role}</h3>
                <p className="text-muted-foreground">{exp.company}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link to="/experience" className="btn-outline-hero">View Full Experience</Link>
        </div>
      </section>

      {/* SECONDARY SERVICES - Smaller, Lower Hierarchy */}
      {secondaryServices && secondaryServices.length > 0 && (
        <section className="section-container bg-card/30">
          <div className="text-center mb-10 md:mb-12">
            <motion.h2 
              className="text-2xl md:text-3xl font-display font-bold mb-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Additional Services
            </motion.h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
              Complementary solutions to support your project needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
            {secondaryServices.map((service: any, i: number) => {
              const IconComponent = iconMap[service.icon] || Globe;
              return (
                <motion.div 
                  key={service.id} 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: i * 0.1 }} 
                  className="glass-card p-5 md:p-6"
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-4">
                    <IconComponent size={20} />
                  </div>
                  <h3 className="text-base md:text-lg font-display font-semibold mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{service.short_description}</p>
                </motion.div>
              );
            })}
          </div>
          
          <div className="text-center mt-8">
            <Link to="/services" className="text-sm font-medium text-foreground hover:underline inline-flex items-center gap-1">
              View All Services <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      )}

      {/* ADMIN PANEL SHOWCASE */}
      <AdminPanelShowcase />

      {/* TESTIMONIALS - Social Proof */}
      {testimonials && testimonials.length > 0 && (
        <section className="section-container bg-card/50 relative">
          <div className="text-center mb-10 md:mb-12">
            <motion.h2 
              className="text-2xl md:text-3xl font-display font-bold mb-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Client Feedback
            </motion.h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 max-w-5xl mx-auto">
            {testimonials.map((testimonial: any, i: number) => (
              <motion.div 
                key={testimonial.id} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1 }} 
                className="glass-card p-6 md:p-8"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating || 5 }).map((_, j) => (
                    <Star key={j} size={14} fill="currentColor" className="text-foreground" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-5 italic text-sm md:text-base leading-relaxed">
                  "{testimonial.message}"
                </p>
                <div className="flex items-center gap-3">
                  {testimonial.avatar_url && (
                    <img src={testimonial.avatar_url} alt={testimonial.client_name} className="w-10 h-10 rounded-full object-cover" />
                  )}
                  <div>
                    <div className="font-semibold text-sm">{testimonial.client_name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role}, {testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/testimonials" className="btn-outline-hero">View All Reviews</Link>
          </div>
        </section>
      )}

      {/* FINAL CTA - Value-Driven */}
      <section className="section-container text-center">
        <motion.div 
          className="glass-card p-10 md:p-16 lg:p-20 relative overflow-hidden max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-foreground/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-foreground/5 blur-3xl" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold mb-4 md:mb-6">
              Ready to Build Something Secure?
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-6 md:mb-8 leading-relaxed">
              Let's discuss your admin dashboard needs and how I can help you manage your users and data effectively.
            </p>
            <Link to="/contact" className="btn-hero">
              Get a Free Project Review <ArrowRight size={20} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Resume Download - Subtle */}
      {profile?.resume_url && (
        <section className="py-8 md:py-12 text-center">
          <a 
            href={profile.resume_url} 
            download 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Download size={16} /> Download Resume
          </a>
        </section>
      )}
    </Layout>
  );
}
