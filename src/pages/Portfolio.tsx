import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useProjects } from "@/hooks/usePortfolioData";
import { ArrowRight, Globe, ExternalLink } from "lucide-react";
import { useState } from "react";

export default function Portfolio() {
  const { data: projects } = useProjects();
  const [filter, setFilter] = useState<string>("all");

  const industries = ["all", ...new Set(projects?.map((p: any) => p.industry).filter(Boolean))];
  const filteredProjects = filter === "all" ? projects : projects?.filter((p: any) => p.industry === filter);

  return (
    <Layout>
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="section-title">Portfolio</h1>
            <p className="section-subtitle mx-auto">Explore my collection of projects built for clients worldwide.</p>
          </motion.div>

          {/* Filter */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-wrap justify-center gap-3 mb-12">
            {industries.map((industry: any) => (
              <button key={industry} onClick={() => setFilter(industry)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === industry ? "bg-foreground text-background" : "bg-secondary text-foreground hover:bg-accent"}`}>
                {industry === "all" ? "All Projects" : industry}
              </button>
            ))}
          </motion.div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects?.map((project: any, i: number) => (
              <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="project-card group">
                <div className="aspect-video bg-secondary overflow-hidden relative">
                  {project.thumbnail_url ? <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /> : <div className="w-full h-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center"><Globe size={48} className="text-muted-foreground/50" /></div>}
                  {project.featured && <span className="absolute top-3 left-3 px-3 py-1 bg-foreground text-background text-xs font-medium rounded-full">Featured</span>}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2"><span>{project.industry}</span><span>•</span><span>{project.country}</span></div>
                  <h3 className="text-xl font-display font-semibold mb-2">{project.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.short_description || project.description}</p>
                  {project.tech_stack && <div className="flex flex-wrap gap-2 mb-4">{project.tech_stack.slice(0, 3).map((tech: string) => <span key={tech} className="px-2 py-1 bg-secondary text-xs rounded">{tech}</span>)}</div>}
                  <div className="flex items-center gap-4">
                    <Link to={`/portfolio/${project.slug}`} className="text-sm font-medium text-foreground hover:underline inline-flex items-center gap-1">View Details <ArrowRight size={14} /></Link>
                    {project.website_url && <a href={project.website_url} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"><ExternalLink size={14} /> Live Site</a>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}