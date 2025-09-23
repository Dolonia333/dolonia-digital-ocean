import React, { useRef, useEffect, useState } from 'react';

const BinaryRain: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile for performance optimization
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Reduce particle count on mobile for better performance
    const maxParticles = isMobile ? 25 : 50;
    const creationInterval = isMobile ? 300 : 150;

    const createBinaryDigit = () => {
      // Limit total particles for performance
      if (container.children.length >= maxParticles) return;

      const digit = document.createElement('div');
      digit.className = 'binary-digit';
      digit.textContent = Math.random() > 0.5 ? '1' : '0';
      
      // Random position across the width
      digit.style.left = Math.random() * 100 + '%';
      
      // Smaller size on mobile to reduce render load
      const size = isMobile 
        ? Math.random() * 12 + 10 
        : Math.random() * 20 + 12;
      digit.style.fontSize = size + 'px';
      
      // Faster animation on mobile to compensate for fewer particles
      const duration = isMobile 
        ? Math.random() * 2 + 1.5 
        : Math.random() * 3 + 2;
      digit.style.animationDuration = duration + 's';
      
      // Random delay before starting
      const delay = Math.random() * (isMobile ? 1 : 2);
      digit.style.animationDelay = delay + 's';
      
      container.appendChild(digit);
      
      // Remove digit after animation completes
      setTimeout(() => {
        if (container.contains(digit)) {
          container.removeChild(digit);
        }
      }, (duration + delay) * 1000);
    };

    // Create initial digits with reduced count on mobile
    const initialCount = isMobile ? 15 : 30;
    for (let i = 0; i < initialCount; i++) {
      setTimeout(() => createBinaryDigit(), Math.random() * 1000);
    }

    // Continuously create new digits with adjusted interval
    const interval = setInterval(() => {
      createBinaryDigit();
    }, creationInterval);

    return () => {
      clearInterval(interval);
      // Clean up any remaining digits
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, [isMobile]);

  return <div ref={containerRef} className="binary-rain" />;
};

export default BinaryRain;