import { HeroSection } from "@/components/landing/HeroSection";
import { AdCarousel } from "@/components/landing/AdCarousel";
import { JobCarousel } from "@/components/landing/JobCarousel";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Benefits } from "@/components/landing/Benefits";
import { FeaturedJobs } from "@/components/landing/FeaturedJobs";
import { Testimonials } from "@/components/landing/Testimonials";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AdCarousel />
      <JobCarousel />
      <HowItWorks />
      <Benefits />
      <FeaturedJobs />
      <Testimonials />
      <Footer />
    </main>
  );
}
