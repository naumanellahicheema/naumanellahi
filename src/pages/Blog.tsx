import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { usePosts } from "@/hooks/usePortfolioData";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export default function Blog() {
  const { data: posts } = usePosts();

  return (
    <Layout>
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="section-title">Blog</h1>
            <p className="section-subtitle mx-auto">Insights, tutorials, and thoughts on web development.</p>
          </motion.div>

          <div className="space-y-8">
            {posts?.map((post: any, i: number) => (
              <motion.article key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link to={`/blog/${post.slug}`} className="glass-card p-8 flex flex-col md:flex-row gap-6 hover:border-foreground/30 transition-all duration-300 block">
                  {post.cover_image && (
                    <div className="w-full md:w-48 h-48 md:h-32 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                      {post.published_at && <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(post.published_at).toLocaleDateString()}</span>}
                      {post.tags && post.tags.length > 0 && post.tags.slice(0, 2).map((tag: string) => <span key={tag} className="px-2 py-0.5 bg-secondary rounded text-xs">{tag}</span>)}
                    </div>
                    <h2 className="text-2xl font-display font-semibold mb-2 group-hover:text-foreground">{post.title}</h2>
                    {post.excerpt && <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>}
                    <span className="inline-flex items-center gap-1 text-sm font-medium mt-4 hover:underline">Read More <ArrowRight size={14} /></span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {(!posts || posts.length === 0) && (
            <div className="text-center py-16 text-muted-foreground">No blog posts yet. Check back soon!</div>
          )}
        </div>
      </section>
    </Layout>
  );
}