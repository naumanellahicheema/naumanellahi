import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, ArrowUp } from "lucide-react";
import { useSiteSettings, useProfile } from "@/hooks/usePortfolioData";

export function Footer() {
  const { data: settings } = useSiteSettings();
  const { data: profile } = useProfile();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
  ];

  const services = [
    "WordPress Development",
    "Frontend Development",
    "Custom Websites",
    "Performance Optimization",
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="text-2xl font-display font-bold text-foreground">
              {settings?.site_name || "Nauman Ellahi"}
            </Link>
            <p className="mt-4 text-muted-foreground">
              {settings?.tagline || "WordPress & Frontend Developer"}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Building beautiful, high-performance websites for clients worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-6">
              Services
            </h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-muted-foreground">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-6">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail size={18} />
                <a href={`mailto:${settings?.contact_email || profile?.email}`} className="hover:text-foreground transition-colors">
                  {settings?.contact_email || profile?.email || "naumancheema643@gmail.com"}
                </a>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone size={18} />
                <a href={`tel:${settings?.contact_phone || profile?.phone}`} className="hover:text-foreground transition-colors">
                  {settings?.contact_phone || profile?.phone || "+923331401384"}
                </a>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <MapPin size={18} />
                <span>{profile?.location || "Pakistan"}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {settings?.footer_text || "© 2024 Nauman Ellahi. All rights reserved."}
          </p>
          <button
            onClick={scrollToTop}
            className="p-3 rounded-full bg-secondary hover:bg-accent transition-colors"
          >
            <ArrowUp size={20} />
          </button>
        </div>
      </div>
    </footer>
  );
}