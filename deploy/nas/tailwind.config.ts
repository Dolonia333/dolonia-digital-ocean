import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    screens: {
      xs: '375px', // Small phones (iPhone SE, Galaxy S)
      sm: '640px', // Large phones (iPhone Pro, Galaxy)
      md: '768px', // Tablets (iPad, Android tablets)
      lg: '1024px', // Small laptops
      xl: '1280px', // Desktops
      '2xl': '1536px', // Large desktops
    },
    extend: {
      maxWidth: {
        screen: '100vw', // Prevent overflow
        full: '100%', // Contain within parent
      },
      width: {
        'screen-safe': '100vw', // Full viewport width
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Ocean theme colors
        ocean: {
          deep: 'hsl(var(--ocean-deep))',
          mid: 'hsl(var(--ocean-mid))',
          surface: 'hsl(var(--ocean-surface))',
        },
        cyan: {
          bright: 'hsl(var(--cyan-bright))',
          glow: 'hsl(var(--cyan-glow))',
          soft: 'hsl(var(--cyan-soft))',
        },
      },
      backgroundImage: {
        'gradient-ocean': 'var(--gradient-ocean)',
        'gradient-cyber': 'var(--gradient-cyber)',
        'gradient-surface': 'var(--gradient-surface)',
      },
      boxShadow: {
        cyber: 'var(--shadow-cyber)',
        glow: 'var(--shadow-glow)',
        deep: 'var(--shadow-deep)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
        fall: 'fall linear infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      transitionTimingFunction: {
        smooth: 'var(--transition-smooth)',
        bounce: 'var(--transition-bounce)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config
