"use client";

import { useEffect, useState } from "react";
import FeaturesSection from "../templates/FeaturesSection";
import Footer from "../templates/Footer";
import HeroSection from "../templates/HeroSection";
import TrainersSection from "../templates/TrainersSection";
import toast from "react-hot-toast";
import { getTopTrainers } from "../../hooks/useHome";
import { Trainer } from "../../types";
import MenSection from "../templates/MenSection";
import WomanSection from "../templates/WomanSection";

export default function HomePage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);

  useEffect(() => {
    const fetchTopTrainers = async () => {
  
      try {
        const res = await getTopTrainers();
        if (res) {
          setTrainers(res);
        } else {
          toast.error("Something went wrong during get Trainer");
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong. Please try again.");
      }
    };
  
    fetchTopTrainers();
  }, []);
  


  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeroSection />
      <FeaturesSection />
      <TrainersSection trainers={trainers}/>
      <MenSection />
      <WomanSection />
      <Footer />
    </div>
  );
}
