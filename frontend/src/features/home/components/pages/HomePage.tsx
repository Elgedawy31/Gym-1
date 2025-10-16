"use client";

import FeaturesSection from "../templates/FeaturesSection";
import Footer from "../templates/Footer";
import HeroSection from "../templates/HeroSection";
import TrainersSection from "../templates/TrainersSection";
import MenSection from "../templates/MenSection";
import WomenSection from "../templates/WomenSection";

export default function HomePage() {

  


  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeroSection />
      <FeaturesSection />
      <TrainersSection />
      <MenSection />
      <WomenSection />
      <Footer />
    </div>
  );
}
