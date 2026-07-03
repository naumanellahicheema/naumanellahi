import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { useServices, useProjects, useTestimonials } from "@/hooks/usePortfolioData";
import {
  Code, Layout as LayoutIcon, Zap, Globe, Palette, Building, Search, Star,
  ArrowRight, ArrowUpRight, Shield, Database, Settings, CheckCircle, Sparkles, X,
} from "lucide-react";

const iconMap: Record<string, any> = { Code, Layout: LayoutIcon, Zap, Globe, Palette, Building, Search, Star, Shield, Database, Settings, Sparkles };

function SectionMarker({ n, label }: { n: string; label: string }) {
  return (
    <div className="section-marker mb-6">
      <span>{n} — {label}</span>
    </div>
  );
}

export default function Services() {
  const { data: services } = useServices();
  const { data: projects } = useProjects();
  const { data: testimonials } = useTestimonials({ limit: 1 });

  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string>("all");

  const list = services || [];
  const shippedCount = projects?.length || 0;

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(list.map((s: any) => s.category).filter(Boolean)))],
    [list]
  );

  const filtered = useMemo(() => {
    let out = list;
    if (activeCat !== "all") out = out.filter((s: any) => s.category === activeCat);
    if (query.trim()) {
      const q = query.toLowerCase();
      out = out.filter((s: any) =>
        [s.title, s.short_description, s.description, s.category, ...((s.highlights as string[]) || [])]
          .filter(Boolean)
          .some((v: string) => String(v).toLowerCase().includes(q))
      );
    }
    return out;
  }, [list, activeCat, query]);

  const primary = filtered[0] || list[0];
  const rest = (filtered[0] ? filtered.slice(1) : list.slice(1));

  const industries = useMemo(
    () => Array.from(new Set((projects || []).map((p: any) => p.industry).filter(Boolean))),
    [projects]
  );

  return (
    <Layout>
      {/* ── Hero ──────────────────────────────────── */}
      <section className="editorial-container pt-28 sm:pt-32 pb-14">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-foreground/60 mb-14">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Services · {list.length} tracks live</span>
          </div>
          <span className="hidden sm:block">— Booking Q3 → Q4</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            <span className="pill-status mb-8"><span className="dot" /> What I do · How I charge</span>
            <h1 className="display-hero text-[clamp(2.75rem,8vw,7rem)] text-foreground">
              <span className="block">Web apps,</span>
              <span className="block">
                <span className="accent-underline">built</span>{" "}
                <span className="font-serif-italic text-foreground/40">to earn.</span>
              </span>
              <span className="block">Not to sit.</span>
            </h1>
            <p className="mt-8 max-w-xl text-base sm:text-lg text-foreground/70 leading-relaxed">
              Secure, scalable products for founders and small teams — with admin panels, role-based access, and the boring plumbing that keeps you shipping past launch day.
            </p>
          </div>

          <div className="lg:col-span-4">
            <div className="grid grid-cols-3 gap-2 border border-foreground/10 rounded-2xl p-4 bg-background">
              {[
                { v: String(list.length).padStart(2, "0"), l: "Services" },
                { v: String(shippedCount).padStart(2, "0"), l: "Shipped" },
                { v: String(industries.length).padStart(2, "0"), l: "Industries" },
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

      {/* ── Filter + Search ──────────────────────── */}
      <section className="editorial-container pb-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between border border-foreground/10 rounded-2xl p-4 bg-background">
          <div className="relative flex-1 lg:max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search services, capabilities, tech…"
              className="w-full pl-11 pr-10 py-2.5 rounded-xl bg-foreground/[0.03] border border-transparent focus:border-foreground/20 focus:bg-background outline-none text-sm transition"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-foreground/10 transition"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
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
                {c === "all" ? `All (${list.length})` : c}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 text-[11px] font-mono uppercase tracking-widest text-foreground/50">
          {filtered.length} result{filtered.length === 1 ? "" : "s"}
          {query && ` for "${query}"`}
          {activeCat !== "all" && ` in ${activeCat}`}
        </div>
      </section>

      {filtered.length === 0 && (
        <section className="editorial-container pb-12">
          <div className="border border-dashed border-foreground/15 rounded-2xl p-16 text-center text-foreground/50">
            <Sparkles size={22} className="mx-auto mb-3" />
            No services match. Try a different keyword or clear the filter.
          </div>
        </section>
      )}

      {/* ── Primary service spotlight ─────────────── */}
      {primary && (
        <section className="editorial-section editorial-container rule-top">
          <SectionMarker n="01" label="Core service" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 border border-foreground/15 rounded-3xl overflow-hidden bg-background"
          >
            <div className="lg:col-span-7 p-8 sm:p-12">
              <div className="text-[10px] font-mono uppercase tracking-widest text-foreground/50 mb-4">
                Track 01 · Flagship{primary.category ? ` · ${primary.category}` : ""}
              </div>
              <h2 className="display-h2 text-3xl sm:text-4xl md:text-5xl mb-5 leading-tight">
                {primary.title}
              </h2>
              <p className="text-base sm:text-lg text-foreground/70 leading-relaxed mb-8">
                {primary.description || primary.short_description}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/contact" className="btn-hero">Start a brief <ArrowRight size={16} /></Link>
                <Link to="/portfolio" className="btn-outline-hero">See work <ArrowUpRight size={16} /></Link>
              </div>
            </div>
            <div className="lg:col-span-5 bg-foreground/[0.03] border-l border-foreground/10 p-8 sm:p-12">
              <div className="text-[10px] font-mono uppercase tracking-widest text-foreground/50 mb-6">What's included</div>
              <ul className="space-y-4">
                {(primary.highlights || []).map((h: string, i: number) => (
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

      {/* ── Capabilities band ─────────────────────── */}
      <section className="editorial-section editorial-container rule-top">
        <SectionMarker n="02" label="Built-in capabilities" />
        <h2 className="display-h2 text-3xl sm:text-4xl mb-12">
          Boring tech. <span className="font-serif-italic text-foreground/60">Sharp edges.</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: Shield, t: "Role-based access", d: "Admins, editors, viewers — enforced end-to-end." },
            { icon: Database, t: "Secure data layer", d: "RLS, validation, typed queries. No leaks." },
            { icon: Settings, t: "Admin dashboards", d: "CRUD, media, SEO — everything editable." },
            { icon: Zap, t: "Performance first", d: "Lighthouse 95+, edge-cached, lazy everything." },
            { icon: Globe, t: "Responsive by default", d: "Mobile-first UX, tuned per breakpoint." },
            { icon: Code, t: "Clean, handoff-ready", d: "Documented, tested, easy to extend." },
          ].map((cap, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="border border-foreground/10 rounded-2xl p-6 bg-background hover:border-foreground/30 transition"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center">
                  <cap.icon size={18} />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/40">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="font-display text-lg mb-2">{cap.t}</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">{cap.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Additional service tracks ─────────────── */}
      {rest.length > 0 && (
        <section className="editorial-section editorial-container rule-top">
          <SectionMarker n="03" label="Additional tracks" />
          <h2 className="display-h2 text-3xl sm:text-4xl mb-12">
            Pick a track, <span className="font-serif-italic text-foreground/60">or blend.</span>
          </h2>
          <div className="divide-y divide-foreground/10 border-y border-foreground/10">
            {rest.map((s: any, i: number) => {
              const Icon = iconMap[s.icon] || Sparkles;
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group grid grid-cols-12 gap-6 py-8 items-start"
                >
                  <div className="col-span-2 sm:col-span-1 text-[10px] font-mono uppercase tracking-widest text-foreground/50 pt-2">
                    {String(i + 2).padStart(2, "0")}
                  </div>
                  <div className="col-span-10 sm:col-span-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-lg bg-foreground/5 flex items-center justify-center"><Icon size={16} /></div>
                      <h3 className="font-display text-xl sm:text-2xl">{s.title}</h3>
                    </div>
                    <p className="text-sm text-foreground/60 leading-relaxed">{s.short_description || s.description}</p>
                  </div>
                  <div className="col-span-12 sm:col-span-5">
                    {s.highlights && s.highlights.length > 0 && (
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                        {s.highlights.slice(0, 6).map((h: string, j: number) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-foreground/70">
                            <CheckCircle size={14} className="mt-1 flex-shrink-0 text-foreground/70" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="col-span-12 sm:col-span-2 sm:text-right">
                    <Link to="/contact" className="inline-flex items-center gap-1 text-sm font-medium border-b border-foreground/30 pb-0.5 hover:border-foreground transition">
                      Inquire <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Process ───────────────────────────────── */}
      <section className="editorial-section editorial-container rule-top">
        <SectionMarker n="04" label="How we work" />
        <h2 className="display-h2 text-3xl sm:text-4xl mb-12">
          From kickoff <span className="font-serif-italic text-foreground/60">to launch.</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { n: "01", t: "Brief", d: "30-min call. We scope the goal, users, and constraints." },
            { n: "02", t: "Blueprint", d: "Fixed scope, fixed price, weekly milestones." },
            { n: "03", t: "Build", d: "Live preview from day one. Feedback in-thread." },
            { n: "04", t: "Ship", d: "Launch, monitor, iterate. Handoff docs included." },
          ].map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="border border-foreground/10 rounded-2xl p-6 bg-background"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="display-h2 text-4xl text-foreground/15">{p.n}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <h3 className="font-display text-xl mb-2">{p.t}</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">{p.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Testimonial slice ─────────────────────── */}
      {testimonials && testimonials[0] && (
        <section className="editorial-section editorial-container rule-top">
          <SectionMarker n="05" label="What clients say" />
          <div className="max-w-4xl">
            <p className="text-2xl sm:text-3xl md:text-4xl font-serif-italic text-foreground leading-[1.3]">
              "{testimonials[0].message}"
            </p>
            <div className="mt-8 flex items-center gap-4">
              {testimonials[0].avatar_url && (
                <img src={testimonials[0].avatar_url} alt={testimonials[0].client_name} className="w-12 h-12 rounded-full object-cover" />
              )}
              <div>
                <div className="font-medium">{testimonials[0].client_name}</div>
                <div className="text-sm text-foreground/60">
                  {testimonials[0].role}{testimonials[0].company ? ` · ${testimonials[0].company}` : ""}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────── */}
      <section className="editorial-section rule-top">
        <div className="editorial-container">
          <div className="rounded-3xl bg-foreground text-background p-10 sm:p-16">
            <SectionMarker n="→" label="Next step" />
            <h2 className="display-h2 text-3xl sm:text-5xl mb-6 text-background">
              Got a brief? <span className="font-serif-italic text-background/70">Let's build it.</span>
            </h2>
            <p className="text-background/70 max-w-xl mb-8">
              Send the goal, the deadline, the constraints. I'll reply within 24 hours with a concrete next step.
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
