import { motion } from "framer-motion";
import { experienceData } from "../data/experienceData";
import { ExternalLink } from "lucide-react";

function Experience() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.section
      id="experience"
      className="py-16"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="text-center mb-12">
        <motion.h2
          className="text-3xl font-bold text-ink mb-4"
          variants={itemVariants}
        >
          Experiencia Laboral
        </motion.h2>
        <motion.div
          className="w-16 h-px bg-brand mx-auto"
          variants={itemVariants}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 flex flex-col gap-12">
        {experienceData.map((exp) => (
          <motion.div
            key={exp.id}
            className="bg-surface rounded-xl border border-white/[0.06] hover:border-brand/25 transition-colors duration-300 relative overflow-hidden group"
            variants={itemVariants}
          >
            {/* Hover glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 flex flex-col md:flex-row">
              {/* Image Section */}
              {exp.image && (
                <div className="md:w-2/5 overflow-hidden relative">
                  <div className="absolute inset-0 bg-brand/10 group-hover:bg-transparent transition-colors duration-300 z-10 pointer-events-none" />
                  <a
                    href={exp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full w-full cursor-pointer"
                  >
                    <img
                      src={exp.image}
                      alt={`${exp.company} website preview`}
                      className="w-full h-full object-cover min-h-[200px] md:min-h-full transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-canvas/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                      <span className="flex items-center gap-2 text-canvas font-medium px-4 py-2 bg-brand rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 text-sm">
                        Visitar Sitio <ExternalLink size={14} />
                      </span>
                    </div>
                  </a>
                </div>
              )}

              {/* Content Section */}
              <div
                className={`p-6 md:p-8 flex flex-col justify-between ${exp.image ? "md:w-3/5" : "w-full"}`}
              >
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-ink mb-1 group-hover:text-brand transition-colors">
                        {exp.link ? (
                          <a
                            href={exp.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline decoration-brand/50 underline-offset-4"
                          >
                            {exp.title}
                          </a>
                        ) : (
                          exp.title
                        )}
                      </h3>
                      <p className="text-brand font-medium">
                        {exp.company}
                      </p>
                    </div>
                    <div className="self-start bg-surface-raised px-3 py-1 rounded-full text-ink-muted text-sm font-medium whitespace-nowrap border border-white/[0.06]">
                      {exp.date}
                    </div>
                  </div>

                  <p className="text-ink-muted mb-6 italic border-l-2 border-brand/50 pl-4 py-1 text-sm">
                    {exp.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                    {exp.details.map((detail, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-brand font-medium min-w-[80px]">
                          {detail.label}:
                        </span>
                        <span className="text-ink-dim">{detail.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {exp.link && (
                  <div className="mt-6 pt-4 border-t border-white/[0.06] flex justify-end md:hidden">
                    <a
                      href={exp.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-brand hover:text-brand-soft text-sm font-medium transition-colors"
                    >
                      Visitar Sitio Web <ExternalLink size={14} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

export default Experience;
