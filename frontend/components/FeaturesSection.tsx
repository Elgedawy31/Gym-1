'use client';
import { motion, useInView } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, Users, HeartPulse, Apple } from 'lucide-react';
import { useRef } from 'react';

const features = [
  { icon: Dumbbell, title: 'State-of-the-Art Equipment', description: 'Access the latest fitness machines and tools to maximize your workout efficiency.' },
  { icon: Users, title: 'Group Classes', description: 'Join dynamic group sessions led by certified instructors for motivation and fun.' },
  { icon: HeartPulse, title: 'Personal Training', description: 'Get customized one-on-one sessions tailored to your fitness goals and needs.' },
  { icon: Apple, title: 'Nutrition Guidance', description: 'Receive expert advice on diet and supplements to complement your training.' },
];

export default function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-20 px-4 bg-muted/50">
      <div className="container mx-auto max-w-6xl">
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-4xl font-bold text-center mb-16">
          Why Choose Elgedawy Gym?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} initial={{ opacity: 0, scale: 0.9, y: 50 }} animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: index * 0.1 }} whileHover={{ scale: 1.05, y: -5 }} className="group">
                <Card className="h-full p-6 text-center hover:shadow-lg transition-all duration-300 group-hover:bg-primary/5">
                  <CardHeader className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
