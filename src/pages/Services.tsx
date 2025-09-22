import React from 'react';
import BinaryRain from '@/components/BinaryRain';
import Navigation from '@/components/Navigation';
import ServicesSection from '@/components/ServicesSection';
import DetailedServicesSection from '@/components/DetailedServicesSection';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';

const Services = () => {
  return (
    <div className="min-h-screen bg-gradient-ocean text-foreground">
      <BinaryRain />
      <Navigation />
      
      <PageTransition>
        <main className="relative z-10 pt-20">
          <div className="container mx-auto px-6 py-16">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-cyber bg-clip-text text-transparent">Our Services</span>
              </h1>
              <p className="text-xl text-cyan-soft max-w-3xl mx-auto">
                Modern technology, automation, and digital solutions to help your business scale securely and efficiently.
              </p>
            </div>
          </div>
          <ServicesSection />
          <DetailedServicesSection />
        </main>
      </PageTransition>
      
      <Footer />
    </div>
  );
};

export default Services;