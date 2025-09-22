import React, { useEffect, useRef } from 'react';

const BinaryRain: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createBinaryDigit = () => {
      const digit = document.createElement('div');
      digit.className = 'binary-digit';
      digit.textContent = Math.random() > 0.5 ? '1' : '0';
      
      // Random position across the width
      digit.style.left = Math.random() * 100 + '%';
      
      // Random size
      const size = Math.random() * 20 + 12;
      digit.style.fontSize = size + 'px';
      
      // Random animation duration (speed)
      const duration = Math.random() * 3 + 2;
      digit.style.animationDuration = duration + 's';
      
      // Random delay before starting
      const delay = Math.random() * 2;
      digit.style.animationDelay = delay + 's';
      
      container.appendChild(digit);
      
      // Remove digit after animation completes
      setTimeout(() => {
        if (container.contains(digit)) {
          container.removeChild(digit);
        }
      }, (duration + delay) * 1000);
    };

    // Create initial digits
    for (let i = 0; i < 50; i++) {
      setTimeout(() => createBinaryDigit(), Math.random() * 2000);
    }

    // Continuously create new digits
    const interval = setInterval(() => {
      createBinaryDigit();
    }, 150);

    return () => {
      clearInterval(interval);
      // Clean up any remaining digits
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, []);

  return <div ref={containerRef} className="binary-rain" />;
};

export default BinaryRain;