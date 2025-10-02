"use client";

import FeaturesSection from "../templates/FeaturesSection";
import Footer from "../templates/Footer";
import HeroSection from "../templates/HeroSection";
import ProductsSection from "../templates/ProductsSection";
import TrainersSection from "../templates/TrainersSection";



const menProducts = [
  {
    id: 1,
    name: 'Whey Protein Powder',
    price: '$49.99',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e4?w=300&h=300&fit=crop',
  },
  {
    id: 2,
    name: 'Adjustable Dumbbells',
    price: '$129.99',
    image: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c6f?w=300&h=300&fit=crop',
  },
  {
    id: 3,
    name: 'Resistance Bands Set',
    price: '$24.99',
    image: 'https://images.unsplash.com/photo-1581229873571-5e0a4a1c67e9?w=300&h=300&fit=crop',
  },
];

const womenProducts = [
  {
    id: 4,
    name: 'High-Waist Leggings',
    price: '$39.99',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop',
  },
  {
    id: 5,
    name: 'Yoga Mat Premium',
    price: '$29.99',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop',
  },
  {
    id: 6,
    name: 'Sports Bra Set',
    price: '$34.99',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop',
  },
  {
    id: 7,
    name: 'Sports Bra Set',
    price: '$34.99',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop',
  },
  {
    id: 8,
    name: 'Sports Bra Set',
    price: '$34.99',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop',
  },
  {
    id: 9,
    name: 'Sports Bra Set',
    price: '$34.99',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeroSection />
      <FeaturesSection />
      <TrainersSection />
      <div className="bg-muted/50">
        <ProductsSection title="Best Products For Men" products={menProducts} />
      </div>
      <ProductsSection title="Best Products For Women" products={womenProducts} reverseAnimation />
      <Footer />
    </div>
  );
}
