import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useServices } from "@/hooks/usePortfolioData";
import { Code, Layout as LayoutIcon, Zap, Globe, CheckCircle, Palette, Building, Search, Star, ArrowRight, Shield, Database, Settings } from "lucide-react";

const iconMap: Record<string, any> = { Code, Layout: LayoutIcon, Zap, Globe, Palette, Building, Search, Star };

export default function Services() {
  const { data: services } = useServices();
  
  // Separate primary service from secondary services
  const primaryService = services?.[0];
  const secondaryServices = services?.slice(1);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-3 py-1 text-xs font-medium bg-secondary rounded-full mb-4">
              WHAT I DO
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Web Development Services
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Helping startups, solo founders, and small teams build secure, scalable web applications with powerful admin dashboards.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Primary Service - Featured Section */}
      {primaryService && (
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8 md:p-12 relative overflow-hidden"
            >
              {/* Background accent */}
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-foreground/5 blur-3xl" />
              
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 text-xs font-medium bg-foreground text-background rounded-full mb-6">
                  CORE SERVICE
                </span>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                  {/* Content */}
                  <div>
                    <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                      {primaryService.title}
                    </h2>
                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                      {primaryService.description || primaryService.short_description}
                    </p>
                    
                    <Link to="/contact" className="btn-hero inline-flex">
                      Get Started <ArrowRight size={18} />
                    </Link>
                  </div>
                  
                  {/* Features */}
                  {primaryService.highlights && primaryService.highlights.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                        What's Included
                      </h3>
                      {primaryService.highlights.map((h: string, j: number) => (
                        <div key={j} className="flex items-start gap-3">
                          <CheckCircle size={18} className="text-foreground flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{h}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Capabilities Section - Outcome-Focused */}
      <section className="py-16 px-6 bg-card/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
              Built-In Capabilities
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Every project includes these core features to ensure security, scalability, and ease of management.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Role-Based Access", desc: "Secure multi-level permissions for different user types" },
              { icon: Database, title: "Secure Data Layer", desc: "Protected database operations with proper validation" },
              { icon: Settings, title: "Admin Dashboards", desc: "Intuitive interfaces for content and user management" },
              { icon: Zap, title: "Performance Optimized", desc: "Fast load times and smooth user experience" },
              { icon: Globe, title: "Responsive Design", desc: "Works perfectly on all devices and screen sizes" },
              { icon: Code, title: "Clean Codebase", desc: "Maintainable, documented code for future updates" },
            ].map((cap, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 glass-card"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-4">
                  <cap.icon size={20} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{cap.title}</h3>
                <p className="text-sm text-muted-foreground">{cap.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Secondary Services */}
      {secondaryServices && secondaryServices.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
                Additional Services
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Complementary solutions to support your ongoing needs.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {secondaryServices.map((service: any, i: number) => {
                const IconComponent = iconMap[service.icon] || Globe;
                return (
                  <motion.div 
                    key={service.id} 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }} 
                    transition={{ delay: i * 0.1 }} 
                    className="glass-card p-6 hover:border-foreground/30 transition-all duration-300"
                  >
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                        <IconComponent size={24} />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-display font-semibold mb-2">{service.title}</h3>
                        <p className="text-muted-foreground text-sm mb-4">{service.description || service.short_description}</p>
                        {service.highlights && service.highlights.length > 0 && (
                          <ul className="space-y-2">
                            {service.highlights.slice(0, 3).map((h: string, j: number) => (
                              <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CheckCircle size={14} className="text-foreground flex-shrink-0" /> {h}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-10 md:p-12"
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
              Not Sure What You Need?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Let's discuss your project requirements. I'll help you identify the right solution for your business goals.
            </p>
            <Link to="/contact" className="btn-hero">
              Get a Free Consultation <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
