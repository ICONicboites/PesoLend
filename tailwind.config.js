/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // PesoLend Color Palette
        primary: '#FFD700',      // Golden accent
        secondary: '#D4AF37',    // Gold
        dark: '#1a1a1a',         // Dark navy/charcoal
        'dark-bg': '#2a2a2a',    // Darker background
        'text-primary': '#FFFFFF', // White
        'text-secondary': '#CCCCCC', // Light gray
        success: '#00DD00',      // Green for disbursement
        pending: '#666666',      // Gray for pending
        border: '#444444',       // Card borders
      },
      animation: {
        slideIn: 'slideIn 0.3s ease-out',
        fadeIn: 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'segoe-ui', 'roboto', 'helvetica', 'arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}