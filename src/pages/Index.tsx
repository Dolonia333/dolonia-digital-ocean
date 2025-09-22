import React from 'react';
import BinaryRain from '@/components/BinaryRain';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-ocean text-foreground">
      {/* Binary rain background effect */}
      <BinaryRain />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Main content */}
      <PageTransition>
        <main className="relative z-10">
          <HeroSection />
        </main>
      </PageTransition>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;