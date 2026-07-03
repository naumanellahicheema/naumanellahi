import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useExperiences, useSkills } from "@/hooks/usePortfolioData";
import { Briefcase, CheckCircle, ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";

function SectionMarker({ n, label }: { n: string; label: string }) {
  return (
    <div className="section-marker mb-6">
      <span>{n} — {label}</span>
    </div>
  );
}

export default function Experience() {
  const { data: experiences } = useExperiences();
  const { data: skills } = useSkills();
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

  const totalYears = useMemo(() => {
    if (!experiences || experiences.length === 0) return 0;
    const start = experiences.reduce((min: Date, e: any) => {
      const d = new Date(e.start_date);
      return d < min ? d : min;
    }, new Date());
    return Math.max(1, Math.floor((Date.now() - start.getTime()) / (365.25 * 24 * 3600 * 1000)));
  }, [experiences]);

  const roleCount = experiences?.length || 0;
  const skillCount = skills?.length || 0;
  const currentRole = experiences?.find((e: any) => e.is_current);

  return (
    <Layout>
      {/* Hero */}
      <section className="editorial-container pt-28 sm:pt-32 pb-14">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-foreground/60 mb-14">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Experience · {roleCount} roles logged</span>
          </div>
          <span className="hidden sm:block">— {totalYears}+ years shipping</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            <span className="pill-status mb-8"><span className="dot" /> Background · Where I've built</span>
            <h1 className="display-hero text-[clamp(2.75rem,8vw,7rem)] text-foreground">
              <span className="block">A track record</span>
              <span className="block">
                <span className="accent-underline">of shipping</span>{" "}
                <span className="font-serif-italic text-foreground/40">real</span>
              </span>
              <span className="block">software.</span>
            </h1>
            <p className="mt-8 max-w-xl text-base sm:text-lg text-foreground/70 leading-relaxed">
              Every role below produced something that went live — with users, uptime, and a support inbox. No lab projects, no throwaway prototypes.
            </p>
          </div>

          <div className="lg:col-span-4">
            <div className="grid grid-cols-3 gap-2 border border-foreground/10 rounded-2xl p-4 bg-background">
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
      </section>

      {/* Current role spotlight */}
      {currentRole && (
        <section className="editorial-section editorial-container rule-top">
          <SectionMarker n="01" label="Currently" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 border border-foreground/15 rounded-3xl overflow-hidden bg-background"
          >
            <div className="lg:col-span-7 p-8 sm:p-12">
              <div className="text-[10px] font-mono uppercase tracking-widest text-foreground/50 mb-4">Now · Live engagement</div>
              <h2 className="display-h2 text-3xl sm:text-4xl md:text-5xl mb-3 leading-tight">
                {currentRole.role}
              </h2>
              <p className="font-serif-italic text-foreground/60 mb-6 text-lg">
                {currentRole.company}{currentRole.location ? ` · ${currentRole.location}` : ""}
              </p>
              {currentRole.description && (
                <p className="text-base sm:text-lg text-foreground/70 leading-relaxed mb-8">
                  {currentRole.description}
                </p>
              )}
              <div className="flex flex-wrap gap-3">
                <Link to="/contact" className="btn-hero">Start a brief <ArrowRight size={16} /></Link>
                <Link to="/portfolio" className="btn-outline-hero">See work <ArrowUpRight size={16} /></Link>
              </div>
            </div>
            <div className="lg:col-span-5 bg-foreground/[0.03] border-l border-foreground/10 p-8 sm:p-12">
              <div className="text-[10px] font-mono uppercase tracking-widest text-foreground/50 mb-6">Highlights</div>
              <ul className="space-y-4">
                {(currentRole.highlights || []).slice(0, 6).map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 text-[10px] font-mono text-foreground/40 pt-1">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-foreground/80 text-sm leading-relaxed">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </section>
      )}

      {/* Timeline */}
      <section className="editorial-section editorial-container rule-top">
        <SectionMarker n="02" label="Timeline" />
        <h2 className="display-h2 text-3xl sm:text-4xl mb-12">
          Roles, <span className="font-serif-italic text-foreground/60">reverse-chronological.</span>
        </h2>
        <div className="relative">
          <div className="absolute left-6 sm:left-8 top-2 bottom-2 w-px bg-foreground/15" />
          <div className="space-y-6">
            {experiences?.map((exp: any, i: number) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="relative pl-16 sm:pl-20"
              >
                <div className="absolute left-3 sm:left-5 top-6 w-7 h-7 rounded-full bg-background border border-foreground/20 flex items-center justify-center z-10">
                  <Briefcase size={12} />
                </div>
                <div className="border border-foreground/10 rounded-2xl bg-background p-6 sm:p-8 hover:border-foreground/30 transition">
                  <div className="flex flex-wrap items-center gap-3 mb-3 text-[11px] font-mono uppercase tracking-widest text-foreground/50">
                    <span>
                      {new Date(exp.start_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })} →{" "}
                      {exp.is_current ? "Present" : exp.end_date ? new Date(exp.end_date).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—"}
                    </span>
                    {exp.is_current && (
                      <span className="px-2 py-0.5 rounded-full bg-foreground text-background text-[10px]">Current</span>
                    )}
                    <span className="ml-auto">Role · {String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl mb-1">{exp.role}</h3>
                  <p className="text-foreground/60 mb-4 text-sm sm:text-base">
                    <span className="font-medium text-foreground/80">{exp.company}</span>
                    {exp.location ? ` · ${exp.location}` : ""}
                  </p>
                  {exp.description && (
                    <p className="text-sm text-foreground/70 leading-relaxed mb-4">{exp.description}</p>
                  )}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 pt-4 border-t border-foreground/10">
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

      {/* Skills */}
      <section className="editorial-section editorial-container rule-top">
        <SectionMarker n="03" label="Capabilities" />
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <h2 className="display-h2 text-3xl sm:text-4xl">
            Tools I use <span className="font-serif-italic text-foreground/60">daily.</span>
          </h2>
          <div className="flex flex-wrap gap-2">
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
                {c === "all" ? "All" : c}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleSkills.map((skill: any, i: number) => (
            <motion.div
              key={skill.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (i % 12) * 0.03 }}
              className="border border-foreground/10 rounded-2xl p-5 bg-background hover:border-foreground/30 transition"
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

      {/* CTA */}
      <section className="editorial-section rule-top">
        <div className="editorial-container">
          <div className="rounded-3xl bg-foreground text-background p-10 sm:p-16">
            <SectionMarker n="→" label="Next step" />
            <h2 className="display-h2 text-3xl sm:text-5xl mb-6 text-background">
              Need a builder <span className="font-serif-italic text-background/70">who's done it before?</span>
            </h2>
            <p className="text-background/70 max-w-xl mb-8">
              Send the brief. I'll come back with a concrete plan, a fixed price, and a timeline you can trust.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/contact" className="inline-flex items-center gap-2 bg-background text-foreground px-6 py-3 rounded-full font-medium hover:opacity-90 transition">
                Start a project <ArrowRight size={16} />
              </Link>
              <Link to="/portfolio" className="inline-flex items-center gap-2 border border-background/30 text-background px-6 py-3 rounded-full font-medium hover:bg-background/10 transition">
                See portfolio <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
