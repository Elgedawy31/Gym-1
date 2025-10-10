'use client';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="container mx-auto max-w-7xl flex flex-col lg:flex-row items-center gap-12">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="lg:w-1/2 text-center lg:text-left">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Transform Your Body, Elevate Your Life
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-md mx-auto lg:mx-0">
            Join Elgedawy Gym and embark on a journey to peak fitness. Tailored programs for men and women to build strength, endurance, and confidence.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
            <Button size="lg" className="px-8 py-4 text-lg"><Link href="/subscription">Start Your Journey</Link></Button>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative overflow-hidden rounded-2xl shadow-lg">
            <Image src="https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg" priority alt="Man working out" width={400} height={500} className="w-full h-80 md:h-96 object-cover hover:scale-105 transition-transform duration-300" />
          </div>
          <div className="relative overflow-hidden rounded-2xl shadow-lg">
            <Image src="https://images.pexels.com/photos/7956746/pexels-photo-7956746.jpeg" priority alt="Women working out" width={400} height={500} className="w-full h-80 md:h-96 object-cover hover:scale-105 transition-transform duration-300" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
