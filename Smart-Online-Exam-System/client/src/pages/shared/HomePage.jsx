import { useState } from "react";

import Navbar from "../../components/landing/Navbar/Navbar";
import Hero from "../../components/landing/Hero/Hero";
import TrustedBy from "../../components/landing/TrustedBy/TrustedBy";
import Stats from "../../components/landing/Stats/Stats";
import Features from "../../components/landing/Features/Features";
import DashboardPreview from "../../components/landing/DashboardPreview/DashboardPreview";
import AISection from "../../components/landing/AISection/AISection";
import Security from "../../components/landing/Security/Security";
import Testimonials from "../../components/landing/Testimonials/Testimonials";
import FAQ from "../../components/landing/FAQ/FAQ";
import CTA from "../../components/landing/CTA/CTA";
import Footer from "../../components/landing/Footer/Footer";

function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main>
      <Navbar
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      <Hero />
      <TrustedBy />
      <Stats />
      <Features />
      <DashboardPreview />
      <AISection />
      <Security />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}

export default HomePage;