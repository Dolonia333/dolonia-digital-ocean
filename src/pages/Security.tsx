import React from 'react';
import BinaryRain from '@/components/BinaryRain';
import Navigation from '@/components/Navigation';
import SecuritySection from '@/components/SecuritySection';
import Footer from '@/components/Footer';

const Security = () => {
  return (
    <div className="min-h-screen bg-gradient-ocean text-foreground">
      <BinaryRain />
      <Navigation />
      
      <main className="relative z-10 pt-20">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-cyber bg-clip-text text-transparent">Security First</span>
            </h1>
            <p className="text-xl text-cyan-soft max-w-3xl mx-auto">
              Enterprise-grade security that protects your data, applications, and infrastructure with military-grade encryption.
            </p>
          </div>
        </div>
        <SecuritySection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Security;