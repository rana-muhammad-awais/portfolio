"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

import { Experience as ExperienceType } from "@prisma/client";

const DEFAULT_EXPERIENCE: any[] = [
  {
    type: "work",
    role: "AI/ML Engineer Intern",
    company: "DevelopersHub Corporation",
    period: "Mar 2026 – May 2026",
    bullets: JSON.stringify([
      "Developed and trained deep learning models for computer vision tasks including image classification and object detection",
      "Built end-to-end ML pipelines from data preprocessing to model deployment using TensorFlow and Python",
      "Collaborated with senior engineers to optimize model inference speed by 40% through quantization and TFLite conversion",
      "Implemented Grad-CAM visualizations for model explainability and stakeholder presentations",
    ]),
  },
  {
    type: "work",
    role: "Machine Learning Intern",
    company: "CodeAlpha",
    period: "Mar 2026 – Jun 2026",
    bullets: JSON.stringify([
      "Designed and implemented predictive models using XGBoost and Scikit-learn for real-world datasets",
      "Created comprehensive data analysis pipelines with Pandas, NumPy, and Matplotlib",
      "Developed RESTful APIs with Flask/FastAPI to serve ML predictions in production environments",
      "Achieved R² scores above 0.89 on regression tasks through systematic hyperparameter tuning",
    ]),
  },
  {
    type: "education",
    role: "BS Computer Science",
    company: "University",
    period: "2022 – 2026 (Expected)",
    bullets: JSON.stringify([
      "CGPA: 3.72/4.00 — 1st Position holder every semester",
      "Focus areas: Artificial Intelligence, Machine Learning, Data Structures & Algorithms",
      "Led multiple final-year projects involving computer vision and full-stack development",
      "Active participant in programming competitions and AI/ML workshops",
    ]),
  },
];

export default function Experience({ experience }: { experience?: ExperienceType[] }) {
  const displayExperience = experience?.length ? experience : DEFAULT_EXPERIENCE;

  return (
    <section id="experience" className="relative py-[80px] lg:py-[100px]">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal>
          <div className="flex items-center gap-4 mb-16">
            <span className="text-sm font-mono text-violet font-medium">
              03
            </span>
            <h2
              className="font-heading font-bold text-content"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
            >
              Experience & Education
            </h2>
            <span className="flex-1 h-[1px] bg-subtle" />
          </div>
        </ScrollReveal>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-violet/40 via-purple/30 to-coral/20" />

          <div className="space-y-12">
            {displayExperience.map((item, i) => (
              <motion.div
                key={`${item.company}-${item.role}-${i}`}
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative pl-16 md:pl-20"
              >
                {/* Timeline dot */}
                <div className="absolute left-[14px] md:left-[22px] top-1 w-[20px] h-[20px] rounded-full bg-base border-2 border-violet/40 flex items-center justify-center">
                  {item.type === "work" ? (
                    <Briefcase size={10} className="text-violet" />
                  ) : (
                    <GraduationCap size={10} className="text-coral" />
                  )}
                </div>

                {/* Card */}
                <div className="glass-card rounded-2xl p-6 hover:border-violet/20 transition-colors duration-300">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-lg font-heading font-bold text-content">
                        {item.role}
                      </h3>
                      <p className="text-sm font-medium gradient-text">
                        {item.company}
                      </p>
                    </div>
                    <span className="text-xs text-content-dim/60 font-mono bg-[var(--tag-bg)] px-3 py-1 rounded-full">
                      {item.period}
                    </span>
                  </div>

                  <ul className="space-y-2.5">
                    {(item.bullets ? JSON.parse(item.bullets) : []).map((bullet: string, j: number) => (
                      <li
                        key={j}
                        className="flex items-start gap-2.5 text-sm text-content-dim leading-relaxed"
                      >
                        <span className="w-1 h-1 rounded-full bg-violet/50 mt-2 shrink-0" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
