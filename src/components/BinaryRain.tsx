import React, { useRef, useEffect, useState, useCallback } from "react";

interface BinaryRainProps {
  isActive?: boolean;
}

const BinaryRain: React.FC<BinaryRainProps> = ({ isActive = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [performanceMode, setPerformanceMode] = useState<
    "high" | "medium" | "low"
  >("high");
  const frameTimeRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef<number>(performance.now());
  const isInitializedRef = useRef<boolean>(false);

  // Performance monitoring to adjust animation quality
  const monitorPerformance = useCallback(() => {
    const now = performance.now();
    const frameTime = now - lastFrameTimeRef.current;
    lastFrameTimeRef.current = now;

    frameTimeRef.current.push(frameTime);
    if (frameTimeRef.current.length > 120) { // Increased from 60 to 120 for more stable readings
      // Monitor last 120 frames
      frameTimeRef.current.shift();
    }

    if (frameTimeRef.current.length >= 30) { // Increased from 10 to 30 for more stable average
      const avgFrameTime =
        frameTimeRef.current.reduce((a, b) => a + b) /
        frameTimeRef.current.length;
      const fps = 1000 / avgFrameTime;

      // Adjust quality based on FPS - less aggressive switching
      let newMode: "high" | "medium" | "low" = performanceMode;
      if (fps < 25) { // Lower threshold from 30
        newMode = "low";
      } else if (fps < 40) { // Lower threshold from 45
        newMode = "medium";
      } else if (fps > 50) { // Higher threshold to return to high
        newMode = "high";
      }

      // Only change mode if it's significantly different to prevent frequent switching
      if (newMode !== performanceMode) {
        setPerformanceMode(newMode);
      }
    }

    requestAnimationFrame(monitorPerformance);
  }, [performanceMode]);

  useEffect(() => {
    // Start performance monitoring
    requestAnimationFrame(monitorPerformance);
  }, [monitorPerformance]);

  useEffect(() => {
    // Check if device is mobile for performance optimization
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Dynamic settings based on performance mode - much slower mobile experience
  const getSettings = useCallback(() => {
    if (isMobile) {
      switch (performanceMode) {
        case "low":
          return { maxParticles: 30, interval: 180, duration: [8.0, 12.0] }; // Very slow mobile
        case "medium":
          return { maxParticles: 40, interval: 160, duration: [7.0, 10.0] }; // Slow mobile flow
        default:
          return { maxParticles: 50, interval: 140, duration: [6.0, 8.0] }; // Significantly slower mobile
      }
    } else {
      switch (performanceMode) {
        case "low":
          return { maxParticles: 70, interval: 70, duration: [4.0, 5.5] }; // Slower desktop
        case "medium":
          return { maxParticles: 100, interval: 55, duration: [3.5, 5.0] }; // Smooth desktop flow
        default:
          return { maxParticles: 130, interval: 35, duration: [3.0, 4.5] }; // Smooth consistent desktop flow
      }
    }
  }, [isMobile, performanceMode]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isActive) return;

    // Check if we already have an active rain system
    const hasExistingRain = container.children.length > 0;

    // Only reset if this is the first initialization or if isActive changed from false to true
    const shouldReset = !isInitializedRef.current || !hasExistingRain;
    if (!shouldReset) return;

    isInitializedRef.current = true;

    const settings = getSettings();

    // Track spawn positions for more even distribution
    let lastSpawnPosition = 0;
    const spawnZones = 10; // Divide screen into zones for even distribution

    const rainPatterns = [
      "fall", // Standard straight down
      "matrix", // Classic Matrix-style columns
      "wave", // Wavy side-to-side motion
      "spiral", // Spiral descent
      "glitch", // Glitchy teleportation effect
      "cascade", // Cascading waterfall effect
    ];

    const createBinaryDigit = () => {
      // Limit total particles for performance
      if (container.children.length >= settings.maxParticles) return;

      const digit = document.createElement("div");

      // Choose random pattern (weighted towards standard fall)
      const patternWeights = [0.4, 0.2, 0.15, 0.1, 0.1, 0.05];
      const rand = Math.random();
      let pattern = "fall";
      let weightSum = 0;

      for (let i = 0; i < rainPatterns.length; i++) {
        weightSum += patternWeights[i];
        if (rand <= weightSum) {
          pattern = rainPatterns[i];
          break;
        }
      }

      digit.className = `binary-digit pattern-${pattern}`;

      // Generate content based on pattern
      const createMorphingContent = (pattern: string) => {
        const characterSets = {
          matrix: ["0", "1", "ｱ", "ｲ", "ｳ", "ｴ", "ｵ", "ｶ", "ｷ"],
          glitch: ["█", "▓", "▒", "░", "1", "0", "?", "#"],
          standard: ["1", "0"],
        };

        let chars: string[];
        if (pattern === "matrix") {
          chars = characterSets.matrix;
        } else if (pattern === "glitch") {
          chars = characterSets.glitch;
        } else {
          chars = characterSets.standard;
        }

        // Set initial character
        const initialChar = chars[Math.floor(Math.random() * chars.length)];
        digit.textContent = initialChar;

        // Add morphing animation - character changes during fall
        const morphInterval = setInterval(() => {
          if (digit.parentNode) {
            const newChar = chars[Math.floor(Math.random() * chars.length)];
            digit.textContent = newChar;
          } else {
            clearInterval(morphInterval);
          }
        }, Math.random() * 500 + 300); // Change character every 300-800ms

        return morphInterval;
      };

      if (pattern === "matrix") {
        createMorphingContent("matrix");
      } else if (pattern === "glitch") {
        createMorphingContent("glitch");
      } else {
        createMorphingContent("standard");
      }

      // Improved position distribution for even coverage
      let leftPosition;
      if (Math.random() < 0.7) {
        // 70% of the time, use zone-based distribution for even coverage
        const zoneWidth = 100 / spawnZones;
        const currentZone = lastSpawnPosition % spawnZones;
        leftPosition = currentZone * zoneWidth + Math.random() * zoneWidth;
        lastSpawnPosition++;
      } else {
        // 30% of the time, use random position for natural variation
        leftPosition = Math.random() * 100;
      }

      digit.style.left = leftPosition + "%"; // Pattern-specific sizing
      const size = (() => {
        const baseSize = isMobile ? [8, 16] : [10, 20];
        switch (pattern) {
          case "matrix":
            return (
              Math.random() * (baseSize[1] - baseSize[0]) + baseSize[0] + 2
            );
          case "glitch":
            return (
              Math.random() * (baseSize[1] - baseSize[0]) + baseSize[0] + 4
            );
          default:
            return Math.random() * (baseSize[1] - baseSize[0]) + baseSize[0];
        }
      })();
      digit.style.fontSize = size + "px";

      // Pattern-specific duration (more consistent timing)
      const [minDuration, maxDuration] = settings.duration;
      let duration = Math.random() * (maxDuration - minDuration) + minDuration;

      // Reduce duration variance for more consistent flow
      switch (pattern) {
        case "wave":
        case "spiral":
          duration *= 1.1; // Slightly slower for complex paths
          break;
        case "glitch":
          duration *= 0.9; // Slightly faster for glitch effect
          break;
        default:
          duration *= 1.0; // Standard timing
      }

      digit.style.animationDuration = duration + "s";

      // Longer delay for slower mobile experience
      const delay = isMobile ? Math.random() * 0.5 : Math.random() * 0.2; // Longer delay on mobile for slower effect
      digit.style.animationDelay = delay + "s";

      // Add hardware acceleration for smoother animation
      digit.style.transform = "translateZ(0)";
      digit.style.willChange = "transform, opacity";

      // Pattern-specific colors
      switch (pattern) {
        case "matrix":
          digit.style.color = "hsl(120, 100%, 50%)"; // Green Matrix style
          digit.style.textShadow = "0 0 10px hsl(120, 100%, 50%)";
          break;
        case "glitch": {
          const glitchColors = ["#ff0080", "#00ff80", "#8000ff"];
          const color =
            glitchColors[Math.floor(Math.random() * glitchColors.length)];
          digit.style.color = color;
          digit.style.textShadow = `0 0 15px ${color}`;
          break;
        }
        case "cascade":
          digit.style.color = "hsl(200, 100%, 70%)"; // Ocean blue
          digit.style.textShadow = "0 0 10px hsl(200, 100%, 70%)";
          break;
      }

      container.appendChild(digit);

      // Remove digit after animation completes
      setTimeout(() => {
        if (container.contains(digit)) {
          container.removeChild(digit);
        }
      }, (duration + delay) * 1000);
    };

    // Create initial digits with much faster spacing for immediate flow
    const initialCount = isMobile ? 25 : 100;
    for (let i = 0; i < initialCount; i++) {
      setTimeout(() => createBinaryDigit(), i * (isMobile ? 20 : 8)); // Much faster initial spacing
    }

    // Continuously create new digits with very consistent interval
    const interval = setInterval(() => {
      if (container.children.length < settings.maxParticles) {
        createBinaryDigit();
      }
    }, settings.interval);

    return () => {
      clearInterval(interval);
      // Clean up any remaining digits
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, [isActive, isMobile, performanceMode, getSettings]); // Include all dependencies to fix lint error

  return <div ref={containerRef} className="binary-rain" />;
};

export default BinaryRain;
