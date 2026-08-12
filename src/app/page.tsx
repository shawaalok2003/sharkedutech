import { HeroSection } from "@/components/landing/HeroSection";
import { AdCarousel } from "@/components/landing/AdCarousel";
import { LogoCarousel } from "@/components/landing/LogoCarousel";
import { JobCarousel } from "@/components/landing/JobCarousel";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Benefits } from "@/components/landing/Benefits";
import { Testimonials } from "@/components/landing/Testimonials";
import { Footer } from "@/components/layout/Footer";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  let topJobs: any[] = [];
  try {
    topJobs = await prisma.job.findMany({
      where: { isTopOpportunity: true, status: 'Active' },
      include: { employer: true },
      take: 10,
      orderBy: { createdAt: 'desc' }
    });
  } catch (e) {
    console.error('[Home] Failed to fetch jobs from DB:', e);
    // Render page without jobs — DB may be sleeping (Neon free tier)
  }

  return (
    <main>
      <HeroSection />
      <AdCarousel />
      <LogoCarousel />
      <Testimonials />
      <JobCarousel jobs={topJobs} />
      <HowItWorks />
      <Benefits />
      <Footer />
    </main>
  );
}

