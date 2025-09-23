import React from 'react';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import ServicesSection from '@/components/ServicesSection';
import DetailedServicesSection from '@/components/DetailedServicesSection';

const Services = () => {
  return (
    <Layout>
      <SEO 
        title="Our Services - Advanced Cybersecurity Solutions"
        description="Modern technology, automation, and digital solutions to help your business scale securely and efficiently. Explore our comprehensive cybersecurity services."
        keywords="cybersecurity services, cloud security, zero trust, threat detection, security consulting, digital security solutions"
      />
      
      <div className="pt-20">
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
      </div>
    </Layout>
  );
};

export default Services;