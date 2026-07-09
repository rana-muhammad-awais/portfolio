import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

async function main() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });
  const prisma = new PrismaClient({ adapter });

  // Seed admin user
  const email = process.env.ADMIN_EMAIL!;
  const password = process.env.ADMIN_PASSWORD!;
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });
  console.log("✅ Admin user seeded:", email);

  // Seed default site settings
  await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      aboutBio: `I'm Muhammad Awais, an **AI/ML Engineer** passionate about building intelligent systems that solve real-world problems. I specialize in **computer vision**, **deep learning**, and **predictive analytics**, with hands-on experience deploying ML models to production using modern frameworks and pipelines.\n\nFrom training **EfficientNet models** for species classification to building **XGBoost pricing engines** and shipping full-stack platforms with **Next.js + Prisma**, I bridge the gap between ML research and production-ready software. Currently pursuing my BSCS with a **3.72 CGPA**, securing 1st position every semester.`,
      aboutSkills: JSON.stringify([
        "Computer Vision", "Deep Learning", "NLP", "Predictive Modeling",
        "Data Analysis", "Model Deployment", "Transfer Learning",
        "Image Classification", "Object Detection", "Grad-CAM",
        "TFLite", "REST APIs", "Full-Stack Development",
      ]),
      contactEmail: "awais@example.com",
      contactLocation: "Shahkot, Punjab, Pakistan",
      githubUrl: "https://github.com/muhammadawais",
      linkedinUrl: "https://linkedin.com/in/muhammadawais",
    },
  });
  console.log("✅ Site settings seeded");

  // Seed stats
  const stats = [
    { value: 3.72, label: "CGPA", suffix: "/4.00", decimals: 2, sortOrder: 0 },
    { value: 1, label: "Position Every Semester", suffix: "st", decimals: 0, sortOrder: 1 },
    { value: 2, label: "ML Internships", suffix: "+", decimals: 0, sortOrder: 2 },
    { value: 3, label: "Major Projects", suffix: "+", decimals: 0, sortOrder: 3 },
  ];

  const existingStats = await prisma.stat.count();
  if (existingStats === 0) {
    for (const stat of stats) {
      await prisma.stat.create({ data: stat });
    }
    console.log("✅ Stats seeded");
  }

  // Seed projects
  const existingProjects = await prisma.project.count();
  if (existingProjects === 0) {
    const projects = [
      {
        title: "CarpSense",
        subtitle: "AI-Powered Fish Species Classifier",
        description: "EfficientNetV2S model classifying 16 carp species and detecting 7 diseases with Grad-CAM explainability. Deployed via TFLite on Flutter with a bilingual Urdu/English interface.",
        tags: JSON.stringify(["EfficientNetV2S", "TFLite", "Flutter", "Grad-CAM", "Transfer Learning"]),
        gradient: "from-coral/20 via-purple/10 to-violet/20",
        sortOrder: 0,
      },
      {
        title: "CellSafe",
        subtitle: "AI Pre-Owned Mobile Marketplace",
        description: "Full-featured marketplace with XGBoost-powered price prediction (R² ≈ 0.90), computer-vision-based device condition assessment, and real-time chat. Built with Flutter and Firebase.",
        tags: JSON.stringify(["XGBoost", "Computer Vision", "Flutter", "Firebase", "Price Prediction"]),
        gradient: "from-purple/20 via-violet/10 to-coral/20",
        sortOrder: 1,
      },
      {
        title: "Apna Bhatta",
        subtitle: "Full-Stack Brick Kiln Management",
        description: "Production-grade platform built on Next.js 15 + TypeScript + PostgreSQL/Prisma. Features JWT authentication, role-based access control, GPS tracking, and comprehensive reporting.",
        tags: JSON.stringify(["Next.js 15", "TypeScript", "PostgreSQL", "Prisma", "JWT", "RBAC"]),
        gradient: "from-violet/20 via-coral/10 to-purple/20",
        sortOrder: 2,
      },
    ];
    for (const project of projects) {
      await prisma.project.create({ data: project });
    }
    console.log("✅ Projects seeded");
  }

  // Seed experience
  const existingExp = await prisma.experience.count();
  if (existingExp === 0) {
    const experiences = [
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
        sortOrder: 0,
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
        sortOrder: 1,
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
        sortOrder: 2,
      },
    ];
    for (const exp of experiences) {
      await prisma.experience.create({ data: exp });
    }
    console.log("✅ Experience seeded");
  }

  await prisma.$disconnect();
  console.log("🎉 Seeding complete!");
}

main().catch(console.error);
