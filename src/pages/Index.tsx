import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowUpRight, ArrowRight, ChevronDown, Plus, Minus, Star,
  Shield, Database, Settings, Gauge, Lock, Users, Code, Layers,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import {
  useProfile, useProjects, useServices, useTestimonials, useSiteSettings,
} from "@/hooks/usePortfolioData";

/* ---------- Small reusable bits ---------- */

function SectionMarker({ n, label }: { n: string; label: string }) {
  return (
    <div className="section-marker mb-6">
      <span>{n} — {label}</span>
    </div>
  );
}

function MarqueeBand() {
  const tags = [
    "Web Apps", "Admin Panels", "Dashboards", "SaaS", "React", "Next.js",
    "Supabase", "PostgreSQL", "Auth & RBAC", "Node.js", "TypeScript", "Stripe",
    "REST & GraphQL", "Realtime", "Edge Functions",
  ];
  const track = [...tags, ...tags];
  return (
    <div className="marquee-wrap overflow-hidden rule-top rule-bottom py-5 bg-background">
      <div className="marquee-track">
        {track.map((t, i) => (
          <span key={i} className="flex items-center gap-3 text-sm text-foreground/70">
            <span className="text-foreground/30">✦</span>
            <span className="whitespace-nowrap">{t}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Sections ---------- */

function Hero({ profile, settings }: any) {
  const name = profile?.name || settings?.site_name || "Nauman Ellahi";
  const initial = (name?.[0] || "N").toUpperCase();

  return (
    <section className="editorial-container pt-28 sm:pt-32 pb-16 sm:pb-20 relative">
      {/* Top status strip */}
      <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-foreground/60 mb-14">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Studio Open · Accepting Briefs</span>
        </div>
        <span className="hidden sm:block">— Reply within 12–24h</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
        {/* Left column — headline */}
        <div className="lg:col-span-8 relative">
          <span className="pill-status mb-8">
            <span className="dot" />
            Top-rated developer · 5.0 rating
          </span>

          <h1 className="display-hero text-[clamp(3rem,9vw,8.5rem)] text-foreground">
            <span className="block">I build</span>
            <span className="block">
              <span className="accent-underline">secure</span>{" "}
              <span className="font-serif-italic text-foreground/70">web apps</span>
            </span>
            <span className="block">that ship.</span>
          </h1>

          <p className="mt-8 max-w-xl text-base sm:text-lg text-foreground/70 leading-relaxed">
            Independent engineer building custom web apps, admin panels and
            dashboards for founders, startups and small teams — clean code,
            real deadlines, full ownership.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-foreground text-background rounded-full font-medium hover:opacity-90 transition"
            >
              Start a Project <ArrowUpRight size={16} />
            </Link>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-foreground/20 hover:border-foreground/50 transition font-medium"
            >
              Selected Work <ArrowUpRight size={16} />
            </Link>
          </div>

          {/* Vertical est. label */}
          <div className="hidden lg:block absolute -left-6 top-40 -rotate-90 origin-top-left font-mono text-[10px] tracking-[0.3em] uppercase text-foreground/40 whitespace-nowrap">
            — Independent Studio · Est. 2020
          </div>
        </div>

        {/* Right column — orb card */}
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
              Live · currently shipping
            </div>
          </div>

          {/* Stat strip */}
          <div className="mt-8 grid grid-cols-3 gap-2 border border-foreground/10 rounded-2xl p-4 bg-background">
            {[
              { v: "50+", l: "Projects" },
              { v: "12-24h", l: "Response" },
              { v: "5.0", l: "Rating" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <div className="display-h2 text-xl sm:text-2xl">{s.v}</div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-foreground/50 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="mt-16 flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-foreground/40">
        <ChevronDown size={14} /> Scroll
      </div>
    </section>
  );
}

function WhyItMatters() {
  const items = [
    { pct: "53%", sub: "bounce after 3s", h: "Slow, bloated apps", p: "Users abandon dashboards that lag. Every extra second costs conversions." },
    { pct: "81%", sub: "of breaches", h: "Weak auth & RBAC", p: "Most incidents trace back to sloppy authentication and broken access control." },
    { pct: "0", sub: "code required", h: "Can't manage content", p: "Your team shouldn't need a developer to change a headline or add a user." },
  ];

  return (
    <section className="editorial-section editorial-container">
      <SectionMarker n="01" label="Why it matters" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-16">
        <h2 className="display-h2 text-4xl sm:text-6xl lg:text-7xl lg:col-span-8">
          Your app is either <span className="font-serif-italic text-foreground/70">earning</span> — or leaking.
        </h2>
        <p className="lg:col-span-4 text-foreground/60 text-base leading-relaxed">
          Three silent costs that compound quietly every month — until they're addressed at the foundation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-foreground/10 border border-foreground/10 rounded-2xl overflow-hidden">
        {items.map((it, i) => (
          <div key={i} className="bg-background p-8 sm:p-10">
            <div className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 mb-8">
              {String(i + 1).padStart(2, "0")} / 03
            </div>
            <div className="display-h2 text-5xl sm:text-6xl mb-1">{it.pct}</div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 mb-8">{it.sub}</div>
            <h3 className="text-xl font-semibold mb-3">{it.h}</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">{it.p}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhyMe() {
  const caps = [
    { t: "Independent Engineer, Not an Agency", d: "You work directly with me — no account managers, no handoffs, no diluted quality. Every line of code is written by the person you hired." },
    { t: "Fixed USD Pricing for Global Clients", d: "Clear scopes, milestone billing, USD invoicing. You know the cost before we write a single line of code." },
    { t: "5.0★ Verified International Reviews", d: "Consistent 5-star feedback from clients in the US, UK, EU and Australia — verified on independent platforms." },
    { t: "Weekly Demos & Transparent Process", d: "Live working software every Friday. No surprises, no month-long silences, no vaporware." },
    { t: "You Own 100% of the Code", d: "Full source code, credentials and documentation on delivery. No lock-in, no rented licenses." },
    { t: "Built for Serious Teams", d: "Auth, RBAC, protected data, audit trails. Enterprise foundations without enterprise bloat." },
  ];
  const [active, setActive] = useState(0);
  const cur = caps[active];

  return (
    <section className="editorial-section editorial-container rule-top">
      <SectionMarker n="02" label="Why me" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-16">
        <h2 className="display-h2 text-4xl sm:text-6xl lg:text-7xl lg:col-span-8">
          Built like a studio. <span className="font-serif-italic text-foreground/70">Run like an engine.</span>
        </h2>
        <p className="lg:col-span-4 text-foreground/60 text-base leading-relaxed">
          Independent engineer serving US, UK, EU and Australian clients — fixed pricing, weekly demos, full code ownership.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Capability list */}
        <div className="lg:col-span-7">
          <div className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 mb-4">
            // Capabilities · 06 total
          </div>
          <ul className="divide-y divide-foreground/10 border-y border-foreground/10">
            {caps.map((c, i) => (
              <li key={i}>
                <button
                  onClick={() => setActive(i)}
                  className={`w-full text-left flex items-baseline gap-6 py-5 group transition ${
                    active === i ? "text-foreground" : "text-foreground/50 hover:text-foreground"
                  }`}
                >
                  <span className="font-mono text-xs w-8">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-lg sm:text-xl font-medium flex-1">{c.t}</span>
                  <ArrowUpRight size={16} className={`transition-transform ${active === i ? "translate-x-0" : "-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"}`} />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 font-mono text-[10px] uppercase tracking-widest text-foreground/40">
            Hover · click to switch
          </div>
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 border border-foreground/10 rounded-2xl p-8 bg-background">
            <div className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 mb-6">
              Capability · {String(active + 1).padStart(2, "0")} / 06 Active
            </div>
            <h3 className="display-h2 text-2xl sm:text-3xl mb-5">{cur.t}</h3>
            <p className="text-foreground/60 leading-relaxed mb-8">{cur.d}</p>
            <div className="grid grid-cols-2 gap-3">
              {["Web apps & SaaS", "Admin dashboards", "Auth & RBAC systems", "Database design"].map((x) => (
                <div key={x} className="text-sm text-foreground/70 border border-foreground/10 rounded-lg px-3 py-2.5">{x}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesSection({ services }: any) {
  const list = (services || []).slice(0, 5);
  return (
    <section className="editorial-section editorial-container rule-top">
      <SectionMarker n="03" label="Services" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-16">
        <h2 className="display-h2 text-4xl sm:text-6xl lg:text-7xl lg:col-span-8">
          Built for teams <span className="font-serif-italic text-foreground/70">that ship.</span>
        </h2>
        <div className="lg:col-span-4 flex lg:justify-end">
          <Link to="/services" className="inline-flex items-center gap-2 text-sm font-medium border-b border-foreground pb-1 hover:opacity-70 transition">
            All services <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((s: any, i: number) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className={`group border border-foreground/10 rounded-2xl p-8 bg-background hover:border-foreground/40 transition ${
              i === 0 ? "lg:col-span-2 lg:row-span-1 bg-foreground text-background hover:border-foreground" : ""
            }`}
          >
            <div className={`flex items-center justify-between font-mono text-[10px] uppercase tracking-widest mb-8 ${i === 0 ? "text-background/50" : "text-foreground/40"}`}>
              <span>{i === 0 ? "Featured · " : ""}{String(i + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}</span>
              {i === 0 && <span className="pill-status bg-background/10 border-background/20 text-background">Pick</span>}
            </div>
            <h3 className={`display-h2 ${i === 0 ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl"} mb-4`}>
              {s.title}
            </h3>
            <p className={`text-sm leading-relaxed mb-6 ${i === 0 ? "text-background/70" : "text-foreground/60"}`}>
              {s.short_description || s.description}
            </p>
            {s.pricing && (
              <div className={`flex items-baseline gap-3 mb-6 ${i === 0 ? "text-background" : "text-foreground"}`}>
                <span className="text-lg font-semibold">{s.pricing}</span>
                <span className={`text-xs font-mono uppercase tracking-widest ${i === 0 ? "text-background/50" : "text-foreground/50"}`}>Fixed or hourly</span>
              </div>
            )}
            <Link to="/services" className={`inline-flex items-center gap-2 text-sm font-medium border-b pb-1 ${i === 0 ? "border-background hover:opacity-70" : "border-foreground hover:opacity-70"} transition`}>
              Explore service <ArrowRight size={14} />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function SelectedWork({ projects }: any) {
  const list = (projects || []).slice(0, 3);
  if (!list.length) return null;
  return (
    <section className="editorial-section editorial-container rule-top">
      <SectionMarker n="04" label="Selected work" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-16">
        <h2 className="display-h2 text-4xl sm:text-6xl lg:text-7xl lg:col-span-8">
          Real shipped work, <span className="font-serif-italic text-foreground/70">measured.</span>
        </h2>
        <div className="lg:col-span-4 flex lg:justify-end">
          <Link to="/portfolio" className="inline-flex items-center gap-2 text-sm font-medium border-b border-foreground pb-1 hover:opacity-70 transition">
            Browse archive <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {list.map((p: any, i: number) => (
          <Link
            key={p.id}
            to={`/portfolio/${p.slug}`}
            className="group border border-foreground/10 rounded-2xl overflow-hidden bg-background hover:border-foreground/40 transition"
          >
            <div className="p-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-foreground/40">
              <span>Case {String(i + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}</span>
              <span>{p.industry}</span>
            </div>
            <div className="aspect-[4/3] overflow-hidden bg-foreground/5">
              {p.thumbnail_url ? (
                <img src={p.thumbnail_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" loading="lazy" />
              ) : (
                <div className="w-full h-full grid place-items-center text-foreground/20 text-6xl font-display font-bold">
                  {p.title?.[0]}
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-1.5 mb-4">
                {(p.tech_stack || []).slice(0, 4).map((t: string) => (
                  <span key={t} className="text-[10px] font-mono uppercase tracking-widest text-foreground/50 border border-foreground/10 rounded px-2 py-1">
                    {t}
                  </span>
                ))}
              </div>
              <h3 className="text-xl font-semibold mb-3">{p.title}</h3>
              <p className="text-sm text-foreground/60 line-clamp-2 mb-5">{p.short_description}</p>
              <span className="inline-flex items-center gap-2 text-sm font-medium border-b border-foreground pb-0.5">
                View case <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Feedback({ testimonials }: any) {
  const [idx, setIdx] = useState(0);
  const list = (testimonials || []).slice(0, 6);
  if (!list.length) return null;
  const cur = list[idx];
  const initials = (cur.client_name || "").split(" ").map((n: string) => n[0]).slice(0, 2).join("");

  return (
    <section className="editorial-section editorial-container rule-top">
      <SectionMarker n="05" label="Verified feedback" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-16">
        <h2 className="display-h2 text-4xl sm:text-6xl lg:text-7xl lg:col-span-8">
          What <span className="font-serif-italic text-foreground/70">clients</span> say.
        </h2>
        <div className="lg:col-span-4 flex lg:justify-end items-center gap-6">
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
            <span className="text-sm font-medium ml-1">5.0</span>
          </div>
          <Link to="/testimonials" className="inline-flex items-center gap-2 text-sm font-medium border-b border-foreground pb-1 hover:opacity-70 transition">
            Read all <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>

      <div className="border border-foreground/10 rounded-2xl p-8 sm:p-14 bg-background relative">
        <blockquote className="max-w-3xl">
          <p className="text-2xl sm:text-3xl md:text-4xl font-serif-italic text-foreground leading-[1.3]">
            "{cur.message}"
          </p>
        </blockquote>
        <div className="mt-10 flex items-center justify-between flex-wrap gap-6">
          <div className="flex items-center gap-4">
            {cur.avatar_url ? (
              <img src={cur.avatar_url} alt={cur.client_name} className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-foreground text-background grid place-items-center text-sm font-semibold">
                {initials}
              </div>
            )}
            <div>
              <div className="font-semibold">{cur.client_name}</div>
              <div className="text-xs text-foreground/50 font-mono uppercase tracking-widest">
                {cur.role || cur.company || "Verified Client"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-widest text-foreground/50">
            <span>{String(idx + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}</span>
            <button onClick={() => setIdx((idx - 1 + list.length) % list.length)} className="hover:text-foreground">← Prev</button>
            <button onClick={() => setIdx((idx + 1) % list.length)} className="hover:text-foreground">Next →</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  const steps = [
    { t: "Free Discovery Call", d: "A focused 30-minute call — not a sales pitch. We map your goals, target users, must-have features and a realistic timeline. You leave knowing exactly what's possible and what it costs." },
    { t: "Scope & Fixed Proposal", d: "Within 48 hours you receive a written proposal: features, milestones, delivery dates and a fixed USD price. Nothing outside the scope doc gets billed without a conversation first." },
    { t: "Design & Architecture", d: "Before a single line of code, we align on wireframes, data model and technical architecture. Changes here take hours — changes after launch take weeks." },
    { t: "Build & Weekly Demos", d: "Development runs in weekly sprints with a live demo every Friday. You see working software, not screenshots, and give feedback in real time." },
    { t: "QA, Speed & Security", d: "Nothing goes live until it passes the checklist: cross-browser & mobile, Core Web Vitals, security hardening, SEO setup and real-data payment tests." },
    { t: "Launch, Handoff & Support", d: "Deploy to your domain, hand over full source, credentials and docs. Every project includes 30–90 days post-launch support." },
  ];

  return (
    <section className="editorial-section editorial-container rule-top">
      <SectionMarker n="06" label="The process" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-16">
        <h2 className="display-h2 text-4xl sm:text-6xl lg:text-7xl lg:col-span-8">
          From kickoff <span className="font-serif-italic text-foreground/70">to launch.</span>
        </h2>
        <p className="lg:col-span-4 text-foreground/60 text-sm font-mono uppercase tracking-widest">
          6 steps · 2–12 weeks typical
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/10 border border-foreground/10 rounded-2xl overflow-hidden">
        {steps.map((s, i) => (
          <div key={i} className="bg-background p-8 sm:p-10 relative">
            <div className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 mb-8">
              Step {String(i + 1).padStart(2, "0")}
            </div>
            <h3 className="text-2xl font-semibold mb-4">{s.t}</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">{s.d}</p>
            <div className="absolute top-6 right-8 display-h2 text-6xl text-foreground/5">
              {String(i + 1).padStart(2, "0")}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TechStack() {
  const stacks = [
    "React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL",
    "Supabase", "Prisma", "Stripe", "Auth.js", "Vercel", "AWS", "Docker",
    "Cloudflare", "Redis", "REST APIs", "GraphQL", "Zod", "TanStack Query", "Playwright",
  ];
  const track = [...stacks, ...stacks];

  return (
    <section className="editorial-section rule-top">
      <div className="editorial-container">
        <SectionMarker n="07" label="Tech stack" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-16">
          <h2 className="display-h2 text-4xl sm:text-6xl lg:text-7xl lg:col-span-8">
            Boring tech. <span className="font-serif-italic text-foreground/70">Sharp edges.</span>
          </h2>
          <p className="lg:col-span-4 text-foreground/60 text-base leading-relaxed">
            Production-grade tools I ship with daily — proven, documented, maintainable.
          </p>
        </div>
      </div>

      <div className="marquee-wrap overflow-hidden rule-top rule-bottom py-10 bg-background">
        <div className="marquee-track">
          {track.map((s, i) => (
            <span key={i} className="text-2xl sm:text-3xl font-medium text-foreground/70 whitespace-nowrap flex items-center gap-6">
              <span className="text-foreground/20">✦</span> {s}
            </span>
          ))}
        </div>
      </div>

      <div className="editorial-container mt-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-foreground/40">
        <span>← Hover to pause</span>
        <span>{stacks.length} tools · production-grade</span>
        <span>Updated continuously →</span>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    {
      name: "Landing & Marketing Site",
      price: "$1,497",
      hr: "$40/hr",
      d: "High-converting marketing site with CMS — up to 8 pages, SEO, speed optimization. Perfect for founders launching a product.",
      f: ["Custom design & build", "Headless CMS setup", "On-page SEO & schema", "Core Web Vitals optimization", "Analytics & event tracking", "30 days post-launch support"],
    },
    {
      name: "Custom Web App",
      price: "$4,999",
      hr: "$45/hr",
      d: "React & Node full-stack web app with auth, database and API — ideal for MVPs, internal tools and SaaS products.",
      f: ["React / Next.js frontend", "Node.js + PostgreSQL backend", "Authentication & RBAC", "REST/GraphQL API", "Stripe or payments integration", "60 days support + docs"],
    },
    {
      name: "SaaS + Admin Panel Pro",
      price: "$9,999",
      hr: "$50/hr",
      d: "Full SaaS platform with dedicated admin dashboard, multi-tenant auth, billing and analytics — built for teams that need real control.",
      f: ["Everything in Custom Web App", "Custom admin panel & CRUD", "Multi-tenant & team roles", "Subscription billing (Stripe)", "Audit logs & analytics", "90 days support + handoff"],
    },
  ];

  return (
    <section className="editorial-section editorial-container rule-top">
      <SectionMarker n="08" label="Pricing" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-16">
        <h2 className="display-h2 text-4xl sm:text-6xl lg:text-7xl lg:col-span-8">
          Fixed scope. <span className="font-serif-italic text-foreground/70">No surprises.</span>
        </h2>
        <p className="lg:col-span-4 text-foreground/60 text-base leading-relaxed">
          Engagement tiers built around outcomes — pick a lane, start in days, ship in weeks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map((t, i) => (
          <div key={i} className={`rounded-2xl p-8 border transition ${i === 1 ? "bg-foreground text-background border-foreground" : "bg-background border-foreground/10 hover:border-foreground/40"}`}>
            <div className={`flex items-center justify-between font-mono text-[10px] uppercase tracking-widest mb-8 ${i === 1 ? "text-background/50" : "text-foreground/40"}`}>
              <span>Tier {String(i + 1).padStart(2, "0")} / 03</span>
              {i === 1 && <span className="pill-status bg-background/10 border-background/20 text-background">Pick</span>}
            </div>
            <h3 className="display-h2 text-2xl sm:text-3xl mb-5">{t.name}</h3>
            <p className={`text-sm leading-relaxed mb-8 ${i === 1 ? "text-background/70" : "text-foreground/60"}`}>{t.d}</p>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl font-semibold">{t.price}</span>
              <span className={`text-sm ${i === 1 ? "text-background/60" : "text-foreground/60"}`}>or {t.hr}</span>
            </div>
            <div className={`text-xs font-mono uppercase tracking-widest mb-8 ${i === 1 ? "text-background/50" : "text-foreground/50"}`}>Fixed or hourly</div>

            <ul className="space-y-3 mb-8">
              {t.f.map((x) => (
                <li key={x} className="text-sm flex gap-3">
                  <span className={i === 1 ? "text-background/40" : "text-foreground/30"}>—</span>
                  <span className={i === 1 ? "text-background/80" : "text-foreground/70"}>{x}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/contact"
              className={`inline-flex items-center justify-center gap-2 w-full py-3 rounded-full font-medium transition ${
                i === 1
                  ? "bg-background text-foreground hover:opacity-90"
                  : "border border-foreground/20 hover:border-foreground/50"
              }`}
            >
              Start this tier <ArrowUpRight size={14} />
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center font-mono text-[10px] uppercase tracking-widest text-foreground/50">
        ✦ Fixed or hourly (tracked logs) · Free consult · Refund within 7 days
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    { q: "Why work with an independent engineer instead of an agency?", a: "You get direct access to the person writing the code, faster feedback cycles, no account-manager overhead, and pricing that reflects real work rather than agency margins. For projects up to mid-size SaaS, this is usually faster and higher quality." },
    { q: "How much does a custom web app cost?", a: "Landing sites start around $1,497, custom web apps from $4,999, and full SaaS platforms with admin panels from $9,999. All quotes are fixed USD with milestone billing." },
    { q: "Do you work with clients outside your timezone?", a: "Yes — most clients are in the US, UK, EU and Australia. Communication runs on Slack/email with a live demo every Friday, so time zones rarely matter." },
    { q: "Fixed price or hourly?", a: "Both. Well-scoped projects get a fixed USD price with milestone billing. Ongoing work or open-ended R&D runs hourly with tracked logs you can audit at any time." },
    { q: "How long does a typical project take?", a: "Landing sites: 1–3 weeks. Custom web apps: 4–8 weeks. Full SaaS with admin: 8–12 weeks. You get realistic delivery dates in the proposal, not vague estimates." },
    { q: "Do you offer maintenance after launch?", a: "Every project includes 30–90 days of post-launch support. Ongoing maintenance retainers start at $97/mo for updates, monitoring and small feature work." },
    { q: "How do we get started?", a: "Send a brief through the contact form or book a 30-minute discovery call. You'll get a written proposal within 48 hours." },
    { q: "Do I own the code?", a: "100%. Full source, credentials, database and documentation transfer to you on delivery. No proprietary lock-in, no rented licenses." },
  ];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="editorial-section editorial-container rule-top">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12">
        <div className="lg:col-span-4">
          <div className="font-mono text-[11px] uppercase tracking-widest text-foreground/40 mb-4">FAQ</div>
          <h2 className="display-h2 text-4xl sm:text-5xl lg:text-6xl">Common <span className="font-serif-italic text-foreground/70">Questions</span></h2>
          <p className="mt-6 text-foreground/60">Quick answers to what clients ask most.</p>
        </div>
        <div className="lg:col-span-8">
          <div className="divide-y divide-foreground/10 border-y border-foreground/10">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={i}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-start justify-between gap-6 py-5 text-left group"
                  >
                    <span className="text-lg sm:text-xl font-medium">{f.q}</span>
                    <span className="mt-1 text-foreground/60 group-hover:text-foreground transition">
                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="pb-6 pr-10 text-foreground/60 leading-relaxed">{f.a}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function BriefForm() {
  return (
    <section className="editorial-section editorial-container rule-top">
      <SectionMarker n="09" label="Start a project" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-16">
        <h2 className="display-h2 text-4xl sm:text-6xl lg:text-7xl lg:col-span-8">
          Tell me the brief. <span className="font-serif-italic text-foreground/70">I reply fast.</span>
        </h2>
        <p className="lg:col-span-4 text-foreground/60">
          A short form — scope, timeline, budget. You'll get a response within 12–24 hours with next steps.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <div className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 mb-6">Project brief</div>
          <ul className="space-y-6">
            {[
              { h: "Response", v: "12 — 24h" },
              { h: "Commitment", v: "None required" },
              { h: "Format", v: "Video · Phone · Chat" },
              { h: "Timezone", v: "Flexible · Global" },
            ].map((x) => (
              <li key={x.h} className="border-b border-foreground/10 pb-4">
                <div className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 mb-1">{x.h}</div>
                <div className="text-xl font-medium">{x.v}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7 border border-foreground/10 rounded-2xl p-8 bg-background">
          <p className="text-foreground/60 mb-6">
            Use the full contact form to send project details — I'll follow up personally.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-foreground text-background rounded-full font-medium hover:opacity-90 transition"
          >
            Open contact form <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function EngageCTA() {
  return (
    <section className="editorial-section editorial-container rule-top">
      <SectionMarker n="10" label="Engage" />
      <div className="border border-foreground/10 rounded-3xl p-10 sm:p-16 bg-foreground text-background">
        <h2 className="display-h2 text-4xl sm:text-6xl lg:text-7xl max-w-4xl">
          Got a brief? <span className="font-serif-italic text-background/70">Let's build it.</span>
        </h2>
        <p className="mt-6 text-background/70 max-w-xl">
          30-minute discovery call. No slide decks, no pressure — just a candid look at what's possible.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3.5 bg-background text-foreground rounded-full font-medium hover:opacity-90 transition">
            Book a call <ArrowUpRight size={16} />
          </Link>
          <a
            href="https://wa.me/923331401384"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 border border-background/30 rounded-full font-medium hover:bg-background/10 transition"
          >
            WhatsApp <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------- Page ---------- */

export default function Index() {
  const { data: profile } = useProfile();
  const { data: projects } = useProjects({ featured: true, limit: 6 });
  const { data: services } = useServices({ limit: 6 });
  const { data: testimonials } = useTestimonials({ limit: 6 });
  const { data: settings } = useSiteSettings();

  return (
    <Layout>
      <div className="editorial">
        <Hero profile={profile} settings={settings} />
        <MarqueeBand />
        <WhyItMatters />
        <WhyMe />
        <ServicesSection services={services} />
        <SelectedWork projects={projects} />
        <Feedback testimonials={testimonials} />
        <ProcessSection />
        <TechStack />
        <Pricing />
        <FAQ />
        <BriefForm />
        <EngageCTA />
      </div>
    </Layout>
  );
}
