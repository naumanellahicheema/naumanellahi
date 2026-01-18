import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { useExperiences, useSkills } from "@/hooks/usePortfolioData";
import { Briefcase } from "lucide-react";

export default function Experience() {
  const { data: experiences } = useExperiences();
  const { data: skills } = useSkills();

  const skillsByCategory = skills?.reduce((acc: any, skill: any) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {}) || {};

  return (
    <Layout>
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="section-title">Experience</h1>
            <p className="section-subtitle mx-auto">My professional journey and technical expertise.</p>
          </motion.div>

          {/* Timeline */}
          <div className="relative mb-24">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-12">
              {experiences?.map((exp: any, i: number) => (
                <motion.div key={exp.id} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative pl-16">
                  <div className="absolute left-2 top-2 w-8 h-8 rounded-full bg-foreground flex items-center justify-center z-10"><Briefcase size={16} className="text-background" /></div>
                  <div className="glass-card p-8">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="text-sm text-muted-foreground">{new Date(exp.start_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })} - {exp.is_current ? "Present" : exp.end_date ? new Date(exp.end_date).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : ""}</span>
                      {exp.is_current && <span className="px-3 py-1 bg-foreground text-background rounded-full text-xs font-medium">Current</span>}
                    </div>
                    <h3 className="text-2xl font-display font-semibold mb-1">{exp.role}</h3>
                    <p className="text-lg text-muted-foreground mb-4">{exp.company} • {exp.location}</p>
                    {exp.description && <p className="text-muted-foreground">{exp.description}</p>}
                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="mt-4 space-y-2">
                        {exp.highlights.map((h: string, j: number) => <li key={j} className="text-sm text-muted-foreground">• {h}</li>)}
                      </ul>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-display font-bold text-center mb-12">Skills & Technologies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(skillsByCategory).map(([category, categorySkills]: [string, any]) => (
                <div key={category} className="glass-card p-6">
                  <h3 className="text-lg font-display font-semibold mb-6">{category}</h3>
                  <div className="space-y-5">
                    {categorySkills.map((skill: any) => (
                      <div key={skill.id}>
                        <div className="flex justify-between text-sm mb-2"><span className="font-medium">{skill.name}</span><span className="text-muted-foreground">{skill.level}%</span></div>
                        <div className="skill-bar"><div className="skill-bar-fill" style={{ width: `${skill.level}%` }} /></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}