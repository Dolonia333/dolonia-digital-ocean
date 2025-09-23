import React from 'react';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import HeroSection from '@/components/HeroSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import CostCalculator from '@/components/CostCalculator';
import Newsletter from '@/components/Newsletter';
import LiveChat from '@/components/LiveChat';
import SearchFunctionality from '@/components/SearchFunctionality';

const Index = () => {
  return (
    <Layout>
      <SEO 
        title="Dolonia - Advanced Cybersecurity Solutions"
        description="Secure your digital future with Dolonia's cutting-edge cybersecurity solutions. Multi-cloud security, zero-trust architecture, and AI-powered threat detection for modern businesses."
      />
      
      <HeroSection />
      <TestimonialsSection />
      <CostCalculator />
      <Newsletter />
      
      {/* Search Functionality */}
      <SearchFunctionality />
      
      {/* Live Chat */}
      <LiveChat />
    </Layout>
  );
};

export default Index;