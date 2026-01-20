import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Code, Layout as LayoutIcon, Zap, Globe, Briefcase, Star, CheckCircle, Download, Shield, Users, Settings, Database, Lock, Gauge, ChevronDown } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { useProfile, useProjects, useServices, useExperiences, useTestimonials, useSiteSettings } from "@/hooks/usePortfolioData";

const iconMap: Record<string, any> = { Code, Layout: LayoutIcon, Zap, Globe, Briefcase, Palette: Star, Building: CheckCircle, Search: Globe };

// Smooth scroll indicator
function ScrollIndicator() {
  return (
    <motion.div 
      className="absolute bottom-8 left-1/2 -translate-x-1/2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.6 }}
    >
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="flex flex-col items-center gap-2 text-muted-foreground"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown size={20} />
      </motion.div>
    </motion.div>
  );
}

// Admin Panel Showcase Component
function AdminPanelShowcase() {
  const features = [
    { icon: Lock, title: "Role-Based Access", desc: "Secure multi-level permissions" },
    { icon: Database, title: "Data Management", desc: "Protected CRUD operations" },
    { icon: Settings, title: "Easy Control", desc: "Intuitive for non-technical users" },
  ];

  return (
    <section className="section-container relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-3 py-1.5 text-xs font-semibold bg-foreground text-background rounded-full mb-5 tracking-wide">
            PREMIUM CAPABILITY
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-5 leading-tight">
            Admin Panels That Put You In Control
          </h2>
          <p className="text-muted-foreground mb-8 text-base sm:text-lg leading-relaxed max-w-xl">
            Manage users, content, and data through a powerful dashboard—built for your business, not generic templates.
          </p>
          
          <div className="space-y-5">
            {features.map((feature, i) => (
              <motion.div 
                key={i}
                className="flex items-start gap-4 group"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 group-hover:bg-foreground/10 transition-colors">
                  <feature.icon size={20} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-base">{feature.title}</h4>
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
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="glass-card p-5 sm:p-6 rounded-2xl">
            {/* Mock Admin Header */}
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border/50">
              <div className="w-8 h-8 rounded-lg bg-foreground/10" />
              <div className="flex-1">
                <div className="h-3 w-24 bg-foreground/10 rounded mb-1.5" />
                <div className="h-2 w-16 bg-foreground/5 rounded" />
              </div>
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded bg-foreground/5" />
                <div className="w-6 h-6 rounded bg-foreground/5" />
              </div>
            </div>
            
            {/* Mock Dashboard Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-3 sm:p-4 rounded-lg bg-secondary/50">
                  <div className="h-5 w-10 bg-foreground/20 rounded mb-2 font-bold" />
                  <div className="h-2 w-14 bg-foreground/10 rounded" />
                </div>
              ))}
            </div>
            
            {/* Mock Table */}
            <div className="space-y-2">
              {[1, 2, 3, 4].map(i => (
                <motion.div 
                  key={i} 
                  className="flex items-center gap-3 p-2.5 sm:p-3 rounded-lg bg-secondary/30"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-foreground/10" />
                  <div className="flex-1">
                    <div className="h-2 w-24 sm:w-32 bg-foreground/15 rounded mb-1" />
                    <div className="h-1.5 w-16 sm:w-20 bg-foreground/5 rounded" />
                  </div>
                  <div className="h-5 w-14 bg-foreground/10 rounded-full" />
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-foreground/5 blur-2xl" />
          <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-foreground/5 blur-2xl" />
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
    { icon: Gauge, label: "Fast Performance" },
  ];

  // Animation variants for staggered reveals
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
      <AnimatedBackground />
      
      {/* HERO SECTION - Mobile-First, Clean Above-the-Fold */}
      <section className="hero-section relative min-h-[100svh] md:min-h-screen">
        <div className="hero-glow top-1/4 left-1/4 float opacity-10" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
          {/* Avatar - smaller on mobile */}
          {profile?.avatar_url && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.6 }}
              className="mb-5 sm:mb-8"
            >
              <img 
                src={profile.avatar_url} 
                alt={profile.name || "Profile"} 
                className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full mx-auto object-cover border-4 border-foreground/20 shadow-2xl"
              />
            </motion.div>
          )}
          
          {/* Clear Value Proposition - ONE message */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7 }} 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold mb-4 sm:mb-6 leading-[1.1]"
          >
            I Build Secure Web Apps{" "}
            <span className="text-gradient block sm:inline">With Admin Panels</span>
          </motion.h1>
          
          {/* Who it's for - Target Audience */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7, delay: 0.1 }} 
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2"
          >
            Helping <strong className="text-foreground font-medium">startups, founders, and small teams</strong> manage users and data through custom dashboards—without the complexity.
          </motion.p>
          
          {/* ONE Primary CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7, delay: 0.2 }} 
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <Link to="/contact" className="btn-hero w-full sm:w-auto tap-target">
              Get a Free Project Review <ArrowRight size={18} className="ml-1" />
            </Link>
            <Link to="/portfolio" className="btn-outline-hero w-full sm:w-auto tap-target">
              See My Work
            </Link>
          </motion.div>

          {/* Capability Pills - Hidden on mobile for cleaner above-fold */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7, delay: 0.5 }} 
            className="hidden md:flex flex-wrap items-center justify-center gap-3 mt-14"
          >
            {coreCapabilities.map((cap, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2.5 bg-secondary/50 rounded-full text-sm border border-border/50 hover:bg-secondary transition-colors">
                <cap.icon size={16} className="text-muted-foreground" />
                <span className="text-foreground/90">{cap.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
        
        <ScrollIndicator />
      </section>

      {/* SOCIAL PROOF - Quick Stats (builds trust before services) */}
      <section className="py-10 sm:py-14 md:py-16 border-y border-border/50 bg-card/30">
        <div className="max-w-5xl mx-auto px-5 sm:px-6">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8"
          >
            {[
              { value: `${yearsOfExperience}+`, label: "Years Experience" },
              { value: `${projects?.length || 13}+`, label: "Projects Delivered" },
              { value: "5+", label: "Countries Served" },
              { value: "100%", label: "Client Satisfaction" }
            ].map((stat, i) => (
              <motion.div key={i} variants={itemVariants} className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* PRIMARY SERVICE - Featured, Expanded */}
      {primaryService && (
        <section className="section-container section-divider">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10 sm:mb-12"
            >
              <span className="inline-block px-3 py-1.5 text-xs font-semibold bg-foreground text-background rounded-full mb-5 tracking-wide">
                CORE SERVICE
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 leading-tight">
                {primaryService.title}
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {primaryService.description || primaryService.short_description}
              </p>
            </motion.div>

            {/* Feature Grid - Outcome-focused */}
            {primaryService.highlights && primaryService.highlights.length > 0 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-10"
              >
                {primaryService.highlights.map((h: string, j: number) => (
                  <motion.div 
                    key={j} 
                    variants={itemVariants}
                    className="flex items-start gap-3 p-4 sm:p-5 glass-card hover-lift"
                  >
                    <CheckCircle size={20} className="text-foreground flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-foreground/80">{h}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}

            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Link to="/contact" className="btn-hero tap-target">
                Discuss Your Project <ArrowRight size={18} className="ml-1" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* PROOF - Featured Projects (before secondary services) */}
      <section className="section-container bg-card/40 relative section-divider">
        <div className="text-center mb-10 sm:mb-14">
          <motion.span 
            className="inline-block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Proof of Results
          </motion.span>
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Recent Projects
          </motion.h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            Real results for real clients—secure, scalable, and delivered on time.
          </p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {projects?.slice(0, 6).map((project: any, i: number) => (
            <motion.div 
              key={project.id} 
              variants={itemVariants}
              className="project-card group"
            >
              <div className="aspect-video bg-secondary overflow-hidden">
                {project.thumbnail_url ? (
                  <img 
                    src={project.thumbnail_url} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                    <Globe size={40} className="text-muted-foreground/50" />
                  </div>
                )}
              </div>
              <div className="p-4 sm:p-5 md:p-6">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <span>{project.industry}</span>
                  {project.country && (
                    <>
                      <span>•</span>
                      <span>{project.country}</span>
                    </>
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-display font-semibold mb-2 group-hover:text-foreground transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{project.short_description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="text-center mt-10 sm:mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Link to="/portfolio" className="btn-outline-hero tap-target">
            View All Projects <ArrowRight size={16} className="ml-1" />
          </Link>
        </motion.div>
      </section>

      {/* EXPERIENCE - Professional Journey (builds credibility) */}
      <section className="section-container relative section-divider">
        <div className="text-center mb-10 sm:mb-14">
          <motion.span 
            className="inline-block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Background
          </motion.span>
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Professional Experience
          </motion.h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            {yearsOfExperience}+ years building web solutions for businesses worldwide.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-5 sm:space-y-6 relative z-10">
          {experiences?.slice(0, 3).map((exp: any, i: number) => (
            <motion.div 
              key={exp.id} 
              initial={{ opacity: 0, x: -20 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true, margin: "-30px" }} 
              transition={{ delay: i * 0.1, duration: 0.5 }} 
              className="relative pl-10 sm:pl-12"
            >
              <div className="absolute left-0 top-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-foreground flex items-center justify-center">
                <Briefcase size={12} className="text-background sm:hidden" />
                <Briefcase size={14} className="text-background hidden sm:block" />
              </div>
              <div className="glass-card p-4 sm:p-5 md:p-6 hover-lift">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    {new Date(exp.start_date).getFullYear()} - {exp.is_current ? "Present" : exp.end_date ? new Date(exp.end_date).getFullYear() : ""}
                  </span>
                  {exp.is_current && <span className="px-2 py-0.5 text-[10px] sm:text-xs bg-foreground text-background rounded-full font-medium">Current</span>}
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-display font-semibold">{exp.role}</h3>
                <p className="text-sm text-muted-foreground">{exp.company}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="text-center mt-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Link to="/experience" className="btn-outline-hero tap-target">
            View Full Experience
          </Link>
        </motion.div>
      </section>

      {/* SECONDARY SERVICES - Smaller, Lower Hierarchy */}
      {secondaryServices && secondaryServices.length > 0 && (
        <section className="section-container bg-card/30 section-divider">
          <div className="text-center mb-8 sm:mb-12">
            <motion.h2 
              className="text-xl sm:text-2xl md:text-3xl font-display font-bold mb-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Additional Services
            </motion.h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-xs sm:text-sm md:text-base">
              Complementary solutions to support your project needs.
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {secondaryServices.map((service: any, i: number) => {
              const IconComponent = iconMap[service.icon] || Globe;
              return (
                <motion.div 
                  key={service.id} 
                  variants={itemVariants}
                  className="glass-card p-4 sm:p-5 md:p-6 hover-lift"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-secondary flex items-center justify-center mb-4">
                    <IconComponent size={18} className="sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg font-display font-semibold mb-2">{service.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{service.short_description}</p>
                </motion.div>
              );
            })}
          </motion.div>
          
          <motion.div 
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link to="/services" className="text-sm font-medium text-foreground hover:underline inline-flex items-center gap-1 tap-target">
              View All Services <ArrowRight size={14} />
            </Link>
          </motion.div>
        </section>
      )}

      {/* ADMIN PANEL SHOWCASE */}
      <AdminPanelShowcase />

      {/* TESTIMONIALS - Social Proof */}
      {testimonials && testimonials.length > 0 && (
        <section className="section-container bg-card/40 relative section-divider">
          <div className="text-center mb-8 sm:mb-12">
            <motion.span 
              className="inline-block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Testimonials
            </motion.span>
            <motion.h2 
              className="text-xl sm:text-2xl md:text-3xl font-display font-bold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Client Feedback
            </motion.h2>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 relative z-10 max-w-5xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial: any, i: number) => (
              <motion.div 
                key={testimonial.id} 
                variants={itemVariants}
                className="glass-card p-5 sm:p-6 md:p-8 hover-lift"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating || 5 }).map((_, j) => (
                    <Star key={j} size={14} fill="currentColor" className="text-foreground" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-5 italic text-sm sm:text-base leading-relaxed line-clamp-4">
                  "{testimonial.message}"
                </p>
                <div className="flex items-center gap-3">
                  {testimonial.avatar_url && (
                    <img src={testimonial.avatar_url} alt={testimonial.client_name} className="w-10 h-10 rounded-full object-cover" loading="lazy" />
                  )}
                  <div>
                    <div className="font-semibold text-sm">{testimonial.client_name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role}, {testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="text-center mt-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link to="/testimonials" className="btn-outline-hero tap-target">View All Reviews</Link>
          </motion.div>
        </section>
      )}

      {/* FINAL CTA - Value-Driven */}
      <section className="section-container text-center">
        <motion.div 
          className="glass-card p-8 sm:p-12 md:p-16 lg:p-20 relative overflow-hidden max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-foreground/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-foreground/5 blur-3xl" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-display font-bold mb-4 sm:mb-6 leading-tight">
              Ready to Build Something Secure?
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-6 sm:mb-8 leading-relaxed">
              Let's discuss your admin dashboard needs and how I can help you manage your users and data effectively.
            </p>
            <Link to="/contact" className="btn-hero tap-target">
              Get a Free Project Review <ArrowRight size={18} className="ml-1" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Resume Download - Subtle */}
      {profile?.resume_url && (
        <section className="py-8 sm:py-12 text-center">
          <a 
            href={profile.resume_url} 
            download 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors tap-target"
          >
            <Download size={16} /> Download Resume
          </a>
        </section>
      )}
    </Layout>
  );
}
