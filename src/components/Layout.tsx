import React from 'react';
import BinaryRain from '@/components/BinaryRain';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
  showFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showNavigation = true, 
  showFooter = true 
}) => {
  return (
    <div className="min-h-screen bg-gradient-ocean text-foreground">
      {/* Background */}
      <BinaryRain />
      
      {/* Navigation */}
      {showNavigation && <Navigation />}
      
      {/* Main content with page transition */}
      <PageTransition>
        <main className="relative z-10">
          {children}
        </main>
      </PageTransition>
      
      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;