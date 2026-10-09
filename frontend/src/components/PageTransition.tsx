import React, { useEffect, useState } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div 
      className={`transition-opacity duration-300 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {children}
    </div>
  );
};

export default PageTransition;