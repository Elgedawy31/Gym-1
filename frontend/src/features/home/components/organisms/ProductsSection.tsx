'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/features/Products/types/productTypes';


interface ProductsSectionProps {
  products: Product[];
  reverseAnimation?: boolean; // x direction
}

export default function ProductsSection({ products, reverseAnimation }: ProductsSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="pb-10 pt-4 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: reverseAnimation ? 50 : -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Link href={`/products/details/${product._id}`}>
                <Card className="overflow-hidden hover:shadow-xl transition-all p-0 duration-300 group-hover:bg-primary/5 cursor-pointer">
                  <CardHeader className="p-0">
                    <div className="relative w-full h-64 overflow-hidden">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw,
                              (max-width: 1024px) 50vw,
                              33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">{product.name}</CardTitle>
                    <CardDescription className="text-2xl font-bold text-primary mb-4">${product.price}</CardDescription>
                    <Button className="w-full group-hover:bg-primary/90 transition-colors">View Details</Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
