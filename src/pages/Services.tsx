import React from 'react';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import ServicePackages from '@/components/ServicePackages';
import CaseStudies from '@/components/CaseStudies';
import InteractiveDemo from '@/components/InteractiveDemo';

const Services = () => {
  return (
    <Layout>
      <SEO 
        title="Our Services - Websites, Automation & Hosting"
        description="Professional WordPress sites, n8n automation workflows, and secure hosting. Productized packages designed for small businesses and growing companies."
        keywords="web development oklahoma, automation services, wordpress hosting, n8n workflows, business automation, okc web design"
      />
      
      <div className="pt-20">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-cyber bg-clip-text text-transparent">What We Do</span>
            </h1>
            <p className="text-xl text-cyan-soft max-w-3xl mx-auto">
              We build websites, automate busy work, and host everything securely. Simple, straightforward, and designed for real businesses.
            </p>
          </div>
        </div>
        <ServicePackages />
        <CaseStudies />
        <InteractiveDemo />
      </div>
    </Layout>
  );
};

export default Services;