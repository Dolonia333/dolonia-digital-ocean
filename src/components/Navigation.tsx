import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import doloniaLogo from '@/assets/dolonia-logo.png';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-ocean-deep/80 backdrop-blur-md border-b border-ocean-surface">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src={doloniaLogo} 
              alt="Dolonia Logo" 
              className="w-10 h-10"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/services" 
              className="text-cyan-soft hover:text-cyan-bright transition-colors duration-300 font-medium"
            >
              Services
            </Link>
            <Link 
              to="/solutions" 
              className="text-cyan-soft hover:text-cyan-bright transition-colors duration-300 font-medium"
            >
              Solutions
            </Link>
            <Link 
              to="/security" 
              className="text-cyan-soft hover:text-cyan-bright transition-colors duration-300 font-medium"
            >
              Security
            </Link>
            <Link 
              to="/pricing" 
              className="text-cyan-soft hover:text-cyan-bright transition-colors duration-300 font-medium"
            >
              Pricing
            </Link>
            <Link 
              to="/about" 
              className="text-cyan-soft hover:text-cyan-bright transition-colors duration-300 font-medium"
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-cyan-soft hover:text-cyan-bright transition-colors duration-300 font-medium"
            >
              Contact
            </Link>
          </div>

          {/* Desktop CTA Button */}
          <Button 
            variant="outline" 
            className="hidden md:block bg-transparent border-cyan-bright text-cyan-bright hover:bg-cyan-bright hover:text-ocean-deep cyber-glow transition-all duration-300"
          >
            Get Started
          </Button>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-cyan-soft hover:text-cyan-bright transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-ocean-deep/95 backdrop-blur-md border-b border-ocean-surface">
            <div className="container mx-auto px-6 py-4 space-y-4">
              <Link 
                to="/services" 
                className="block text-cyan-soft hover:text-cyan-bright transition-colors duration-300 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link 
                to="/solutions" 
                className="block text-cyan-soft hover:text-cyan-bright transition-colors duration-300 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Solutions
              </Link>
              <Link 
                to="/security" 
                className="block text-cyan-soft hover:text-cyan-bright transition-colors duration-300 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Security
              </Link>
              <Link 
                to="/pricing" 
                className="block text-cyan-soft hover:text-cyan-bright transition-colors duration-300 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                to="/about" 
                className="block text-cyan-soft hover:text-cyan-bright transition-colors duration-300 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="block text-cyan-soft hover:text-cyan-bright transition-colors duration-300 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Button 
                variant="outline" 
                className="w-full bg-transparent border-cyan-bright text-cyan-bright hover:bg-cyan-bright hover:text-ocean-deep cyber-glow transition-all duration-300 mt-4"
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;