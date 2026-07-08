"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Send } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./icons";
import ScrollReveal from "./ScrollReveal";
import MagneticButton from "./MagneticButton";
import { SiteSettings } from "../generated/prisma/client";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
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

const CTA_WORDS = ["Let's", "Build", "Something", "Amazing", "Together."];

const DEFAULT_CONTACT_INFO = [
  {
    icon: Mail,
    label: "Email",
    value: "awais@example.com",
    href: "mailto:awais@example.com",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Shahkot, Punjab, Pakistan",
    href: null,
  },
  {
    icon: LinkedinIcon,
    label: "LinkedIn",
    value: "linkedin.com/in/muhammadawais",
    href: "https://linkedin.com/in/muhammadawais",
  },
  {
    icon: GithubIcon,
    label: "GitHub",
    value: "github.com/muhammadawais",
    href: "https://github.com/muhammadawais",
  },
];

export default function Contact({ settings }: { settings?: SiteSettings | null }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const contactInfo = settings ? [
    {
      icon: Mail,
      label: "Email",
      value: settings.contactEmail,
      href: `mailto:${settings.contactEmail}`,
    },
    {
      icon: MapPin,
      label: "Location",
      value: settings.contactLocation,
      href: null,
    },
    {
      icon: LinkedinIcon,
      label: "LinkedIn",
      value: (settings.linkedinUrl || "").replace("https://", ""),
      href: settings.linkedinUrl || "",
    },
    {
      icon: GithubIcon,
      label: "GitHub",
      value: (settings.githubUrl || "").replace("https://", ""),
      href: settings.githubUrl || "",
    },
  ] : DEFAULT_CONTACT_INFO;

  return (
    <section
      id="contact"
      className="relative py-[80px] lg:py-[100px] bg-surface/50"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-subtle" />

      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-violet/[0.03] blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] rounded-full bg-coral/[0.03] blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal>
          <div className="flex items-center gap-4 mb-8">
            <span className="text-sm font-mono text-violet font-medium">
              04
            </span>
            <h2
              className="font-heading font-bold text-content"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
            >
              Get In Touch
            </h2>
            <span className="flex-1 h-[1px] bg-subtle" />
          </div>
        </ScrollReveal>

        {/* Big CTA Headline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-16"
        >
          <h3
            className="font-heading font-bold leading-tight"
            style={{ fontSize: "clamp(1.75rem, 5vw, 4rem)" }}
          >
            {CTA_WORDS.map((word, i) => (
              <motion.span
                key={i}
                variants={wordVariants}
                className={`inline-block mr-[0.3em] ${
                  i >= 3 ? "gradient-text" : "text-content"
                }`}
              >
                {word}
              </motion.span>
            ))}
          </h3>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-8">
            <ScrollReveal delay={0.1}>
              <p className="text-lg text-content-dim leading-relaxed">
                I&apos;m always open to discussing new projects, internship
                opportunities, or collaborations in AI/ML. Feel free to reach
                out — let&apos;s explore how we can work together.
              </p>
            </ScrollReveal>

            <div className="space-y-4">
              {contactInfo.map((info, i) => (
                <ScrollReveal key={info.label} delay={0.2 + i * 0.08}>
                  <div className="group flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--input-bg)] border border-subtle flex items-center justify-center group-hover:border-violet/30 group-hover:bg-violet/[0.06] transition-all duration-300">
                      <info.icon
                        width={18}
                        height={18}
                        className="text-content-dim group-hover:text-violet transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-content-dim/60 uppercase tracking-wider font-medium">
                        {info.label}
                      </p>
                      {info.href ? (
                        <a
                          href={info.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-content hover:text-violet transition-colors duration-300"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-sm text-content">{info.value}</p>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <ScrollReveal delay={0.2}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm text-content-dim mb-2 font-medium"
                >
                  Name
                </label>
                <input
                  suppressHydrationWarning
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-3.5 bg-[var(--input-bg)] border border-subtle rounded-xl text-content placeholder:text-content-dim/40 focus:border-violet/40 focus:bg-[var(--input-focus-bg)] focus:outline-none transition-all duration-300"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm text-content-dim mb-2 font-medium"
                >
                  Email
                </label>
                <input
                  suppressHydrationWarning
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full px-4 py-3.5 bg-[var(--input-bg)] border border-subtle rounded-xl text-content placeholder:text-content-dim/40 focus:border-violet/40 focus:bg-[var(--input-focus-bg)] focus:outline-none transition-all duration-300"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm text-content-dim mb-2 font-medium"
                >
                  Message
                </label>
                <textarea
                  suppressHydrationWarning
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3.5 bg-[var(--input-bg)] border border-subtle rounded-xl text-content placeholder:text-content-dim/40 focus:border-violet/40 focus:bg-[var(--input-focus-bg)] focus:outline-none transition-all duration-300 resize-none"
                  placeholder="Tell me about your project or opportunity..."
                />
              </div>

              <MagneticButton strength={8} className="w-full">
                <button
                  suppressHydrationWarning
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className={`w-full inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold text-white rounded-xl transition-all duration-400 ${
                    status === "success" ? "bg-emerald-500" : "gradient-bg hover:shadow-xl hover:shadow-violet/20"
                  }`}
                >
                  {status === "loading" ? "Sending..." : status === "success" ? "Message Sent!" : "Send Message"}
                  {status !== "success" && <Send size={16} />}
                </button>
              </MagneticButton>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
