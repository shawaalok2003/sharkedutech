import { HeroSection } from "@/components/landing/HeroSection";
import { LogoCarousel } from "@/components/landing/LogoCarousel";
import { WhoWeAreSection } from "@/components/landing/WhoWeAreSection";
import { BrowseCategories } from "@/components/landing/BrowseCategories";
import { JobCarousel } from "@/components/landing/JobCarousel";
import { LiveBroadcastCarousel } from "@/components/landing/LiveBroadcastCarousel";
import { TalentPoolSection } from "@/components/landing/TalentPoolSection";
import { CareerMilestoneSection } from "@/components/landing/CareerMilestoneSection";
import { DreamCareerTestimonials } from "@/components/landing/DreamCareerTestimonials";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Benefits } from "@/components/landing/Benefits";
import { CandidateConsentSection } from "@/components/landing/CandidateConsentSection";
import { Footer } from "@/components/layout/Footer";

import { prisma } from "@/lib/prisma";
import { ensureOpportunitiesSeeded, OPPORTUNITIES_DATA } from "@/lib/seedOpportunities";

export const dynamic = "force-dynamic";

export default async function Home() {
  let topJobs: any[] = [];
  let liveVideos: any[] = [];

  try {
    await ensureOpportunitiesSeeded();
    const [jobs, broadcasts] = await Promise.all([
      prisma.job.findMany({
        where: { 
          isTopOpportunity: true, 
          status: 'Active',
          posterUrl: { not: null }
        },
        include: { employer: true },
        take: 50,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.liveVideo.findMany({
        where: { isFeatured: true },
        orderBy: [
          { isLiveNow: 'desc' },
          { order: 'asc' },
          { createdAt: 'desc' }
        ],
        take: 20
      })
    ]);
    topJobs = jobs;
    liveVideos = broadcasts;
  } catch (e) {
    console.error('[Home] Failed to fetch data from DB:', e);
  }

  // Ensure fallback to OPPORTUNITIES_DATA if DB fetch returned empty or missing posterUrl
  if (!topJobs || topJobs.length === 0) {
    topJobs = OPPORTUNITIES_DATA.map((item, idx) => ({
      id: `seed-job-${idx + 1}`,
      createdAt: (item as any).createdAt || new Date(Date.now() - (idx * 86400000)).toISOString(),
      ...item
    }));
  }

  return (
    <main style={{ overflowX: 'hidden' }}>
      <HeroSection />
      <JobCarousel jobs={topJobs} />
      <LogoCarousel />
      <WhoWeAreSection />
      <CandidateConsentSection />
      <LiveBroadcastCarousel initialVideos={liveVideos} />
      <BrowseCategories />
      <TalentPoolSection />
      <CareerMilestoneSection />
      <DreamCareerTestimonials />
      <HowItWorks />
      <Benefits />
      <Footer />
    </main>
  );
}

