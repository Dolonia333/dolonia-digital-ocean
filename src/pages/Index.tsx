import React from 'react';
import BinaryRain from '@/components/BinaryRain';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import BlogSection from '@/components/BlogSection';
import PerformanceDashboard from '@/components/PerformanceDashboard';
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
      {/* Binary rain background effect */}
      <BinaryRain />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Main content */}
      <PageTransition>
        <main className="relative z-10">
          <HeroSection />
          <PerformanceDashboard />
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