import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useExperiences, useSkills, useProfile } from "@/hooks/usePortfolioData";
import {
  Briefcase, CheckCircle, ArrowRight, ArrowUpRight, Sparkles,
  ChevronDown, MapPin, Calendar, Award, Layers,
} from "lucide-react";

/* ---------- Small reusable bits ---------- */

function SectionMarker({ n, label }: { n: string; label: string }) {
  return (
    <div className="section-marker mb-6">
      <span>{n} — {label}</span>
    </div>
  );
}

function MarqueeBand({ items }: { items: string[] }) {
  const track = [...items, ...items, ...items];
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

function Hero({ totalYears, roleCount, skillCount, profile }: any) {
  const name = profile?.name || "Nauman Ellahi";
  return (
    <section className="editorial-container pt-28 sm:pt-32 pb-16 sm:pb-20 relative">
      <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-foreground/60 mb-14">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Experience · {String(roleCount).padStart(2, "0")} roles logged</span>
        </div>
        <span className="hidden sm:block">— {totalYears}+ years shipping</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
        {/* Left — headline */}
        <div className="lg:col-span-8 relative">
          <span className="pill-status mb-8">
            <span className="dot" />
            Background · Where I've built
          </span>

          <h1 className="display-hero text-[clamp(2.75rem,9vw,8rem)] text-foreground">
            <span className="block">A track record</span>
            <span className="block">
              <span className="accent-underline">of shipping</span>{" "}
              <span className="font-serif-italic text-foreground/40">real</span>
            </span>
            <span className="block">software.</span>
          </h1>

          <p className="mt-8 max-w-xl text-base sm:text-lg text-foreground/70 leading-relaxed">
            Every role below produced something that went live — with users, uptime, and a support inbox.
            No lab projects, no throwaway prototypes, no résumé decoration.
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

          <div className="hidden lg:block absolute -left-6 top-40 -rotate-90 origin-top-left font-mono text-[10px] tracking-[0.3em] uppercase text-foreground/40 whitespace-nowrap">
            — Track record · {name}
          </div>
        </div>

        {/* Right — orb + stats */}
        <div className="lg:col-span-4">
          <div className="relative aspect-square max-w-md mx-auto lg:ml-auto">
            <div className="absolute inset-0 rounded-full border border-dashed border-foreground/15" />
            <div className="absolute inset-6 rounded-full border border-foreground/10" />
            <div className="absolute inset-14 rounded-full border border-foreground/5" />
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <Briefcase size={56} strokeWidth={1.2} className="text-foreground/80 mb-4" />
              <div className="display-h2 text-5xl sm:text-6xl leading-none">{String(totalYears).padStart(2, "0")}+</div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-foreground/50 mt-2">Years shipping</div>
            </div>
            <div className="absolute top-4 left-4 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-foreground/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Live · currently shipping
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-2 border border-foreground/10 rounded-2xl p-4 bg-background">
            {[
              { v: String(totalYears).padStart(2, "0"), l: "Years" },
              { v: String(roleCount).padStart(2, "0"), l: "Roles" },
              { v: String(skillCount).padStart(2, "0"), l: "Skills" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <div className="display-h2 text-xl sm:text-2xl">{s.v}</div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-foreground/50 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16 flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-foreground/40">
        <ChevronDown size={14} /> Scroll · timeline below
      </div>
    </section>
  );
}

function ByTheNumbers({ totalYears, roleCount, skillCount }: any) {
  const items = [
    { pct: String(totalYears).padStart(2, "0") + "+", sub: "years in production", h: "Shipping since day one", p: "From first freelance CMS builds to full SaaS launches — every year has been a real client, a real deadline, and a live URL at the end." },
    { pct: String(roleCount).padStart(2, "0"), sub: "roles logged", h: "Contract, staff, freelance", p: "Worked as staff engineer, solo contractor, and embedded studio lead — the mix keeps the process sharp and the scope realistic." },
    { pct: String(skillCount).padStart(2, "0") + "+", sub: "tools in rotation", h: "Boring stack, sharp edges", p: "Every tool listed has been used in production, in anger, on paying work. No résumé-padding, no toy familiarity." },
  ];
  return (
    <section className="editorial-section editorial-container rule-top">
      <SectionMarker n="01" label="By the numbers" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-16">
        <h2 className="display-h2 text-4xl sm:text-6xl lg:text-7xl lg:col-span-8">
          A career of <span className="font-serif-italic text-foreground/70">shipped</span> things.
        </h2>
        <p className="lg:col-span-4 text-foreground/60 text-base leading-relaxed">
          Three numbers that tell the whole story better than any bullet list ever could.
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

function CurrentSpotlight({ currentRole }: any) {
  if (!currentRole) return null;
  return (
    <section className="editorial-section editorial-container rule-top">
      <SectionMarker n="02" label="Currently" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-16">
        <h2 className="display-h2 text-4xl sm:text-6xl lg:text-7xl lg:col-span-8">
          Right now, <span className="font-serif-italic text-foreground/70">in the seat.</span>
        </h2>
        <p className="lg:col-span-4 text-foreground/60 text-base leading-relaxed">
          The live engagement — where the current week's commits, meetings and demos are going.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-foreground/15 rounded-3xl overflow-hidden bg-background"
      >
        <div className="lg:col-span-7 p-8 sm:p-12">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-foreground/50 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Now · Live engagement
          </div>
          <h3 className="display-h2 text-3xl sm:text-4xl md:text-5xl mb-3 leading-tight">
            {currentRole.role}
          </h3>
          <p className="font-serif-italic text-foreground/60 mb-6 text-lg">
            {currentRole.company}{currentRole.location ? ` · ${currentRole.location}` : ""}
          </p>
          <p className="text-base sm:text-lg text-foreground/70 leading-relaxed mb-8">
            {currentRole.description ||
              "Leading frontend architecture and shipping cadence — weekly demos, tight scope, real handoffs. Current focus is on performance, auth, and admin tooling that a non-technical team can actually run."}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3.5 bg-foreground text-background rounded-full font-medium hover:opacity-90 transition">
              Start a brief <ArrowRight size={16} />
            </Link>
            <Link to="/portfolio" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-foreground/20 hover:border-foreground/50 transition font-medium">
              See work <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
        <div className="lg:col-span-5 bg-foreground/[0.03] border-t lg:border-t-0 lg:border-l border-foreground/10 p-8 sm:p-12">
          <div className="text-[10px] font-mono uppercase tracking-widest text-foreground/50 mb-6">
            Highlights · what's shipping
          </div>
          <ul className="space-y-4">
            {(currentRole.highlights && currentRole.highlights.length
              ? currentRole.highlights
              : [
                  "Weekly production releases with zero-downtime deploys",
                  "Owned frontend architecture end-to-end",
                  "Auth, RBAC and audit-log foundations shipped",
                  "Speed budget enforced on every merge",
                ]
            ).slice(0, 6).map((h: string, i: number) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 text-[10px] font-mono text-foreground/40 pt-1">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-foreground/80 text-sm leading-relaxed">{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}

function Timeline({ experiences }: any) {
  if (!experiences?.length) return null;
  return (
    <section className="editorial-section editorial-container rule-top">
      <SectionMarker n="03" label="Timeline" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-16">
        <h2 className="display-h2 text-4xl sm:text-6xl lg:text-7xl lg:col-span-8">
          Roles, <span className="font-serif-italic text-foreground/70">reverse-chronological.</span>
        </h2>
        <p className="lg:col-span-4 text-foreground/60 text-base leading-relaxed">
          Every card is a real engagement — company, dates, and the things that actually went live under my name.
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-6 sm:left-8 top-2 bottom-2 w-px bg-foreground/15" />
        <div className="space-y-6">
          {experiences.map((exp: any, i: number) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="relative pl-16 sm:pl-20"
            >
              <div className="absolute left-3 sm:left-5 top-6 w-7 h-7 rounded-full bg-background border border-foreground/20 flex items-center justify-center z-10">
                <Briefcase size={12} />
              </div>
              <div className="border border-foreground/10 rounded-2xl bg-background p-6 sm:p-8 hover:border-foreground/40 transition">
                <div className="flex flex-wrap items-center gap-3 mb-4 text-[11px] font-mono uppercase tracking-widest text-foreground/50">
                  <Calendar size={12} />
                  <span>
                    {new Date(exp.start_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })} →{" "}
                    {exp.is_current
                      ? "Present"
                      : exp.end_date
                      ? new Date(exp.end_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                      : "—"}
                  </span>
                  {exp.is_current && (
                    <span className="px-2 py-0.5 rounded-full bg-foreground text-background text-[10px]">Current</span>
                  )}
                  <span className="ml-auto">Role · {String(i + 1).padStart(2, "0")} / {String(experiences.length).padStart(2, "0")}</span>
                </div>

                <h3 className="display-h2 text-2xl sm:text-3xl mb-2">{exp.role}</h3>
                <p className="text-foreground/60 mb-5 text-sm sm:text-base flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-medium text-foreground/80">{exp.company}</span>
                  {exp.location && (
                    <>
                      <span className="text-foreground/30">·</span>
                      <span className="inline-flex items-center gap-1"><MapPin size={12} />{exp.location}</span>
                    </>
                  )}
                </p>

                {exp.description && (
                  <p className="text-sm sm:text-base text-foreground/70 leading-relaxed mb-5">
                    {exp.description}
                  </p>
                )}

                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 pt-5 border-t border-foreground/10">
                    {exp.highlights.map((h: string, j: number) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-foreground/70">
                        <CheckCircle size={14} className="mt-1 flex-shrink-0 text-foreground/70" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillsSection({ skills }: any) {
  const [activeCat, setActiveCat] = useState<string>("all");

  const skillsByCategory = useMemo(() => {
    return (skills || []).reduce((acc: Record<string, any[]>, s: any) => {
      (acc[s.category] ||= []).push(s);
      return acc;
    }, {});
  }, [skills]);

  const categories = useMemo(
    () => ["all", ...Object.keys(skillsByCategory)],
    [skillsByCategory]
  );

  const visibleSkills = useMemo(() => {
    if (activeCat === "all") return skills || [];
    return (skills || []).filter((s: any) => s.category === activeCat);
  }, [skills, activeCat]);

  return (
    <section className="editorial-section editorial-container rule-top">
      <SectionMarker n="04" label="Capabilities" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-16">
        <h2 className="display-h2 text-4xl sm:text-6xl lg:text-7xl lg:col-span-8">
          Tools I use <span className="font-serif-italic text-foreground/70">daily.</span>
        </h2>
        <p className="lg:col-span-4 text-foreground/60 text-base leading-relaxed">
          Filter by category — every entry is production-tested on paying client work, not tutorial familiarity.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCat(c)}
            className={`px-3 py-1.5 rounded-full border text-[11px] font-mono uppercase tracking-widest transition ${
              activeCat === c
                ? "bg-foreground text-background border-foreground"
                : "border-foreground/15 text-foreground/70 hover:border-foreground/40"
            }`}
          >
            {c === "all" ? `All · ${skills?.length || 0}` : `${c} · ${skillsByCategory[c]?.length || 0}`}
          </button>
        ))}
      </div>

      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleSkills.map((skill: any, i: number) => (
          <motion.div
            key={skill.id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (i % 12) * 0.03 }}
            className="border border-foreground/10 rounded-2xl p-5 bg-background hover:border-foreground/40 transition"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/50">{skill.category}</span>
              <span className="text-[10px] font-mono text-foreground/40">{skill.level}%</span>
            </div>
            <h3 className="font-display text-lg mb-3">{skill.name}</h3>
            <div className="h-1 w-full bg-foreground/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-foreground"
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {visibleSkills.length === 0 && (
        <div className="border border-dashed border-foreground/15 rounded-2xl p-16 text-center text-foreground/50">
          <Sparkles size={22} className="mx-auto mb-3" />
          No skills in this category yet.
        </div>
      )}
    </section>
  );
}

function HowIWork() {
  const items = [
    { t: "Small scopes, real deadlines", d: "Every engagement is broken into 1–2 week chunks with a live demo at the end. Nothing goes dark for a month." },
    { t: "Boring stack on purpose", d: "React, TypeScript, Node, Postgres — the tools every future developer can pick up and keep running long after I'm gone." },
    { t: "Ship weekly, not eventually", d: "Working software on the URL every Friday beats a polished slide deck every time. Momentum compounds; polish comes last." },
    { t: "Own it or don't ship it", d: "If I put my name on it, I take the on-call. Bugs get fixed, uptime gets watched, handoff docs get written." },
  ];
  return (
    <section className="editorial-section editorial-container rule-top">
      <SectionMarker n="05" label="How I work" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-16">
        <h2 className="display-h2 text-4xl sm:text-6xl lg:text-7xl lg:col-span-8">
          The habits <span className="font-serif-italic text-foreground/70">behind the résumé.</span>
        </h2>
        <p className="lg:col-span-4 text-foreground/60 text-base leading-relaxed">
          Four principles that show up in every role above — the reason things actually reach production.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-foreground/10 border border-foreground/10 rounded-2xl overflow-hidden">
        {items.map((it, i) => (
          <div key={i} className="bg-background p-8 sm:p-10 relative">
            <div className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 mb-8">
              Principle {String(i + 1).padStart(2, "0")} / 04
            </div>
            <h3 className="display-h2 text-2xl sm:text-3xl mb-4">{it.t}</h3>
            <p className="text-foreground/60 leading-relaxed">{it.d}</p>
            <div className="absolute top-6 right-8 display-h2 text-6xl text-foreground/5">
              {String(i + 1).padStart(2, "0")}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function EngageCTA() {
  return (
    <section className="editorial-section editorial-container rule-top">
      <SectionMarker n="→" label="Engage" />
      <div className="border border-foreground/10 rounded-3xl p-10 sm:p-16 bg-foreground text-background">
        <h2 className="display-h2 text-4xl sm:text-6xl lg:text-7xl max-w-4xl text-background">
          Need a builder <span className="font-serif-italic text-background/70">who's done it before?</span>
        </h2>
        <p className="mt-6 text-background/70 max-w-xl">
          Send the brief. You'll get a concrete plan, a fixed price, and a delivery date you can put on a calendar.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3.5 bg-background text-foreground rounded-full font-medium hover:opacity-90 transition">
            Start a project <ArrowUpRight size={16} />
          </Link>
          <Link to="/portfolio" className="inline-flex items-center gap-2 px-6 py-3.5 border border-background/30 text-background rounded-full font-medium hover:bg-background/10 transition">
            See portfolio <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- Page ---------- */

export default function Experience() {
  const { data: experiences } = useExperiences();
  const { data: skills } = useSkills();
  const { data: profile } = useProfile();

  const totalYears = useMemo(() => {
    if (!experiences || experiences.length === 0) return 5;
    const start = experiences.reduce((min: Date, e: any) => {
      const d = new Date(e.start_date);
      return d < min ? d : min;
    }, new Date());
    return Math.max(1, Math.floor((Date.now() - start.getTime()) / (365.25 * 24 * 3600 * 1000)));
  }, [experiences]);

  const roleCount = experiences?.length || 0;
  const skillCount = skills?.length || 0;
  const currentRole = experiences?.find((e: any) => e.is_current);

  const marqueeTags = useMemo(() => {
    const tags = (skills || []).slice(0, 14).map((s: any) => s.name);
    return tags.length
      ? tags
      : ["React", "TypeScript", "Node.js", "PostgreSQL", "Supabase", "Next.js", "Tailwind", "Stripe", "Auth & RBAC", "Realtime"];
  }, [skills]);

  return (
    <Layout>
      <Hero totalYears={totalYears} roleCount={roleCount} skillCount={skillCount} profile={profile} />
      <MarqueeBand items={marqueeTags} />
      <ByTheNumbers totalYears={totalYears} roleCount={roleCount} skillCount={skillCount} />
      <CurrentSpotlight currentRole={currentRole} />
      <Timeline experiences={experiences} />
      <SkillsSection skills={skills} />
      <HowIWork />
      <EngageCTA />
    </Layout>
  );
}
