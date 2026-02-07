import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Benefits } from "@/components/landing/Benefits";
import { FeaturedJobs } from "@/components/landing/FeaturedJobs";
import { Testimonials } from "@/components/landing/Testimonials";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <HowItWorks />
      <Benefits />
      <FeaturedJobs />
      <Testimonials />
      <Footer />
    </main>
  );
}
