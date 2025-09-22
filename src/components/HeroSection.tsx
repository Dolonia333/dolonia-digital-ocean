import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Cloud, Shield, Zap } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-ocean opacity-80" />
      
      {/* Content */}
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-ocean-surface/50 backdrop-blur-sm border border-cyan-bright/30 rounded-full px-4 py-2 mb-8 cyber-glow">
            <Zap size={16} className="text-cyan-bright" />
            <span className="text-cyan-soft text-sm font-medium">Next-Generation Cloud Infrastructure</span>
          </div>

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src="/src/assets/dolonia-logo.png" 
              alt="Dolonia Logo" 
              className="w-48 h-48 md:w-72 md:h-72 lg:w-96 lg:h-96"
            />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg"
              className="bg-gradient-cyber hover:shadow-glow text-ocean-deep font-semibold px-8 py-4 text-lg transition-all duration-300 group"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="bg-transparent border-cyan-bright text-cyan-bright hover:bg-cyan-bright hover:text-ocean-deep cyber-glow px-8 py-4 text-lg transition-all duration-300"
            >
              Watch Demo
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-3 bg-ocean-surface/30 backdrop-blur-sm rounded-lg p-4 border border-ocean-surface floating">
              <Cloud className="text-cyan-bright h-6 w-6" />
              <span className="text-cyan-soft font-medium">Multi-Cloud</span>
            </div>
            <div className="flex items-center justify-center space-x-3 bg-ocean-surface/30 backdrop-blur-sm rounded-lg p-4 border border-ocean-surface floating-slow">
              <Shield className="text-cyan-bright h-6 w-6" />
              <span className="text-cyan-soft font-medium">Zero-Trust Security</span>
            </div>
            <div className="flex items-center justify-center space-x-3 bg-ocean-surface/30 backdrop-blur-sm rounded-lg p-4 border border-ocean-surface floating">
              <Zap className="text-cyan-bright h-6 w-6" />
              <span className="text-cyan-soft font-medium">AI-Powered</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;