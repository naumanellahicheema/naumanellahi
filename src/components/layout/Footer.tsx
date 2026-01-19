import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, ArrowUp, Github, Linkedin, Twitter, Instagram, Youtube } from "lucide-react";
import { useSiteSettings, useProfile } from "@/hooks/usePortfolioData";

const socialIcons: Record<string, any> = { github: Github, linkedin: Linkedin, twitter: Twitter, instagram: Instagram, youtube: Youtube };

export function Footer() {
  const { data: settings } = useSiteSettings();
  const { data: profile } = useProfile();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const socialLinks = settings?.social_links as Record<string, string> || {};
  const hasSocialLinks = Object.values(socialLinks).some(url => url && url.trim());

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="text-2xl font-display font-bold text-foreground">{settings?.site_name || "Nauman Ellahi"}</Link>
            <p className="mt-4 text-muted-foreground">{settings?.tagline || "WordPress & Frontend Developer"}</p>
            {/* Social Icons */}
            {hasSocialLinks && (
              <div className="flex gap-3 mt-6">
                {Object.entries(socialLinks).map(([platform, url]) => {
                  if (!url) return null;
                  const Icon = socialIcons[platform] || null;
                  return (
                    <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" title={platform}>
                      {Icon ? <Icon size={18} /> : <span className="text-xs font-medium uppercase">{platform[0]}</span>}
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {["/", "/about", "/portfolio", "/services", "/contact"].map((href) => (
                <li key={href}><Link to={href} className="text-muted-foreground hover:text-foreground transition-colors">{href === "/" ? "Home" : href.slice(1).charAt(0).toUpperCase() + href.slice(2)}</Link></li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-6">Services</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li>WordPress Development</li>
              <li>Frontend Development</li>
              <li>Custom Websites</li>
              <li>Performance Optimization</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail size={18} />
                <a href={`mailto:${settings?.contact_email || profile?.email}`} className="hover:text-foreground transition-colors">{settings?.contact_email || profile?.email || "naumancheema643@gmail.com"}</a>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone size={18} />
                <a href={`tel:${settings?.contact_phone || profile?.phone}`} className="hover:text-foreground transition-colors">{settings?.contact_phone || profile?.phone || "+923331401384"}</a>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground"><MapPin size={18} /><span>{profile?.location || "Pakistan"}</span></li>
            </ul>
          </div>
        </div>

        <div className="py-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">{settings?.footer_text || "© 2024 Nauman Ellahi. All rights reserved."}</p>
          <button onClick={scrollToTop} className="p-3 rounded-full bg-secondary hover:bg-accent transition-colors"><ArrowUp size={20} /></button>
        </div>
      </div>
    </footer>
  );
}