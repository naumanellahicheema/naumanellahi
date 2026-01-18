import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Code, Layout as LayoutIcon, Zap, Globe } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useProfile, useProjects, useServices, useExperiences, useTestimonials } from "@/hooks/usePortfolioData";

export default function Index() {
  const { data: profile } = useProfile();
  const { data: projects } = useProjects({ featured: true, limit: 6 });
  const { data: services } = useServices({ limit: 6 });
  const { data: experiences } = useExperiences();
  const { data: testimonials } = useTestimonials({ limit: 3 });

  const yearsOfExperience = profile?.experience_start_year 
    ? new Date().getFullYear() - profile.experience_start_year 
    : 5;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-glow top-1/4 left-1/4 float" />
        <div className="hero-glow bottom-1/4 right-1/4 float" style={{ animationDelay: "-3s" }} />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 mb-6 text-sm font-medium bg-secondary rounded-full text-muted-foreground">
              Available for Freelance Projects
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6"
          >
            <span className="text-gradient">{profile?.name || "Nauman Ellahi"}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8"
          >
            {profile?.title || "WordPress & Frontend Developer"} with {yearsOfExperience}+ years of experience building stunning websites for clients worldwide.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/portfolio" className="btn-hero">
              View My Work <ArrowRight size={20} />
            </Link>
            <Link to="/contact" className="btn-outline-hero">
              Get In Touch
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { value: `${yearsOfExperience}+`, label: "Years Experience" },
              { value: `${projects?.length || 13}+`, label: "Projects Completed" },
              { value: "5+", label: "Countries Served" },
              { value: "100%", label: "Client Satisfaction" },
            ].map((stat, i) => (
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
          {services?.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 hover:border-foreground/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-6">
                {service.icon === "Code" && <Code size={24} />}
                {service.icon === "Layout" && <LayoutIcon size={24} />}
                {service.icon === "Zap" && <Zap size={24} />}
                {!["Code", "Layout", "Zap"].includes(service.icon || "") && <Globe size={24} />}
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">{service.title}</h3>
              <p className="text-muted-foreground">{service.short_description}</p>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/services" className="btn-outline-hero">View All Services</Link>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section-container bg-card/50">
        <div className="text-center mb-16">
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle mx-auto">A selection of my recent work for clients around the world.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.slice(0, 6).map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="project-card"
            >
              <div className="aspect-video bg-secondary overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                  <Globe size={48} className="text-muted-foreground/50" />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <span>{project.industry}</span>
                  <span>•</span>
                  <span>{project.country}</span>
                </div>
                <h3 className="text-lg font-display font-semibold mb-2">{project.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{project.short_description}</p>
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
        
        <div className="text-center mt-12">
          <Link to="/portfolio" className="btn-hero">View All Projects <ArrowRight size={20} /></Link>
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
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8"
              >
                <p className="text-muted-foreground mb-6 italic">"{testimonial.message}"</p>
                <div>
                  <div className="font-semibold">{testimonial.client_name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section-container text-center">
        <div className="glass-card p-12 md:p-20">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Ready to Start Your Project?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Let's discuss how I can help bring your vision to life with a stunning, high-performance website.
          </p>
          <Link to="/contact" className="btn-hero">
            Get In Touch <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </Layout>
  );
}