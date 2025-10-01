import React from 'react';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import HeroSection from '@/components/HeroSection';
import ServicePackages from '@/components/ServicePackages';
import CaseStudies from '@/components/CaseStudies';
import RetainerCalculator from '@/components/RetainerCalculator';
import TestimonialsSection from '@/components/TestimonialsSection';
import Newsletter from '@/components/Newsletter';
import LiveChat from '@/components/LiveChat';
import SearchFunctionality from '@/components/SearchFunctionality';

const Index = () => {
  return (
    <Layout>
      <SEO 
        title="Dolonia Data Tech - Websites, Automation & Secure Hosting"
        description="Professional websites, smart automation workflows, and secure hosting for Oklahoma businesses. Predictable monthly retainers with no hidden fees. Based in OKC."
      />
      
      <HeroSection />
      <ServicePackages />
      <CaseStudies />
      <RetainerCalculator />
      <TestimonialsSection />
      <Newsletter />
      
      {/* Search Functionality */}
      <SearchFunctionality />
      
      {/* Live Chat */}
      <LiveChat />
    </Layout>
  );
};

export default Index;