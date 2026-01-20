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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Layout>
      <section className="pt-28 sm:pt-32 pb-16 sm:pb-20 px-5 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <span className="inline-block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">
              My Work
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
              Portfolio
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Real results for clients worldwide—secure, scalable apps delivered on time.
            </p>
          </motion.div>

          {/* Filter */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2, duration: 0.5 }} 
            className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-12"
          >
            {industries.map((industry: any) => (
              <button 
                key={industry} 
                onClick={() => setFilter(industry)} 
                className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all tap-target ${
                  filter === industry 
                    ? "bg-foreground text-background shadow-lg" 
                    : "bg-secondary text-foreground hover:bg-accent border border-border/50"
                }`}
              >
                {industry === "all" ? "All Projects" : industry}
              </button>
            ))}
          </motion.div>

          {/* Projects Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredProjects?.map((project: any) => (
              <motion.div 
                key={project.id} 
                variants={itemVariants}
                layout
                className="project-card group"
              >
                <div className="aspect-video bg-secondary overflow-hidden relative">
                  {project.thumbnail_url ? (
                    <img 
                      src={project.thumbnail_url} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                      <Globe size={48} className="text-muted-foreground/50" />
                    </div>
                  )}
                  {project.featured && (
                    <span className="absolute top-3 left-3 px-3 py-1.5 bg-foreground text-background text-xs font-semibold rounded-full shadow-lg">
                      Featured
                    </span>
                  )}
                </div>
                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span>{project.industry}</span>
                    <span>•</span>
                    <span>{project.country}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-display font-semibold mb-2 group-hover:text-foreground transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                    {project.short_description || project.description}
                  </p>
                  {project.tech_stack && (
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                      {project.tech_stack.slice(0, 3).map((tech: string) => (
                        <span key={tech} className="px-2.5 py-1 bg-secondary text-xs rounded-full border border-border/50">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <Link 
                      to={`/portfolio/${project.slug}`} 
                      className="text-sm font-medium text-foreground hover:underline inline-flex items-center gap-1 tap-target"
                    >
                      View Details <ArrowRight size={14} />
                    </Link>
                    {project.website_url && (
                      <a 
                        href={project.website_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 tap-target"
                      >
                        <ExternalLink size={14} /> Live
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {filteredProjects?.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-muted-foreground">No projects found in this category.</p>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
}
