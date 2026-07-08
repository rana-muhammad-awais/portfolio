"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Mail, ChevronDown, Sparkles, Code, Brain } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./icons";
import MagneticButton from "./MagneticButton";
import { SiteSettings } from "@prisma/client";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.2,
    },
  },
};

const wordVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, ease },
  },
};

const fadeUp = {
  hidden: { y: 30, opacity: 0 },
  visible: (delay: number) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, delay, ease },
  }),
};

const DEFAULT_HEADLINE = [
  { text: "I", gradient: false },
  { text: "Build", gradient: false },
  { text: "Machine", gradient: false },
  { text: "Learning", gradient: false },
  { text: "Systems", gradient: false },
  { text: "That", gradient: false },
  { text: "See,", gradient: true },
  { text: "Predict", gradient: true },
  { text: "&", gradient: true },
  { text: "Ship.", gradient: true },
];

const FLOATING_BADGES = [
  {
    icon: Sparkles,
    text: "AI/ML Engineer",
    position: "-top-4 -right-4 lg:-right-8",
    delay: 0.8,
    animation: "animate-float-1",
  },
  {
    icon: Code,
    text: "Python Expert",
    position: "-bottom-2 -left-4 lg:-left-6",
    delay: 1.0,
    animation: "animate-float-2",
  },
  {
    icon: Brain,
    text: "Deep Learning",
    position: "top-1/2 -right-6 lg:-right-12",
    delay: 1.2,
    animation: "animate-float-3",
  },
];

const SOCIALS = [
  {
    icon: GithubIcon,
    href: "https://github.com/muhammadawais",
    label: "GitHub",
  },
  {
    icon: LinkedinIcon,
    href: "https://linkedin.com/in/muhammadawais",
    label: "LinkedIn",
  },
  {
    icon: Mail,
    href: "mailto:awais@example.com",
    label: "Email",
  },
];

export default function Hero({ 
  settings, 
  headline 
}: { 
  settings?: SiteSettings | null;
  headline?: any[];
}) {
  const displayHeadline = headline?.length ? headline : DEFAULT_HEADLINE;
  const profileImage = settings?.profileImageUrl || "/profile.png";
  
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden pt-[72px]"
    >
      {/* Subtle background radials */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-violet/[0.04] blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-coral/[0.03] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-6 lg:px-8 w-full py-12 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Availability Badge */}
            {(!settings || settings.availabilityActive) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease }}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-card"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inset-0 rounded-full bg-emerald-400 animate-pulse-dot" />
                  <span className="relative rounded-full h-2.5 w-2.5 bg-emerald-400" />
                </span>
                <span className="text-sm text-content-dim font-medium">
                  {settings?.availabilityText || "Available for new opportunities"}
                </span>
              </motion.div>
            )}

            {/* Headline */}
            <motion.h1
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="font-heading font-extrabold leading-[1.02] tracking-[-0.02em]"
              style={{
                fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
              }}
            >
              {displayHeadline.map((word, i) => (
                <motion.span
                  key={i}
                  variants={wordVariants}
                  className={`inline-block mr-[0.25em] ${
                    word.gradient ? "gradient-text" : "text-content"
                  }`}
                >
                  {word.text}
                </motion.span>
              ))}
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              custom={0.6}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-lg lg:text-xl text-content-dim max-w-lg leading-relaxed"
            >
              {settings?.heroSubtext || "AI/ML Engineer specializing in computer vision, predictive modeling, and deploying ML solutions from research to production."}
            </motion.p>

            {/* CTAs */}
            <motion.div
              custom={0.75}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-4"
            >
              <MagneticButton strength={10}>
                <a
                  href="#projects"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .querySelector("#projects")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white rounded-full gradient-bg hover:shadow-xl hover:shadow-violet/20 transition-all duration-400 hover:scale-[1.02]"
                >
                  Explore My Work
                  <ChevronDown size={16} className="-rotate-90" />
                </a>
              </MagneticButton>

              <MagneticButton strength={8}>
                <a
                  href={settings?.cvUrl || "/resume.pdf"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-content rounded-full border border-subtle hover:bg-[var(--subtle-hover)] transition-all duration-300"
                >
                  Download CV
                </a>
              </MagneticButton>
            </motion.div>

            {/* Social Icons */}
            <motion.div
              custom={0.9}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-3 pt-2"
            >
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="group relative p-3 rounded-xl text-content-dim hover:text-content transition-all duration-300"
                >
                  <span className="absolute inset-0 rounded-xl bg-transparent group-hover:bg-[var(--subtle-hover-strong)] transition-colors duration-300" />
                  <social.icon width={20} height={20} className="relative z-10" />
                </a>
              ))}
              <span className="ml-2 h-[1px] w-12 bg-subtle" />
              <span className="text-xs text-content-dim/60 font-medium tracking-wider uppercase">
                Connect
              </span>
            </motion.div>
          </div>

          {/* Right Content — Photo + Glow + Floating Badges */}
          <motion.div
            custom={0.4}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="relative flex items-center justify-center lg:justify-end"
          >
            <div className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] lg:w-[440px] lg:h-[440px]">
              {/* Unified glow card — gradient shadow matches the rounded card shape */}
              <div className="hero-glow relative z-10 w-full h-full rounded-[32px] overflow-hidden shadow-2xl">
                <Image
                  src={profileImage}
                  alt="Muhammad Awais"
                  fill
                  sizes="(max-width: 640px) 300px, (max-width: 1024px) 380px, 440px"
                  priority
                  className="object-cover"
                  unoptimized={profileImage.includes('cloudinary')}
                />
              </div>

              {/* Floating Badges */}
              {FLOATING_BADGES.map((badge, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: badge.delay,
                    ease,
                  }}
                  className={`absolute z-20 ${badge.position} hidden sm:flex`}
                >
                  <div
                    className={`glass-card px-3 py-2 rounded-xl flex items-center gap-2 ${badge.animation} shadow-lg`}
                  >
                    <badge.icon size={14} className="text-violet" />
                    <span className="text-xs font-medium text-content whitespace-nowrap">
                      {badge.text}
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Decorative floating shapes */}
              <div
                className="absolute -top-8 left-8 w-3 h-3 rounded-full bg-coral/40 animate-float-2 hidden sm:block"
                aria-hidden="true"
              />
              <div
                className="absolute -bottom-6 right-12 w-2 h-2 rounded-full bg-violet/50 animate-float-1 hidden sm:block"
                aria-hidden="true"
              />
              <div
                className="absolute top-1/3 -left-10 w-4 h-4 rounded-full border border-purple/30 animate-float-3 hidden sm:block"
                aria-hidden="true"
              />
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-content-dim/50 font-medium">
            Scroll
          </span>
          <div className="w-[22px] h-[34px] rounded-full border-2 border-content-dim/20 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 rounded-full bg-content-dim/50 animate-scroll-dot" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
