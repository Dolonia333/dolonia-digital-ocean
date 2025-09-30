/**
 * WordPress-integrated Binary Rain Component
 * Reads settings from WordPress customizer
 */

// Ensure WordPress data is available
const wpSettings = window.doloniaWP?.settings?.binaryRain || {};

class WordPressBinaryRain {
    constructor(container) {
        this.container = container;
        this.isActive = wpSettings.enabled !== false;
        this.performanceMode = wpSettings.performance || 'high';
        this.activePatterns = this.parsePatterns(wpSettings.patterns);
        this.colorScheme = wpSettings.colors || 'default';
        
        if (this.isActive) {
            this.init();
        }
    }

    parsePatterns(patterns) {
        if (typeof patterns === 'string') {
            return patterns.split(',').map(p => p.trim());
        }
        return patterns || ['fall', 'matrix', 'wave', 'spiral', 'glitch', 'cascade'];
    }

    getSettings() {
        const isMobile = window.innerWidth < 768;
        
        if (isMobile) {
            switch (this.performanceMode) {
                case 'low': return { maxParticles: 25, interval: 100, duration: [2.0, 3.0] };
                case 'medium': return { maxParticles: 40, interval: 80, duration: [2.0, 3.0] };
                default: return { maxParticles: 55, interval: 60, duration: [2.0, 3.0] };
            }
        } else {
            switch (this.performanceMode) {
                case 'low': return { maxParticles: 50, interval: 100, duration: [2.5, 3.5] };
                case 'medium': return { maxParticles: 80, interval: 80, duration: [2.5, 3.5] };
                default: return { maxParticles: 120, interval: 50, duration: [2.5, 3.5] };
            }
        }
    }

    getColorForPattern(pattern) {
        switch (this.colorScheme) {
            case 'matrix':
                return '#00ff00';
            case 'cyber_blue':
                return '#00aaff';
            case 'neon_pink':
                return '#ff0088';
            case 'monochrome':
                return '#ffffff';
            default:
                // Use pattern-specific colors
                switch (pattern) {
                    case 'matrix': return '#00ff00';
                    case 'glitch': return '#ff0080';
                    case 'cascade': return '#0088ff';
                    case 'wave': return '#00aaff';
                    case 'spiral': return '#ff00ff';
                    default: return '#00ff88';
                }
        }
    }

    createBinaryDigit() {
        const settings = this.getSettings();
        
        if (this.container.children.length >= settings.maxParticles) return;

        const digit = document.createElement('div');
        digit.className = 'binary-digit';

        // Choose pattern from active patterns
        const pattern = this.activePatterns[Math.floor(Math.random() * this.activePatterns.length)];
        digit.classList.add(`pattern-${pattern}`);

        // Set character based on pattern
        const characterSets = {
            matrix: ['0', '1', 'ｱ', 'ｲ', 'ｳ', 'ｴ', 'ｵ', 'ｶ', 'ｷ'],
            glitch: ['█', '▓', '▒', '░', '1', '0', '?', '#'],
            standard: ['1', '0']
        };

        let chars = characterSets.standard;
        if (pattern === 'matrix') chars = characterSets.matrix;
        else if (pattern === 'glitch') chars = characterSets.glitch;

        digit.textContent = chars[Math.floor(Math.random() * chars.length)];

        // Position and styling
        digit.style.left = Math.random() * 100 + '%';
        digit.style.fontSize = (Math.random() * 10 + 10) + 'px';
        digit.style.color = this.getColorForPattern(pattern);
        
        // Animation duration
        const [minDuration, maxDuration] = settings.duration;
        const duration = Math.random() * (maxDuration - minDuration) + minDuration;
        digit.style.animationDuration = duration + 's';
        digit.style.animationDelay = Math.random() * 0.2 + 's';

        // Hardware acceleration
        digit.style.transform = 'translateZ(0)';
        digit.style.willChange = 'transform, opacity';

        this.container.appendChild(digit);

        // Character morphing
        const morphInterval = setInterval(() => {
            if (digit.parentNode) {
                digit.textContent = chars[Math.floor(Math.random() * chars.length)];
            } else {
                clearInterval(morphInterval);
            }
        }, Math.random() * 500 + 300);

        // Remove after animation
        setTimeout(() => {
            if (this.container.contains(digit)) {
                this.container.removeChild(digit);
            }
        }, (duration + 0.2) * 1000);
    }

    init() {
        const settings = this.getSettings();

        // Initial burst
        const initialCount = window.innerWidth < 768 ? 30 : 60;
        for (let i = 0; i < initialCount; i++) {
            setTimeout(() => this.createBinaryDigit(), i * 25);
        }

        // Continuous generation
        this.mainInterval = setInterval(() => {
            this.createBinaryDigit();
        }, settings.interval);

        // Burst generation for density
        this.burstInterval = setInterval(() => {
            const burstCount = Math.floor(Math.random() * 2) + 2;
            for (let i = 0; i < burstCount; i++) {
                setTimeout(() => this.createBinaryDigit(), i * 15);
            }
        }, 500);
    }

    destroy() {
        if (this.mainInterval) clearInterval(this.mainInterval);
        if (this.burstInterval) clearInterval(this.burstInterval);
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
    }

    // WordPress admin integration
    updateSettings(newSettings) {
        Object.assign(wpSettings, newSettings);
        this.performanceMode = wpSettings.performance || 'high';
        this.activePatterns = this.parsePatterns(wpSettings.patterns);
        this.colorScheme = wpSettings.colors || 'default';
        
        // Restart with new settings
        this.destroy();
        if (wpSettings.enabled !== false) {
            this.init();
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('binary-rain-container');
    if (container) {
        window.doloniaBinaryRain = new WordPressBinaryRain(container);
    }
});

// WordPress Customizer live preview
if (window.wp && window.wp.customize) {
    wp.customize('dolonia_binary_rain_enabled', function(value) {
        value.bind(function(newval) {
            if (window.doloniaBinaryRain) {
                window.doloniaBinaryRain.updateSettings({ enabled: newval });
            }
        });
    });

    wp.customize('dolonia_binary_rain_performance', function(value) {
        value.bind(function(newval) {
            if (window.doloniaBinaryRain) {
                window.doloniaBinaryRain.updateSettings({ performance: newval });
            }
        });
    });

    wp.customize('dolonia_binary_rain_patterns', function(value) {
        value.bind(function(newval) {
            if (window.doloniaBinaryRain) {
                window.doloniaBinaryRain.updateSettings({ patterns: newval });
            }
        });
    });
}