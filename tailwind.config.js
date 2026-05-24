/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'cr-blue': { DEFAULT: '#1A3A5C', light: '#2C5F8A', dark: '#0F2640' },
        'cr-red': { DEFAULT: '#E53935', light: '#FF6B35', dark: '#B71C1C' },
        'cr-gold': { DEFAULT: '#FFD700', soft: '#FFC107', light: '#FFE082' },
        'cr-green': { DEFAULT: '#4CAF50', dark: '#2E7D32' },
        'cr-purple': { DEFAULT: '#7B1FA2', light: '#9C27B0' },
        'cr-orange': { DEFAULT: '#FF6B35', soft: '#FF8A50' },
        'cr-stone': { DEFAULT: '#5D4037', light: '#8D6E63' },
        'cr-wood': { DEFAULT: '#3E2723', light: '#5D4037' },
        'cr-sky': { DEFAULT: '#0A1628', light: '#162447' },
        'cr-cream': '#FFF8E1',
        'cr-epic': '#7B1FA2',
        'cr-legendary': '#FFD700',
        'cr-champion': '#E53935',
      },
      fontFamily: {
        display: ['Bungee', 'Impact', 'sans-serif'],
        body: ['Poppins', 'sans-serif'],
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'bounce-in': 'bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'slide-up': 'slide-up 0.4s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        wiggle: 'wiggle 0.5s ease-in-out',
        shimmer: 'shimmer 2s infinite',
        'chest-open': 'chest-open 0.8s ease-out',
        'card-flip': 'card-flip 0.6s ease-in-out',
        'trophy-bounce': 'trophy-bounce 1s ease-in-out infinite',
        'sword-slash': 'sword-slash 0.4s ease-out',
        'explosion': 'explosion 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
};
