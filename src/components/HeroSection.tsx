import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Cloud, Shield, Zap, X } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, benefits }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div 
        className="flex items-center justify-center space-x-3 bg-ocean-surface/30 backdrop-blur-sm rounded-lg p-4 border border-ocean-surface floating cursor-pointer hover:bg-ocean-surface/50 transition-all duration-300"
        onClick={() => setIsExpanded(true)}
      >
        {icon}
        <span className="text-cyan-soft font-medium">{title}</span>
      </div>

      {/* Expanded Modal */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 bg-ocean-deep/80 backdrop-blur-sm flex items-center justify-center p-6">
          <Card className="w-full max-w-md bg-ocean-surface/95 backdrop-blur-md border-ocean-surface shadow-2xl animate-scale-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {icon}
                  <h3 className="text-xl font-bold text-foreground">{title}</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                  className="text-cyan-soft hover:text-cyan-bright"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <p className="text-cyan-soft mb-4">{description}</p>
              
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
            </CardContent>
          </Card>
        </div>
      )}
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