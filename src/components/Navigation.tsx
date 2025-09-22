import React from 'react';
import { Button } from '@/components/ui/button';

const Navigation: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-ocean-deep/80 backdrop-blur-md border-b border-ocean-surface">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src="/src/assets/dolonia-logo.png" 
              alt="Dolonia Logo" 
              className="w-10 h-10"
            />
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#services" 
              className="text-cyan-soft hover:text-cyan-bright transition-colors duration-300 font-medium"
            >
              Services
            </a>
            <a 
              href="#solutions" 
              className="text-cyan-soft hover:text-cyan-bright transition-colors duration-300 font-medium"
            >
              Solutions
            </a>
            <a 
              href="#security" 
              className="text-cyan-soft hover:text-cyan-bright transition-colors duration-300 font-medium"
            >
              Security
            </a>
            <a 
              href="#about" 
              className="text-cyan-soft hover:text-cyan-bright transition-colors duration-300 font-medium"
            >
              About
            </a>
          </div>

          {/* CTA Button */}
          <Button 
            variant="outline" 
            className="bg-transparent border-cyan-bright text-cyan-bright hover:bg-cyan-bright hover:text-ocean-deep cyber-glow transition-all duration-300"
          >
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;