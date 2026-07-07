"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const BLOB_PATHS = [
  "M250,50C350,50,450,140,450,250C450,360,350,450,250,450C150,450,50,360,50,250C50,140,150,50,250,50Z",
  "M260,35C385,55,465,145,455,265C445,385,355,465,235,455C115,445,35,355,50,235C65,115,140,15,260,35Z",
  "M240,40C365,30,460,120,455,250C450,380,365,465,240,460C115,455,30,370,45,240C60,110,120,50,240,40Z",
  "M255,45C375,40,455,135,450,260C445,385,370,460,245,455C120,450,40,365,55,240C70,115,135,50,255,45Z",
];

export default function BlobBackground() {
  const pathRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<SVGSVGElement>(null);
  const reducedMotion = useReducedMotion();

  // GSAP blob morphing
  useEffect(() => {
    if (reducedMotion || !pathRef.current) return;

    const tl = gsap.timeline({ repeat: -1 });

    BLOB_PATHS.forEach((path, i) => {
      if (i === 0) return;
      tl.to(pathRef.current, {
        attr: { d: path },
        duration: 4,
        ease: "sine.inOut",
      });
    });

    // Loop back to first path
    tl.to(pathRef.current, {
      attr: { d: BLOB_PATHS[0] },
      duration: 4,
      ease: "sine.inOut",
    });

    return () => {
      tl.kill();
    };
  }, [reducedMotion]);

  // Cursor parallax
  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 24;
      targetY = (e.clientY / window.innerHeight - 0.5) * 24;
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;

      if (containerRef.current) {
        containerRef.current.style.transform = `translate(${currentX}px, ${currentY}px)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [reducedMotion]);

  return (
    <svg
      ref={containerRef}
      viewBox="0 0 500 500"
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="blob-gradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#FF6B6B" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#C86DD7" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#6B5BFF" stopOpacity="0.4" />
        </linearGradient>
        <filter id="blob-blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
        </filter>
      </defs>
      <path
        ref={pathRef}
        d={BLOB_PATHS[0]}
        fill="url(#blob-gradient)"
        filter="url(#blob-blur)"
      />
    </svg>
  );
}
