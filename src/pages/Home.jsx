import React from 'react';
import { useTranslation } from 'react-i18next';
import { Hero } from '@/components/home/Hero';
import { ProductsSection } from '@/components/home/ProductsSection';
import { AboutSection } from '@/components/home/AboutSection';
import { FaqSection } from '@/components/home/FaqSection';
import { ContactSection } from '@/components/home/ContactSection';

export function Home() {
  const { t } = useTranslation();

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
