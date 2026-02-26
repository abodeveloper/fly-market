import React from 'react';
import { Hero } from '@/components/home/Hero';
import { ProductsSection } from '@/components/home/ProductsSection';
import { AboutSection } from '@/components/home/AboutSection';
import { FaqSection } from '@/components/home/FaqSection';
import { ContactSection } from '@/components/home/ContactSection';

export function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <ProductsSection />
      <AboutSection />
      <FaqSection />
      <ContactSection />
    </div>
  );
}
