/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Clash Display', 'sans-serif'],
        body: ['Satoshi', 'sans-serif'],
      },
      colors: {
        nox: {
          pink: '#FF2D78',
          purple: '#8B2FC9',
          cyan: '#00F5FF',
          orange: '#FF6B00',
          yellow: '#FFE600',
          dark: '#0A0A0F',
          card: '#12121A',
        },
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255,45,120,0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(255,45,120,0.8)' },
        },
      },
    },
  },
  plugins: [],
};
