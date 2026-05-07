import type { Config } from 'tailwindcss';
const { nextui } = require('@nextui-org/react');

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#F36F36',
          50: '#FFF4EE',
          100: '#FFE3D2',
          200: '#FFC09E',
          300: '#FF9C6A',
          400: '#FF8550',
          500: '#F36F36',
          600: '#D85A24',
          700: '#A8431A',
          800: '#7A2F12',
          900: '#4D1D0A',
        },
        ink: {
          DEFAULT: '#111111',
          muted: '#6B7280',
          subtle: '#9CA3AF',
        },
        canvas: {
          DEFAULT: '#F5F5F2',
          surface: '#FFFFFF',
        },
        outline: {
          DEFAULT: '#D1D5DB',
          subtle: '#E5E7EB',
        },
        carbon: {
          DEFAULT: '#0A0A0A',
          surface: '#111111',
          elevated: '#161616',
          border: '#1F1F1F',
          text: '#F9FAFB',
          muted: '#9CA3AF',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Inter', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        display: ['72px', { lineHeight: '1.0', letterSpacing: '-0.04em' }],
        'display-md': [
          '56px',
          { lineHeight: '1.05', letterSpacing: '-0.035em' },
        ],
        'display-sm': ['40px', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        h1: ['48px', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        h2: ['32px', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        h3: ['22px', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.03em',
        wider: '0.08em',
        widest: '0.18em',
      },
      borderRadius: {
        button: '8px',
        card: '12px',
        container: '16px',
      },
      boxShadow: {
        card: '0 0 0 1px rgba(0,0,0,0.06)',
        elevated: '0 8px 24px rgba(0,0,0,0.06)',
      },
      maxWidth: {
        content: '1280px',
        prose: '720px',
      },
      backgroundImage: {
        'grid-light':
          'linear-gradient(to right, rgba(17,17,17,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(17,17,17,0.04) 1px, transparent 1px)',
        'grid-dark':
          'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), nextui()],
  darkMode: 'class',
};
export default config;
