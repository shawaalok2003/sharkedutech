import { HeroSection } from "@/components/landing/HeroSection";
import { AdCarousel } from "@/components/landing/AdCarousel";
import { LogoCarousel } from "@/components/landing/LogoCarousel";
import { JobCarousel } from "@/components/landing/JobCarousel";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Benefits } from "@/components/landing/Benefits";
import { Testimonials } from "@/components/landing/Testimonials";
import { Footer } from "@/components/layout/Footer";

import { prisma } from "@/lib/prisma";

export default async function Home() {
  const topJobs = await prisma.job.findMany({
    where: { isTopOpportunity: true, status: 'Active' },
    include: { employer: true },
    take: 10,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main>
      <HeroSection />
      <AdCarousel />
      <LogoCarousel />
      <JobCarousel jobs={topJobs} />
      <HowItWorks />
      <Benefits />
      <Testimonials />
      <Footer />
    </main>
  );
}
