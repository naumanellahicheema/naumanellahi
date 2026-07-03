import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight, MapPin, Mail, Phone, GraduationCap, Briefcase, Download,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useProfile, useExperiences, useSkills } from "@/hooks/usePortfolioData";

function SectionMarker({ n, label }: { n: string; label: string }) {
  return (
    <div className="section-marker mb-6">
      <span>{n} — {label}</span>
    </div>
  );
}

export default function About() {
  const { data: profile } = useProfile();
  const { data: experiences } = useExperiences();
  const { data: skills } = useSkills();

  const name = profile?.name || "Nauman Ellahi";
  const initial = name.charAt(0).toUpperCase();
  const years = profile?.experience_start_year
    ? new Date().getFullYear() - profile.experience_start_year
    : 5;

  // Group skills by category
  const grouped: Record<string, any[]> = {};
  (skills || []).forEach((s: any) => {
    const c = s.category || "General";
    (grouped[c] = grouped[c] || []).push(s);
  });
  const categories = Object.entries(grouped);

  return (
    <Layout>
      {/* ── Hero ───────────────────────────────────── */}
      <section className="editorial-container pt-28 sm:pt-32 pb-14">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-foreground/60 mb-14">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>About · {profile?.location || "Independent Studio"}</span>
          </div>
          <span className="hidden sm:block">— Est. {profile?.experience_start_year || 2020}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          <div className="lg:col-span-8">
            <span className="pill-status mb-8"><span className="dot" /> {profile?.title || "Independent Engineer"}</span>
            <h1 className="display-hero text-[clamp(2.75rem,8vw,7rem)] text-foreground">
              <span className="block">Hi, I'm</span>
              <span className="block">
                <span className="accent-underline">{name.split(" ")[0]}</span>{" "}
                <span className="font-serif-italic text-foreground/40">{name.split(" ").slice(1).join(" ")}</span>
              </span>
              <span className="block">
                — engineer <span className="font-serif-italic text-foreground/40">of</span> web apps.
              </span>
            </h1>
            <p className="mt-8 max-w-xl text-base sm:text-lg text-foreground/70 leading-relaxed">
              {profile?.short_bio ||
                "Independent engineer building custom web apps, admin panels and dashboards for founders, startups and small teams — clean code, real deadlines, full ownership."}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-foreground text-background rounded-full font-medium hover:opacity-90 transition"
              >
                Work with me <ArrowUpRight size={16} />
              </Link>
              {profile?.resume_url && (
                <a
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-foreground/20 hover:border-foreground/50 transition font-medium"
                >
                  <Download size={16} /> Resume
                </a>
              )}
            </div>
          </div>

          {/* Orb portrait */}
          <div className="lg:col-span-4">
            <div className="relative aspect-square max-w-md mx-auto lg:ml-auto">
              <div className="absolute inset-0 rounded-full border border-dashed border-foreground/15" />
              <div className="absolute inset-6 rounded-full border border-foreground/10" />
              <div className="absolute inset-14 rounded-full border border-foreground/5" />
              <div className="absolute inset-0 flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={name}
                    className="w-40 h-40 sm:w-56 sm:h-56 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-[10rem] font-display font-bold leading-none">{initial}</span>
                )}
              </div>
              <div className="absolute top-4 left-4 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-foreground/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Available for work
              </div>
            </div>

            {/* Contact strip */}
            <div className="mt-8 border border-foreground/10 rounded-2xl bg-background divide-y divide-foreground/10">
              {[
                { icon: MapPin, label: "Location", value: profile?.location || "—" },
                { icon: Mail, label: "Email", value: settings?.contact_email || "—", href: settings?.contact_email && `mailto:${settings.contact_email}` },
                { icon: Phone, label: "Phone", value: settings?.contact_phone || "—", href: settings?.contact_phone && `tel:${settings.contact_phone}` },
                { icon: GraduationCap, label: "Education", value: profile?.education || "—" },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-4 px-5 py-3.5">
                  <Icon size={16} className="text-foreground/40 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">{label}</div>
                    {href ? (
                      <a href={href} className="text-sm truncate block hover:underline">{value}</a>
                    ) : (
                      <div className="text-sm truncate">{value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ────────────────────────────── */}
      <section className="editorial-container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-foreground/10 border border-foreground/10 rounded-2xl overflow-hidden">
          {[
            { v: `${years}+`, l: "Years shipping" },
            { v: (experiences?.length || 0) + "+", l: "Roles held" },
            { v: (skills?.length || 0) + "+", l: "Technologies" },
            { v: "5.0★", l: "Client rating" },
          ].map((s) => (
            <div key={s.l} className="bg-background p-6 sm:p-8 text-center">
              <div className="display-h2 text-3xl sm:text-4xl mb-2">{s.v}</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-foreground/50">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Story / Bio ────────────────────────────── */}
      <section className="editorial-section editorial-container rule-top">
        <SectionMarker n="01" label="My story" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <h2 className="lg:col-span-5 display-h2 text-4xl sm:text-5xl lg:text-6xl">
            Building for the <span className="font-serif-italic text-foreground/60">long game.</span>
          </h2>
          <div className="lg:col-span-7 text-base sm:text-lg text-foreground/70 leading-relaxed space-y-5 whitespace-pre-line">
            {profile?.bio ||
              "I'm an independent engineer who ships custom web apps end-to-end — from database schema to the pixel. I care about clean architecture, fast page loads, honest deadlines and code you actually own after launch."}
          </div>
        </div>
      </section>

      {/* ── Experience timeline ────────────────────── */}
      <section className="editorial-section editorial-container rule-top">
        <SectionMarker n="02" label="Experience" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-16">
          <h2 className="display-h2 text-4xl sm:text-6xl lg:text-7xl lg:col-span-8">
            Roles & <span className="font-serif-italic text-foreground/60">chapters.</span>
          </h2>
          <p className="lg:col-span-4 text-foreground/60 text-sm font-mono uppercase tracking-widest">
            {experiences?.length || 0} entries · Most recent first
          </p>
        </div>

        {experiences?.length ? (
          <ul className="divide-y divide-foreground/10 border-y border-foreground/10">
            {experiences.map((exp: any, i: number) => (
              <motion.li
                key={exp.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-8"
              >
                <div className="lg:col-span-3">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 mb-2">
                    {String(i + 1).padStart(2, "0")} / {String(experiences.length).padStart(2, "0")}
                  </div>
                  <div className="text-sm font-mono text-foreground/70">
                    {new Date(exp.start_date).getFullYear()} —{" "}
                    {exp.is_current ? "Present" : exp.end_date ? new Date(exp.end_date).getFullYear() : "—"}
                  </div>
                  <div className="text-xs text-foreground/50 mt-1">{exp.location}</div>
                </div>

                <div className="lg:col-span-9">
                  <div className="flex items-start gap-3 mb-3">
                    <Briefcase size={18} className="text-foreground/40 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl sm:text-2xl font-semibold">{exp.role}</h3>
                      <div className="text-sm text-foreground/60">{exp.company}</div>
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-foreground/60 leading-relaxed mb-4">{exp.description}</p>
                  )}
                  {exp.highlights?.length > 0 && (
                    <ul className="space-y-2">
                      {exp.highlights.map((h: string, k: number) => (
                        <li key={k} className="text-sm text-foreground/70 flex gap-3">
                          <span className="text-foreground/30">—</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.li>
            ))}
          </ul>
        ) : (
          <div className="border border-dashed border-foreground/20 rounded-2xl py-16 text-center text-foreground/50 text-sm font-mono uppercase tracking-widest">
            No experience entries yet.
          </div>
        )}
      </section>

      {/* ── Skills by category ─────────────────────── */}
      <section className="editorial-section editorial-container rule-top">
        <SectionMarker n="03" label="Skills & stack" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-16">
          <h2 className="display-h2 text-4xl sm:text-6xl lg:text-7xl lg:col-span-8">
            The <span className="font-serif-italic text-foreground/60">toolkit.</span>
          </h2>
          <p className="lg:col-span-4 text-foreground/60 text-base leading-relaxed">
            Production-grade tools I ship with daily — grouped by where they live in the stack.
          </p>
        </div>

        {categories.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/10 border border-foreground/10 rounded-2xl overflow-hidden">
            {categories.map(([cat, list], i) => (
              <div key={cat} className="bg-background p-8">
                <div className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 mb-6">
                  {String(i + 1).padStart(2, "0")} · {cat}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {list.map((s: any) => (
                    <span
                      key={s.id}
                      className="text-sm border border-foreground/10 rounded-full px-3 py-1.5 text-foreground/80 hover:border-foreground/40 transition"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-foreground/20 rounded-2xl py-16 text-center text-foreground/50 text-sm font-mono uppercase tracking-widest">
            No skills listed yet.
          </div>
        )}
      </section>

      {/* ── CTA ────────────────────────────────────── */}
      <section className="editorial-section editorial-container rule-top">
        <SectionMarker n="04" label="Engage" />
        <div className="border border-foreground/10 rounded-3xl p-10 sm:p-16 bg-foreground text-background">
          <h2 className="display-h2 text-4xl sm:text-6xl lg:text-7xl max-w-4xl">
            Let's build something <span className="font-serif-italic text-background/70">worth shipping.</span>
          </h2>
          <p className="mt-6 text-background/70 max-w-xl">
            Send the brief — response within 12–24 hours with next steps, timeline and a fixed USD proposal.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3.5 bg-background text-foreground rounded-full font-medium hover:opacity-90 transition">
              Start a project <ArrowUpRight size={16} />
            </Link>
            <Link to="/portfolio" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-background/30 hover:border-background/60 transition font-medium">
              See selected work <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
