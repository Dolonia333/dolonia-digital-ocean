import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ArrowRight, Cloud, Shield, Zap, X } from 'lucide-react';
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, benefits }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(true);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(false);
  };

  return (
    <>
      <div 
        className="flex items-center justify-center space-x-3 bg-ocean-surface/30 backdrop-blur-sm rounded-lg p-4 border border-ocean-surface cursor-pointer hover:bg-ocean-surface/50 transition-all duration-300"
        onClick={handleClick}
      >
        {icon}
        <span className="text-cyan-soft font-medium">{title}</span>
      </div>

      {/* Expanded Modal */}
      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="bg-ocean-surface/95 border-ocean-surface backdrop-blur-md z-[9999]">
          <DialogHeader>
            <div className="flex items-center space-x-3">
              {icon}
              <DialogTitle className="text-foreground">{title}</DialogTitle>
            </div>
            <DialogDescription className="text-cyan-soft">
              {description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <h4 className="font-semibold text-cyan-bright">Key Benefits:</h4>
            <ul className="space-y-1">
              {benefits.map((benefit, index) => (
                <li key={index} className="text-cyan-soft text-sm flex items-center">
                  <div className="w-1.5 h-1.5 bg-cyan-bright rounded-full mr-2" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const HeroSection: React.FC = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-ocean opacity-80" />
      
      {/* Content */}
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-ocean-surface/50 backdrop-blur-sm border border-cyan-bright/30 rounded-full px-4 py-2 mb-8">
            <Zap size={16} className="text-cyan-bright" />
            <span className="text-cyan-soft text-sm font-medium">Next-Generation Cloud Infrastructure</span>
          </div>

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <img 
                src="/src/assets/dolonia-logo.png" 
                alt="Dolonia Logo" 
                className="w-48 h-48 md:w-72 md:h-72 lg:w-96 lg:h-96 transition-all duration-100"
              />
              {/* Dramatic glitch effect overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
                <img 
                  src="/src/assets/dolonia-logo.png" 
                  alt="" 
                  className="w-48 h-48 md:w-72 md:h-72 lg:w-96 lg:h-96 absolute inset-0 mix-blend-multiply animate-ping"
                  style={{ 
                    filter: 'hue-rotate(180deg) contrast(300%) saturate(200%)',
                    transform: 'translate(-8px, -2px) scale(1.05)',
                    animationDuration: '0.3s'
                  }}
                />
                <img 
                  src="/src/assets/dolonia-logo.png" 
                  alt="" 
                  className="w-48 h-48 md:w-72 md:h-72 lg:w-96 lg:h-96 absolute inset-0 mix-blend-multiply animate-ping"
                  style={{ 
                    filter: 'hue-rotate(90deg) contrast(300%) saturate(200%)',
                    transform: 'translate(8px, 2px) scale(0.95)',
                    animationDuration: '0.4s',
                    animationDelay: '0.1s'
                  }}
                />
                <img 
                  src="/src/assets/dolonia-logo.png" 
                  alt="" 
                  className="w-48 h-48 md:w-72 md:h-72 lg:w-96 lg:h-96 absolute inset-0 mix-blend-multiply animate-ping"
                  style={{ 
                    filter: 'hue-rotate(270deg) contrast(300%) saturate(200%)',
                    transform: 'translate(-4px, 6px) scale(1.02)',
                    animationDuration: '0.2s',
                    animationDelay: '0.2s'
                  }}
                />
              </div>
            </div>
          </div>


          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <FeatureCard
              icon={<Cloud className="text-cyan-bright h-6 w-6" />}
              title="Multi-Cloud"
              description="Deploy seamlessly across AWS, Azure, and Google Cloud with unified management and automatic failover capabilities."
              benefits={["Vendor lock-in prevention", "Global redundancy", "Cost optimization"]}
            />
            <FeatureCard
              icon={<Shield className="text-cyan-bright h-6 w-6" />}
              title="Zero-Trust Security"
              description="Advanced security model that verifies every user and device before granting access, ensuring maximum protection."
              benefits={["Enhanced data protection", "Compliance ready", "Threat prevention"]}
            />
            <FeatureCard
              icon={<Zap className="text-cyan-bright h-6 w-6" />}
              title="AI-Powered"
              description="Intelligent automation that optimizes performance, predicts issues, and reduces operational costs automatically."
              benefits={["Predictive analytics", "Automated scaling", "Cost reduction"]}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;