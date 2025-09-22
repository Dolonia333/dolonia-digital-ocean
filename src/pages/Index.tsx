import React from 'react';
import BinaryRain from '@/components/BinaryRain';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import SecuritySection from '@/components/SecuritySection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-ocean text-foreground">
      {/* Binary rain background effect */}
      <BinaryRain />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Main content */}
      <main className="relative z-10">
        <HeroSection />
        <ServicesSection />
        <SecuritySection />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;