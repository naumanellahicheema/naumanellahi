import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, ArrowUp, Github, Linkedin, Twitter, Instagram, Youtube } from "lucide-react";
import { useSiteSettings, useProfile } from "@/hooks/usePortfolioData";
import { motion } from "framer-motion";

const socialIcons: Record<string, any> = { github: Github, linkedin: Linkedin, twitter: Twitter, instagram: Instagram, youtube: Youtube };

export function Footer() {
  const { data: settings } = useSiteSettings();
  const { data: profile } = useProfile();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const socialLinks = settings?.social_links as Record<string, string> || {};
  const hasSocialLinks = Object.values(socialLinks).some(url => url && url.trim());

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="bg-card border-t border-border/50">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <motion.div 
          className="py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Brand */}
          <motion.div variants={itemVariants} className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="text-xl sm:text-2xl font-display font-bold text-foreground">
              {settings?.site_name || "Nauman Ellahi"}
            </Link>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              {settings?.tagline || "Building secure web apps with powerful admin panels."}
            </p>
            {/* Social Icons */}
            {hasSocialLinks && (
              <div className="flex gap-3 mt-6">
                {Object.entries(socialLinks).map(([platform, url]) => {
                  if (!url) return null;
                  const Icon = socialIcons[platform] || null;
                  return (
                    <a 
                      key={platform} 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all tap-target hover:-translate-y-1" 
                      title={platform}
                    >
                      {Icon ? <Icon size={18} /> : <span className="text-xs font-medium uppercase">{platform[0]}</span>}
                    </a>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-5 sm:mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About" },
                { href: "/portfolio", label: "Portfolio" },
                { href: "/services", label: "Services" },
                { href: "/contact", label: "Contact" }
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors tap-target inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={itemVariants}>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-5 sm:mb-6">Services</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>Secure Web Apps</li>
              <li>Admin Dashboards</li>
              <li>Database Design</li>
              <li>Performance Optimization</li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants}>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-5 sm:mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail size={16} className="flex-shrink-0" />
                <a 
                  href={`mailto:${settings?.contact_email || profile?.email}`} 
                  className="hover:text-foreground transition-colors truncate"
                >
                  {settings?.contact_email || profile?.email || "naumancheema643@gmail.com"}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone size={16} className="flex-shrink-0" />
                <a 
                  href={`tel:${settings?.contact_phone || profile?.phone}`} 
                  className="hover:text-foreground transition-colors"
                >
                  {settings?.contact_phone || profile?.phone || "+923331401384"}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin size={16} className="flex-shrink-0" />
                <span>{profile?.location || "Pakistan"}</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <div className="py-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
            {settings?.footer_text || `© ${new Date().getFullYear()} Nauman Ellahi. All rights reserved.`}
          </p>
          <motion.button 
            onClick={scrollToTop} 
            className="p-3 rounded-full bg-secondary hover:bg-accent transition-all tap-target hover:-translate-y-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Scroll to top"
          >
            <ArrowUp size={18} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
