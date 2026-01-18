import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { usePost } from "@/hooks/usePortfolioData";
import { ArrowLeft, Calendar, Tag } from "lucide-react";

export default function BlogPost() {
  const { slug } = useParams();
  const { data: post, isLoading } = usePost(slug || "");

  if (isLoading) {
    return <Layout><div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-foreground border-t-transparent rounded-full" /></div></Layout>;
  }

  if (!post) {
    return <Layout><div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold mb-4">Post Not Found</h1><Link to="/blog" className="btn-outline-hero">Back to Blog</Link></div></div></Layout>;
  }

  return (
    <Layout>
      <article className="pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"><ArrowLeft size={18} /> Back to Blog</Link>
          
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
              {post.published_at && <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(post.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>}
            </div>

            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">{post.title}</h1>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag: string) => <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-secondary rounded-full text-sm"><Tag size={12} /> {tag}</span>)}
              </div>
            )}

            {post.cover_image && (
              <div className="aspect-video rounded-2xl overflow-hidden mb-12">
                <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="prose prose-invert prose-lg max-w-none">
              <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{post.content}</div>
            </div>
          </motion.div>
        </div>
      </article>
    </Layout>
  );
}