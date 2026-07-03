import { Link } from "react-router-dom";
import { Mail, MessageCircle, Github, Linkedin, Twitter, Instagram, Youtube, ArrowUpRight } from "lucide-react";
import { useSiteSettings, useProfile } from "@/hooks/usePortfolioData";

const socialIcons: Record<string, any> = { github: Github, linkedin: Linkedin, twitter: Twitter, instagram: Instagram, youtube: Youtube };

export function Footer() {
  const { data: settings } = useSiteSettings();
  const { data: profile } = useProfile();

  const siteName = settings?.site_name || "Nauman Ellahi";
  const tagline = settings?.tagline || "Building secure web apps that drive real results.";
  const email = settings?.contact_email || profile?.email || "hello@example.com";
  const location = profile?.location || "Pakistan";
  const year = new Date().getFullYear();
  const hostLabel = ((settings as any)?.site_url || "naumanellahi.com").replace(/^https?:\/\//, "").replace(/\/$/, "").toUpperCase();

  const socialLinks = (settings?.social_links as Record<string, string>) || {};
  const activeSocials = Object.entries(socialLinks).filter(([, url]) => url && url.trim());

  return (
    <footer className="relative border-t border-foreground/10 bg-background overflow-hidden">
      <div className="editorial-container pt-16 sm:pt-20 pb-8">
        {/* Section marker */}
        <div className="flex items-center gap-4 text-[11px] font-mono uppercase tracking-widest text-foreground/50 mb-14">
          <span className="w-14 h-px bg-foreground/20" />
          <span>§12 — End of page</span>
          <span className="flex-1 h-px bg-foreground/10" />
          <span className="hidden sm:inline">// {hostLabel}</span>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
              <span className="relative w-10 h-10 rounded-xl bg-foreground text-background flex items-center justify-center font-display font-bold text-lg">
                {siteName.charAt(0).toUpperCase()}
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-orange-400 border-2 border-background" />
              </span>
              <span className="font-display text-xl font-bold tracking-tight">{siteName}</span>
            </Link>
            <p className="text-foreground/60 leading-relaxed max-w-sm mb-8">
              {tagline}
            </p>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-foreground/15 text-[11px] font-mono uppercase tracking-widest text-foreground/70">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Open · Accepting briefs
            </span>
          </div>

          {/* Index */}
          <FooterCol number="01" section="Index" heading="Quick Links">
            <FooterLink to="/portfolio">Portfolio</FooterLink>
            <FooterLink to="/services">Services</FooterLink>
            <FooterLink to="/testimonials">Reviews</FooterLink>
            <FooterLink to="/about">About</FooterLink>
            <FooterLink to="/blog">Journal</FooterLink>
          </FooterCol>

          {/* Legal */}
          <FooterCol number="02" section="Legal" heading="Legal">
            <FooterLink to="/privacy">Privacy Policy</FooterLink>
            <FooterLink to="/terms">Terms of Service</FooterLink>
          </FooterCol>

          {/* Reach */}
          <FooterCol number="03" section="Reach" heading="Contact">
            <a
              href={`mailto:${email}`}
              className="group flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors"
            >
              <Mail size={14} className="flex-shrink-0 text-foreground/40 group-hover:text-foreground transition-colors" />
              <span className="truncate">{email}</span>
            </a>
            <Link
              to="/contact"
              className="group flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors"
            >
              <MessageCircle size={14} className="flex-shrink-0 text-foreground/40 group-hover:text-foreground transition-colors" />
              <span>Live Chat</span>
            </Link>
            {activeSocials.length > 0 && (
              <div className="pt-4 mt-2 border-t border-foreground/10 flex flex-wrap gap-2">
                {activeSocials.map(([platform, url]) => {
                  const Icon = socialIcons[platform.toLowerCase()];
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={platform}
                      className="w-9 h-9 rounded-full border border-foreground/15 flex items-center justify-center text-foreground/60 hover:text-foreground hover:border-foreground/40 transition"
                    >
                      {Icon ? <Icon size={14} /> : <span className="text-[10px] uppercase font-mono">{platform[0]}</span>}
                    </a>
                  );
                })}
              </div>
            )}
          </FooterCol>
        </div>

        {/* Meta strip */}
        <div className="mt-16 pt-6 border-t border-foreground/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-[11px] font-mono uppercase tracking-widest text-foreground/50">
          <p>
            © 2018 — {year} {siteName}. All rights reserved.
          </p>
          <p className="sm:text-center">v 4.0 — {year}</p>
          <p className="sm:text-right flex items-center gap-1 sm:justify-end">
            Built with intent · Remote · {location}
            <ArrowUpRight size={12} className="opacity-60" />
          </p>
        </div>
      </div>

      {/* Giant wordmark */}
      <div
        aria-hidden="true"
        className="relative overflow-hidden select-none pointer-events-none"
      >
        <div
          className="whitespace-nowrap text-center font-display font-black tracking-tighter leading-[0.85] pb-2"
          style={{
            fontSize: "clamp(6rem, 22vw, 22rem)",
            background: "linear-gradient(180deg, hsl(var(--foreground) / 0.08) 0%, hsl(var(--foreground) / 0) 90%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {siteName}
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  number,
  section,
  heading,
  children,
}: {
  number: string;
  section: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div className="md:col-span-2 lg:col-span-2 xl:col-span-2 md:[&:nth-child(2)]:col-span-3 md:[&:nth-child(3)]:col-span-2 md:[&:nth-child(4)]:col-span-3">
      <div className="text-[11px] font-mono uppercase tracking-widest text-foreground/40 mb-4">
        {number} / {section}
      </div>
      <h4 className="font-display font-bold text-lg mb-5">{heading}</h4>
      <ul className="space-y-3 text-sm">
        {Array.isArray(children)
          ? children.map((child, i) => <li key={i}>{child}</li>)
          : <li>{children}</li>}
      </ul>
    </div>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="text-foreground/70 hover:text-foreground transition-colors inline-block"
    >
      {children}
    </Link>
  );
}
