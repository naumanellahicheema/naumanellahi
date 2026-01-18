import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { useTestimonials } from "@/hooks/usePortfolioData";
import { Star, Quote } from "lucide-react";

export default function Testimonials() {
  const { data: testimonials } = useTestimonials();

  return (
    <Layout>
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="section-title">Testimonials</h1>
            <p className="section-subtitle mx-auto">What my clients say about working with me.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials?.map((testimonial: any, i: number) => (
              <motion.div key={testimonial.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card p-8 relative">
                <Quote size={32} className="absolute top-6 right-6 text-muted-foreground/20" />
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: testimonial.rating || 5 }).map((_, j) => <Star key={j} size={18} fill="currentColor" className="text-foreground" />)}
                </div>
                <p className="text-muted-foreground mb-8 italic leading-relaxed">"{testimonial.message}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                    {testimonial.avatar_url ? <img src={testimonial.avatar_url} alt={testimonial.client_name} className="w-full h-full object-cover" /> : <span className="font-semibold">{testimonial.client_name.charAt(0)}</span>}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.client_name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}{testimonial.company && `, ${testimonial.company}`}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {(!testimonials || testimonials.length === 0) && (
            <div className="text-center py-16 text-muted-foreground">No testimonials yet.</div>
          )}
        </div>
      </section>
    </Layout>
  );
}