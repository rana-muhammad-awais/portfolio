"use client";

import { motion } from "framer-motion";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import { GithubIcon } from "./icons";
import ScrollReveal from "./ScrollReveal";

const PROJECTS = [
  {
    title: "CarpSense",
    subtitle: "AI-Powered Fish Species Classifier",
    description:
      "EfficientNetV2S model classifying 16 carp species and detecting 7 diseases with Grad-CAM explainability. Deployed via TFLite on Flutter with a bilingual Urdu/English interface.",
    tags: [
      "EfficientNetV2S",
      "TFLite",
      "Flutter",
      "Grad-CAM",
      "Transfer Learning",
    ],
    gradient: "from-coral/20 via-purple/10 to-violet/20",
    accent: "bg-coral",
    github: "#",
    live: "#",
  },
  {
    title: "CellSafe",
    subtitle: "AI Pre-Owned Mobile Marketplace",
    description:
      "Full-featured marketplace with XGBoost-powered price prediction (R² ≈ 0.90), computer-vision-based device condition assessment, and real-time chat. Built with Flutter and Firebase.",
    tags: [
      "XGBoost",
      "Computer Vision",
      "Flutter",
      "Firebase",
      "Price Prediction",
    ],
    gradient: "from-purple/20 via-violet/10 to-coral/20",
    accent: "bg-purple",
    github: "#",
    live: "#",
  },
  {
    title: "Apna Bhatta",
    subtitle: "Full-Stack Brick Kiln Management",
    description:
      "Production-grade platform built on Next.js 15 + TypeScript + PostgreSQL/Prisma. Features JWT authentication, role-based access control, GPS tracking, and comprehensive reporting.",
    tags: ["Next.js 15", "TypeScript", "PostgreSQL", "Prisma", "JWT", "RBAC"],
    gradient: "from-violet/20 via-coral/10 to-purple/20",
    accent: "bg-violet",
    github: "#",
    live: "#",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="relative py-[120px] lg:py-[160px] bg-surface/50">
      {/* Background accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-subtle" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-subtle" />

      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal>
          <div className="flex items-center gap-4 mb-16">
            <span className="text-sm font-mono text-violet font-medium">
              02
            </span>
            <h2
              className="font-heading font-bold text-content"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
            >
              Featured Projects
            </h2>
            <span className="flex-1 h-[1px] bg-subtle" />
          </div>
        </ScrollReveal>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative"
            >
              <div className="relative h-full rounded-3xl border border-subtle overflow-hidden bg-surface hover:border-violet/20 transition-all duration-500">
                {/* Image area / gradient placeholder */}
                <div
                  className={`relative h-48 bg-gradient-to-br ${project.gradient} overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-[var(--overlay-bg)]" />

                  {/* Project title overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl font-heading font-bold text-content/10 group-hover:text-content/20 transition-all duration-500 group-hover:scale-110">
                      {project.title[0]}
                    </span>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* View project label */}
                  <motion.div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-sm font-medium text-content opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400">
                    View Project
                    <ArrowUpRight size={14} />
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-heading font-bold text-content mb-1">
                      {project.title}
                    </h3>
                    <p className="text-sm text-violet font-medium">
                      {project.subtitle}
                    </p>
                  </div>

                  <p className="text-sm text-content-dim leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 text-[11px] font-medium text-content-dim/80 bg-[var(--tag-bg)] rounded-md border border-subtle"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-3 pt-2">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.title} GitHub repository`}
                      className="p-2.5 rounded-xl text-content-dim hover:text-content hover:bg-[var(--subtle-hover-strong)] transition-all duration-300"
                    >
                      <GithubIcon width={18} height={18} />
                    </a>
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.title} live demo`}
                      className="p-2.5 rounded-xl text-content-dim hover:text-content hover:bg-[var(--subtle-hover-strong)] transition-all duration-300"
                    >
                      <ExternalLink size={18} />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
