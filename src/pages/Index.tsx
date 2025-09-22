import React from 'react';
import BinaryRain from '@/components/BinaryRain';
import HeroSection from '@/components/HeroSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import BlogSection from '@/components/BlogSection';
import InteractiveDemo from '@/components/InteractiveDemo';
import CostCalculator from '@/components/CostCalculator';
import Newsletter from '@/components/Newsletter';
import LiveChat from '@/components/LiveChat';
import SearchFunctionality from '@/components/SearchFunctionality';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-ocean text-foreground">
      {/* Background */}
      <BinaryRain />
      
      {/* Main content */}
      <PageTransition>
        <main className="relative z-10">
          <HeroSection />
          <InteractiveDemo />
          <TestimonialsSection />
          <CostCalculator />
          <BlogSection />
          <Newsletter />
        </main>
      </PageTransition>
      
      {/* Search Functionality */}
      <SearchFunctionality />
      
      {/* Live Chat */}
      <LiveChat />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;