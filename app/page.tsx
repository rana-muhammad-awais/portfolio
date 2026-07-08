import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "main" },
  });

  const projects = await prisma.project.findMany({
    where: { visible: true },
    orderBy: { sortOrder: "asc" },
  });

  const experience = await prisma.experience.findMany({
    where: { visible: true },
    orderBy: { sortOrder: "asc" },
  });

  const stats = await prisma.stat.findMany({
    orderBy: { sortOrder: "asc" },
  });

  // Fallback to default values if settings not found
  const parsedHeadline = settings?.heroHeadline
    ? JSON.parse(settings.heroHeadline)
    : [];
    
  const parsedSkills = settings?.aboutSkills
    ? JSON.parse(settings.aboutSkills)
    : [];

  return (
    <>
      <Navbar settings={settings} />
      <main>
        <Hero settings={settings} headline={parsedHeadline} />
        <Marquee skills={parsedSkills} />
        <About settings={settings} stats={stats} />
        <Projects projects={projects} />
        <Experience experience={experience} />
        <Contact settings={settings} />
      </main>
      <Footer settings={settings} />
    </>
  );
}
