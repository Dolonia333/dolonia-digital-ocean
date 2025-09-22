import React from 'react';
import { Cloud, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import doloniaLogo from '@/assets/dolonia-logo.png';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ocean-deep border-t border-ocean-surface py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src={doloniaLogo} 
                alt="Dolonia Logo" 
                className="w-10 h-10"
              />
            </div>
            <p className="text-cyan-soft leading-relaxed mb-6 max-w-md">
              Empowering the next generation of digital transformation through 
              secure, scalable, and intelligent cloud infrastructure.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="p-2 bg-ocean-surface rounded-lg text-cyan-soft hover:text-cyan-bright hover:bg-ocean-mid transition-all duration-300"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="#" 
                className="p-2 bg-ocean-surface rounded-lg text-cyan-soft hover:text-cyan-bright hover:bg-ocean-mid transition-all duration-300"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="#" 
                className="p-2 bg-ocean-surface rounded-lg text-cyan-soft hover:text-cyan-bright hover:bg-ocean-mid transition-all duration-300"
              >
                <Github size={20} />
              </a>
              <a 
                href="#" 
                className="p-2 bg-ocean-surface rounded-lg text-cyan-soft hover:text-cyan-bright hover:bg-ocean-mid transition-all duration-300"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Solutions</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-cyan-soft hover:text-cyan-bright transition-colors">
                  Cloud Infrastructure
                </a>
              </li>
              <li>
                <a href="#" className="text-cyan-soft hover:text-cyan-bright transition-colors">
                  Data Analytics
                </a>
              </li>
              <li>
                <a href="#" className="text-cyan-soft hover:text-cyan-bright transition-colors">
                  Security Suite
                </a>
              </li>
              <li>
                <a href="#" className="text-cyan-soft hover:text-cyan-bright transition-colors">
                  Edge Computing
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-cyan-soft hover:text-cyan-bright transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-cyan-soft hover:text-cyan-bright transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-cyan-soft hover:text-cyan-bright transition-colors">
                  Partners
                </a>
              </li>
              <li>
                <a href="#" className="text-cyan-soft hover:text-cyan-bright transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-ocean-surface flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-cyan-soft text-sm">
            © {currentYear} Dolonia.cloud. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-cyan-soft hover:text-cyan-bright transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-cyan-soft hover:text-cyan-bright transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-cyan-soft hover:text-cyan-bright transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;