import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { useExperiences, useSkills } from "@/hooks/usePortfolioData";
import { Briefcase, CheckCircle } from "lucide-react";

export default function Experience() {
  const { data: experiences } = useExperiences();
  const { data: skills } = useSkills();

  const skillsByCategory = skills?.reduce((acc: any, skill: any) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {}) || {};

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Layout>
      <section className="pt-28 sm:pt-32 pb-16 sm:pb-20 px-5 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <span className="inline-block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">
              Background
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
              Experience
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              My professional journey and technical expertise in building secure web applications.
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative mb-20 sm:mb-24">
            <div className="absolute left-5 sm:left-6 top-0 bottom-0 w-px bg-border" />
            <motion.div 
              className="space-y-8 sm:space-y-10"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {experiences?.map((exp: any) => (
                <motion.div 
                  key={exp.id} 
                  variants={itemVariants}
                  className="relative pl-14 sm:pl-16"
                >
                  <div className="absolute left-2 sm:left-2.5 top-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-foreground flex items-center justify-center z-10 shadow-lg">
                    <Briefcase size={14} className="text-background sm:w-4 sm:h-4" />
                  </div>
                  <div className="glass-card p-5 sm:p-6 md:p-8 hover-lift">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        {new Date(exp.start_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })} - {exp.is_current ? "Present" : exp.end_date ? new Date(exp.end_date).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : ""}
                      </span>
                      {exp.is_current && (
                        <span className="px-2.5 py-1 bg-foreground text-background rounded-full text-[10px] sm:text-xs font-semibold">
                          Current
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-display font-semibold mb-1">{exp.role}</h3>
                    <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-4">
                      {exp.company} • {exp.location}
                    </p>
                    {exp.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {exp.description}
                      </p>
                    )}
                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="space-y-2">
                        {exp.highlights.map((h: string, j: number) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle size={14} className="flex-shrink-0 mt-0.5 text-foreground/70" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Skills */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-10 sm:mb-12">
              <span className="inline-block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">
                Capabilities
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold">
                Skills & Technologies
              </h2>
            </div>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {Object.entries(skillsByCategory).map(([category, categorySkills]: [string, any]) => (
                <motion.div 
                  key={category} 
                  variants={itemVariants}
                  className="glass-card p-5 sm:p-6 hover-lift"
                >
                  <h3 className="text-base sm:text-lg font-display font-semibold mb-5 sm:mb-6">{category}</h3>
                  <div className="space-y-4 sm:space-y-5">
                    {categorySkills.map((skill: any) => (
                      <div key={skill.id}>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium">{skill.name}</span>
                          <span className="text-muted-foreground">{skill.level}%</span>
                        </div>
                        <div className="skill-bar">
                          <motion.div 
                            className="skill-bar-fill" 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
