import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { useServices } from "@/hooks/usePortfolioData";
import { Code, Layout as LayoutIcon, Zap, Globe, CheckCircle, Palette, Building, Search, Star } from "lucide-react";

const iconMap: Record<string, any> = { Code, Layout: LayoutIcon, Zap, Globe, Palette, Building, Search, Star };

export default function Services() {
  const { data: services } = useServices();

  return (
    <Layout>
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="section-title">Services</h1>
            <p className="section-subtitle mx-auto">Comprehensive web development solutions to help your business succeed online.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services?.map((service: any, i: number) => {
              const IconComponent = iconMap[service.icon] || Globe;
              return (
                <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card p-8 hover:border-foreground/30 transition-all duration-300">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center flex-shrink-0"><IconComponent size={28} /></div>
                    <div className="flex-grow">
                      <h3 className="text-2xl font-display font-semibold mb-3">{service.title}</h3>
                      <p className="text-muted-foreground mb-6">{service.description || service.short_description}</p>
                      {service.highlights && service.highlights.length > 0 && (
                        <ul className="grid grid-cols-2 gap-3">
                          {service.highlights.map((h: string, j: number) => <li key={j} className="flex items-center gap-2 text-sm"><CheckCircle size={14} className="text-foreground flex-shrink-0" /> {h}</li>)}
                        </ul>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}