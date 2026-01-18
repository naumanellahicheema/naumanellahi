import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { useProject } from "@/hooks/usePortfolioData";
import { ArrowLeft, ExternalLink, Globe, CheckCircle } from "lucide-react";

export default function ProjectDetail() {
  const { slug } = useParams();
  const { data: project, isLoading } = useProject(slug || "");

  if (isLoading) {
    return <Layout><div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-foreground border-t-transparent rounded-full" /></div></Layout>;
  }

  if (!project) {
    return <Layout><div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold mb-4">Project Not Found</h1><Link to="/portfolio" className="btn-outline-hero">Back to Portfolio</Link></div></div></Layout>;
  }

  return (
    <Layout>
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <Link to="/portfolio" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"><ArrowLeft size={18} /> Back to Portfolio</Link>
          
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                <span>{project.industry}</span><span>•</span><span>{project.country}</span>
                {project.featured && <span className="px-3 py-1 bg-foreground text-background rounded-full text-xs">Featured</span>}
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{project.title}</h1>
              {project.website_url && <a href={project.website_url} target="_blank" rel="noopener noreferrer" className="btn-hero inline-flex">Visit Website <ExternalLink size={18} /></a>}
            </div>

            {/* Hero Image */}
            <div className="aspect-video rounded-2xl overflow-hidden bg-secondary mb-12">
              {project.thumbnail_url ? <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Globe size={64} className="text-muted-foreground/50" /></div>}
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-display font-bold mb-4">About the Project</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{project.description}</p>

                {project.images && project.images.length > 0 && (
                  <div className="mt-12">
                    <h3 className="text-xl font-display font-bold mb-6">Project Gallery</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {project.images.map((img: string, i: number) => <img key={i} src={img} alt={`${project.title} screenshot ${i + 1}`} className="rounded-xl w-full" />)}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-8">
                {project.services_provided && project.services_provided.length > 0 && (
                  <div className="glass-card p-6">
                    <h3 className="font-display font-semibold mb-4">Services Provided</h3>
                    <ul className="space-y-2">
                      {project.services_provided.map((service: string) => <li key={service} className="flex items-center gap-2 text-sm"><CheckCircle size={14} /> {service}</li>)}
                    </ul>
                  </div>
                )}

                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div className="glass-card p-6">
                    <h3 className="font-display font-semibold mb-4">Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tech_stack.map((tech: string) => <span key={tech} className="px-3 py-1 bg-secondary rounded-full text-sm">{tech}</span>)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}