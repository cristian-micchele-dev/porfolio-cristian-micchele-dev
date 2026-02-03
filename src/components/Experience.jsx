import { motion } from "framer-motion";
import { experienceData } from "../data/experienceData";
import { ExternalLink } from "lucide-react";

function Experience() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
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
          className="text-3xl font-bold text-slate-100 mb-2"
          variants={itemVariants}
        >
          Experiencia Laboral
        </motion.h2>
        <motion.div
          className="w-20 h-1 bg-blue-500 mx-auto rounded-full"
          variants={itemVariants}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 flex flex-col gap-12">
        {experienceData.map((exp) => (
          <motion.div
            key={exp.id}
            className="bg-slate-800/50 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-colors duration-300 relative overflow-hidden group"
            variants={itemVariants}
          >
            {/* Gradient Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 flex flex-col md:flex-row">
              {/* Image Section */}
              {exp.image && (
                <div className="md:w-2/5 overflow-hidden relative">
                  <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-transparent transition-colors duration-300 z-10 pointer-events-none" />
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
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                      <span className="flex items-center gap-2 text-white font-medium px-4 py-2 bg-blue-600 rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        Visitar Sitio <ExternalLink size={16} />
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
                      <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                        {exp.link ? (
                          <a
                            href={exp.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline decoration-blue-500/50 underline-offset-4"
                          >
                            {exp.title}
                          </a>
                        ) : (
                          exp.title
                        )}
                      </h3>
                      <p className="text-blue-400 font-medium text-lg">
                        {exp.company}
                      </p>
                    </div>
                    <div className="self-start bg-slate-700/50 px-3 py-1 rounded-full text-slate-300 text-sm font-medium whitespace-nowrap border border-slate-600">
                      {exp.date}
                    </div>
                  </div>

                  <p className="text-slate-300 mb-6 italic border-l-4 border-blue-500 pl-4 py-1 bg-slate-800/30 rounded-r">
                    {exp.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                    {exp.details.map((detail, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-blue-400 font-semibold min-w-[80px]">
                          {detail.label}:
                        </span>
                        <span className="text-slate-400">{detail.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {exp.link && (
                  <div className="mt-6 pt-4 border-t border-slate-700/50 flex justify-end md:hidden">
                    <a
                      href={exp.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
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
