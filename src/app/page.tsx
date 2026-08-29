import { HeroSection } from "@/components/landing/HeroSection";
import { LogoCarousel } from "@/components/landing/LogoCarousel";
import { WhoWeAreSection } from "@/components/landing/WhoWeAreSection";
import { BrowseCategories } from "@/components/landing/BrowseCategories";
import { JobCarousel } from "@/components/landing/JobCarousel";
import { TalentPoolSection } from "@/components/landing/TalentPoolSection";
import { CareerMilestoneSection } from "@/components/landing/CareerMilestoneSection";
import { DreamCareerTestimonials } from "@/components/landing/DreamCareerTestimonials";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Benefits } from "@/components/landing/Benefits";
import { Footer } from "@/components/layout/Footer";

import { prisma } from "@/lib/prisma";
import { ensureOpportunitiesSeeded, OPPORTUNITIES_DATA } from "@/lib/seedOpportunities";

export const dynamic = "force-dynamic";

export default async function Home() {
  let topJobs: any[] = [];
  try {
    await ensureOpportunitiesSeeded();
    topJobs = await prisma.job.findMany({
      where: { 
        isTopOpportunity: true, 
        status: 'Active',
        posterUrl: { not: null }
      },
      include: { employer: true },
      take: 50,
      orderBy: { createdAt: 'desc' }
    });
  } catch (e) {
    console.error('[Home] Failed to fetch jobs from DB:', e);
  }

  // Ensure fallback to OPPORTUNITIES_DATA if DB fetch returned empty or missing posterUrl
  if (!topJobs || topJobs.length === 0) {
    topJobs = OPPORTUNITIES_DATA.map((item, idx) => ({
      id: `seed-job-${idx + 1}`,
      ...item
    }));
  }

  return (
    <main style={{ overflowX: 'hidden' }}>
      <HeroSection />
      <LogoCarousel />
      <WhoWeAreSection />
      <BrowseCategories />
      <JobCarousel jobs={topJobs} />
      <TalentPoolSection />
      <CareerMilestoneSection />
      <DreamCareerTestimonials />
      <HowItWorks />
      <Benefits />
      <Footer />
    </main>
  );
}
