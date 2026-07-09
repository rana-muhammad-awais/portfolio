"use client";

import { Mail, ArrowUp } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./icons";
import ScrollReveal from "./ScrollReveal";
import { SiteSettings } from "@prisma/client";

const FOOTER_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Footer({ settings }: { settings?: SiteSettings | null }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  const socialLinks = settings ? [
    {
      icon: GithubIcon,
      href: settings.githubUrl || "",
      label: "GitHub",
    },
    {
      icon: LinkedinIcon,
      href: settings.linkedinUrl || "",
      label: "LinkedIn",
    },
    {
      icon: Mail,
      href: `mailto:${settings.contactEmail}`,
      label: "Email",
    },
  ] : [
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

  const year = new Date().getFullYear();

  return (
    <footer className="relative pt-16 pb-8 bg-base border-t border-subtle">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12">
            {/* Logo */}
            <div>
              <a href="#home" className="text-2xl font-heading font-bold">
                <span className="gradient-text">Muhammad Awais</span>
              </a>
              <p className="text-sm text-content-dim mt-2 max-w-xs">
                {settings?.heroSubtext || "AI/ML Engineer building intelligent systems that solve real-world problems."}
              </p>
            </div>

            {/* Nav Links */}
            <nav className="flex flex-wrap gap-6">
              {FOOTER_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-content-dim hover:text-content transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Socials */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="p-2.5 rounded-xl text-content-dim hover:text-content hover:bg-[var(--subtle-hover-strong)] transition-all duration-300"
                >
                  <social.icon width={18} height={18} />
                </a>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-subtle">
          <p className="text-xs text-content-dim/50">
            © {year} Muhammad Awais. All rights reserved.
          </p>

          <button
            suppressHydrationWarning
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="group flex items-center gap-2 text-xs text-content-dim/50 hover:text-content-dim transition-colors duration-300"
          >
            Back to top
            <span className="p-1.5 rounded-lg bg-[var(--tag-bg)] group-hover:bg-[var(--subtle-hover-strong)] transition-colors duration-300">
              <ArrowUp size={14} />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
