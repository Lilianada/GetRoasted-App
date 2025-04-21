import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        geist: ['"Geist Mono"', 'monospace'],
      },
      colors: {
        black: '#000',
        white: '#fff',
        yellow: {
          DEFAULT: '#F8C537',
        },
        purple: {
          DEFAULT: '#C5B4F0',
        },
        blue: {
          DEFAULT: '#A6C7F7',
        },
        pink: {
          DEFAULT: '#FFB3B3',
        },
        orange: {
          DEFAULT: '#FF6B35',
        },
        coral: {
          DEFAULT: '#FF3366',
        },
        primary: {
          DEFAULT: '#F8C537',
          foreground: '#000',
        },
        secondary: {
          DEFAULT: '#C5B4F0',
          foreground: '#000',
        },
        accent: {
          DEFAULT: '#A6C7F7',
          foreground: '#000',
        },
        destructive: {
          DEFAULT: '#FF3366',
          foreground: '#fff',
        },
        warning: {
          DEFAULT: '#FF6B35',
          foreground: '#000',
        },
        card: {
          DEFAULT: '#fff',
          foreground: '#000',
        },
        border: '#000',
        background: '#fff',
        foreground: '#000',
        night: {
          DEFAULT: '#181B23',  // Updated darker navy blue
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#8E9196',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#212529',
          900: '#181B23',  // Updated to match DEFAULT
        },
        flame: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#FF6B35',  // Signature flame orange
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        ember: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#FF3366',  // Vibrant coral pink
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        glow: {
          DEFAULT: '#7B61FF',  // Bright purple
          lighter: '#9B87F5'
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        'flame-pulse': {
          '0%, 100%': { 
            opacity: '1',
            filter: 'brightness(1)' 
          },
          '50%': { 
            opacity: '0.85',
            filter: 'brightness(1.2)' 
          },
        },
        'background-shine': {
          from: { backgroundPosition: '200% 0' },
          to: { backgroundPosition: '0 0' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'skew': {
          '0%, 100%': { transform: 'skewX(0)' },
          '50%': { transform: 'skewX(-2deg)' },
        },
        'pop': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '70%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'flame-pulse': 'flame-pulse 3s ease-in-out infinite',
        'background-shine': 'background-shine 8s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'skew': 'skew 4s ease-in-out infinite',
        'pop': 'pop 0.3s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out'
      },
      backgroundImage: {
        'gradient-orange': 'linear-gradient(90deg, hsla(29, 92%, 70%, 1) 0%, hsla(0, 87%, 73%, 1) 100%)',
        'gradient-flame': 'linear-gradient(90deg, hsla(22, 100%, 78%, 1) 0%, hsla(2, 78%, 62%, 1) 100%)',
        'gradient-ember': 'linear-gradient(90deg, hsla(24, 100%, 83%, 1) 0%, hsla(341, 91%, 68%, 1) 100%)',
        'gradient-shine': 'linear-gradient(110deg, transparent 25%, rgba(255, 255, 255, 0.1) 50%, transparent 75%)',
        'gradient-radial': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
        'grid-pattern': 'linear-gradient(to right, black 1px, transparent 1px), linear-gradient(to bottom, black 1px, transparent 1px)',
      },
      boxShadow: {
        'neo': '4px 4px 0px 0px rgba(0,0,0,1)',
        'neo-hover': '6px 6px 0px 0px rgba(0,0,0,1)',
        'neo-lg': '8px 8px 0px 0px rgba(0,0,0,1)',
      }
    }
  },
};