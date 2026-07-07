"use client";

const TECH_ITEMS = [
  "Python",
  "TensorFlow",
  "PyTorch",
  "Keras",
  "Scikit-learn",
  "XGBoost",
  "OpenCV",
  "NumPy",
  "Pandas",
  "Flask",
  "FastAPI",
  "Next.js",
  "TypeScript",
  "Flutter",
  "Firebase",
  "PostgreSQL",
  "Prisma",
  "Docker",
  "Git",
  "Jupyter",
];

export default function Marquee() {
  const items = [...TECH_ITEMS, ...TECH_ITEMS];

  return (
    <section className="relative py-12 border-y border-subtle overflow-hidden">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-base to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-base to-transparent z-10 pointer-events-none" />

      <div className="group">
        <div className="flex animate-marquee group-hover:[animation-play-state:paused] w-max">
          {items.map((item, i) => (
            <div
              key={`${item}-${i}`}
              className="flex items-center gap-4 mx-6 whitespace-nowrap"
            >
              <span className="text-lg font-heading font-semibold text-content-dim/50 hover:text-content-dim transition-colors duration-300">
                {item}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-violet/30" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
