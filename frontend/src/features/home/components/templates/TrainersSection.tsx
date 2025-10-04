'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Trainer } from '../../types';

export default function TrainersSection({trainers}: {trainers: Trainer[]}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-16"
        >
          Best Trainers
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trainers.map((trainer, idx) => (
            <motion.div
              key={trainer._id}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="overflow-hidden hover:shadow-xl p-0 transition-all duration-300 group-hover:bg-primary/5">
                <CardHeader className="p-0">
                  <div className="relative w-full h-64 overflow-hidden">
                    <Image
                      src={trainer.profilePicture}
                      alt={trainer.name}
                      fill
                      sizes="(max-width: 768px) 100vw,
                            (max-width: 1024px) 50vw,
                            33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </CardHeader>
                <CardContent className="pb-6 text-center">
                  <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">{trainer.name}</CardTitle>
                  <CardDescription className="text-muted-foreground mb-4">{trainer.gender === "male" ? "Strength & Conditioning": "Yoga & Flexibility"}</CardDescription>
                  <Button className="w-full group-hover:bg-primary/90 transition-colors">View Profile</Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
