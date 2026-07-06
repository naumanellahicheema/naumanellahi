import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight, ExternalLink, Search, Share2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useProjects } from "@/hooks/usePortfolioData";
import { useToast } from "@/hooks/use-toast";

function SectionMarker({ n, label }: { n: string; label: string }) {
  return (
    <div className="section-marker mb-6">
      <span>{n} — {label}</span>
    </div>
  );
}

export default function Portfolio() {
  const { data: projects } = useProjects();
  const { toast } = useToast();
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState("");

  const industries = useMemo(
    () => ["all", ...Array.from(new Set((projects || []).map((p: any) => p.industry).filter(Boolean)))],
    [projects]
  );

  const filtered = useMemo(() => {
    let list = projects || [];
    if (filter !== "all") list = list.filter((p: any) => p.industry === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p: any) =>
        [p.title, p.short_description, p.description, p.industry, p.country, ...(p.tech_stack || [])]
          .filter(Boolean)
          .some((v: string) => String(v).toLowerCase().includes(q))
      );
    }
    return list;
  }, [projects, filter, query]);

  const featured = (projects || []).find((p: any) => p.featured) || (projects || [])[0];
  const total = projects?.length || 0;
  const industryCount = industries.length - 1;

  return (
    <Layout>
      {/* ── Hero ───────────────────────────────────── */}
      <section className="editorial-container pt-28 sm:pt-32 pb-14">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-foreground/60 mb-14">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Selected Work · {total} shipped</span>
          </div>
          <span className="hidden sm:block">— Updated continuously</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            <span className="pill-status mb-8"><span className="dot" /> Portfolio · 2020 → today</span>
            <h1 className="display-hero text-[clamp(2.75rem,8vw,7rem)] text-foreground">
              <span className="block">Real projects,</span>
              <span className="block">
                <span className="accent-underline">shipped</span>{" "}
                <span className="font-serif-italic text-foreground/40">for real</span>
              </span>
              <span className="block">teams.</span>
            </h1>
            <p className="mt-8 max-w-xl text-base sm:text-lg text-foreground/70 leading-relaxed">
              A living archive of custom web apps, admin panels and marketing sites — built for founders and teams in the US, UK, EU and Australia.
            </p>
          </div>

          <div className="lg:col-span-4">
            <div className="grid grid-cols-3 gap-2 border border-foreground/10 rounded-2xl p-4 bg-background">
              {[
                { v: String(total).padStart(2, "0"), l: "Shipped" },
                { v: String(industryCount).padStart(2, "0"), l: "Industries" },
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
      </section>

      {/* ── Featured spotlight ─────────────────────── */}
      {featured && (
        <section className="editorial-section editorial-container rule-top">
          <SectionMarker n="01" label="Featured case" />
          <Link
            to={`/portfolio/${featured.slug}`}
            className="group grid grid-cols-1 lg:grid-cols-12 gap-8 border border-foreground/10 rounded-3xl overflow-hidden bg-background hover:border-foreground/40 transition"
          >
            <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto overflow-hidden bg-foreground/5">
              {featured.thumbnail_url ? (
                <img src={featured.thumbnail_url} alt={featured.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-700" loading="lazy" />
              ) : (
                <div className="w-full h-full grid place-items-center text-foreground/15 text-9xl font-display font-bold">
                  {featured.title?.[0]}
                </div>
              )}
            </div>
            <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-center">
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-foreground/40 mb-6">
                <span>Featured</span>
                <span>·</span>
                <span>{featured.industry}</span>
                {featured.country && <><span>·</span><span>{featured.country}</span></>}
              </div>
              <h2 className="display-h2 text-3xl sm:text-4xl lg:text-5xl mb-5">
                {featured.title}
              </h2>
              <p className="text-foreground/60 leading-relaxed mb-6">
                {featured.short_description || featured.description}
              </p>
              {featured.tech_stack?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-8">
                  {featured.tech_stack.slice(0, 6).map((t: string) => (
                    <span key={t} className="text-[10px] font-mono uppercase tracking-widest text-foreground/50 border border-foreground/10 rounded px-2 py-1">
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <span className="inline-flex items-center gap-2 text-sm font-medium border-b border-foreground pb-1 w-fit">
                Open case study <ArrowUpRight size={14} />
              </span>
            </div>
          </Link>
        </section>
      )}

      {/* ── Filter + search bar ────────────────────── */}
      <section className="editorial-section editorial-container rule-top">
        <div className="flex items-start justify-between gap-4">
          <SectionMarker n="02" label="Archive" />
          <button
            onClick={() => {
              const urls = (projects || [])
                .map((p: any) => p.website_url)
                .filter((url: string) => typeof url === "string" && url.trim().length > 0);
              if (urls.length === 0) {
                toast({ title: "No URLs to share", description: "No projects have website links yet." });
                return;
              }
              navigator.clipboard.writeText(urls.join("\n")).then(() => {
                toast({
                  title: "Copied project URLs",
                  description: `${urls.length} URL${urls.length === 1 ? "" : "s"} copied to the clipboard.`,
                });
              });
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-foreground/15 text-foreground/70 hover:border-foreground/40 hover:text-foreground hover:bg-foreground/5 transition text-xs font-mono uppercase tracking-widest"
            aria-label="Copy all project website URLs"
          >
            <Share2 size={14} />
            <span className="hidden sm:inline">Share URLs</span>
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-10">
          <h2 className="display-h2 text-4xl sm:text-6xl lg:text-7xl lg:col-span-8">
            Browse the <span className="font-serif-italic text-foreground/60">archive.</span>
          </h2>
          <p className="lg:col-span-4 text-foreground/60 text-base leading-relaxed">
            Filter by industry or search across titles, stacks and countries.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8 border-y border-foreground/10 py-4">
          <div className="flex flex-wrap gap-2">
            {industries.map((industry: any) => (
              <button
                key={industry}
                onClick={() => setFilter(industry)}
                className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-widest transition ${
                  filter === industry
                    ? "bg-foreground text-background"
                    : "border border-foreground/15 text-foreground/60 hover:border-foreground/40 hover:text-foreground"
                }`}
              >
                {industry === "all" ? "All · " + total : industry}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:w-72">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects…"
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-full border border-foreground/15 bg-background focus:outline-none focus:border-foreground/50 transition"
            />
          </div>
        </div>

        {/* Project grid */}
        {filtered.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p: any, i: number) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 6) * 0.04 }}
              >
                <Link
                  to={`/portfolio/${p.slug}`}
                  className="group block border border-foreground/10 rounded-2xl overflow-hidden bg-background hover:border-foreground/40 transition h-full"
                >
                  <div className="px-6 pt-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-foreground/40">
                    <span>Case {String(i + 1).padStart(2, "0")}</span>
                    <span>{p.industry || "—"}</span>
                  </div>
                  <div className="aspect-[4/3] overflow-hidden bg-foreground/5 mt-4">
                    {p.thumbnail_url ? (
                      <img src={p.thumbnail_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" loading="lazy" />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-foreground/15 text-6xl font-display font-bold">
                        {p.title?.[0]}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    {p.tech_stack?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {p.tech_stack.slice(0, 4).map((t: string) => (
                          <span key={t} className="text-[10px] font-mono uppercase tracking-widest text-foreground/50 border border-foreground/10 rounded px-2 py-1">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    <h3 className="text-xl font-semibold mb-3">{p.title}</h3>
                    <p className="text-sm text-foreground/60 line-clamp-2 mb-5">{p.short_description || p.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 text-sm font-medium border-b border-foreground pb-0.5">
                        View case <ArrowRight size={14} />
                      </span>
                      {p.website_url && (
                        <a
                          href={p.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs font-mono uppercase tracking-widest text-foreground/50 hover:text-foreground inline-flex items-center gap-1"
                        >
                          <ExternalLink size={12} /> Live
                        </a>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-foreground/20 rounded-2xl py-20 text-center">
            <p className="text-foreground/50 text-sm font-mono uppercase tracking-widest">
              No projects match this filter.
            </p>
          </div>
        )}
      </section>

      {/* ── CTA ────────────────────────────────────── */}
      <section className="editorial-section editorial-container rule-top">
        <SectionMarker n="03" label="Engage" />
        <div className="border border-foreground/10 rounded-3xl p-10 sm:p-16 bg-foreground text-background">
          <h2 className="display-h2 text-4xl sm:text-6xl lg:text-7xl max-w-4xl">
            Your project, <span className="font-serif-italic text-background/70">shipped next.</span>
          </h2>
          <p className="mt-6 text-background/70 max-w-xl">
            Tell me the brief — I'll come back within 12–24 hours with a written proposal, fixed USD price and realistic delivery dates.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3.5 bg-background text-foreground rounded-full font-medium hover:opacity-90 transition">
              Start a project <ArrowUpRight size={16} />
            </Link>
            <Link to="/services" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-background/30 hover:border-background/60 transition font-medium">
              See services <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
