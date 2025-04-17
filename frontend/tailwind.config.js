/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand colors
        'primary-light': '#FF69B4', // Pink for light mode
        'primary-dark': '#FF1493',  // Deeper pink for dark mode
        primary: {
          50: '#FFF5F8',
          100: '#FFE6EF',
          200: '#FFCCE0',
          300: '#FFB3D1',
          400: '#FF80B3',
          500: '#FF4D94',
          600: '#FF1A75',
          700: '#E60057',
          800: '#B30044',
          900: '#800030',
        },
        // Light theme
        'light-primary': '#ffffff',
        'light-secondary': '#f8f9fa',
        'light-card': '#ffffff',
        'light-input': '#f1f3f5',
        'light-hover': '#f1f1f1',
        'light-border': '#dee2e6',
        'light-muted': '#6c757d',
        // Dark theme
        'dark-primary': '#121212',
        'dark-secondary': '#1e1e1e',
        'dark-card': '#262626',
        'dark-input': '#333333',
        'dark-hover': '#2c2c2c',
        'dark-border': '#444444',
        'dark-muted': '#adb5bd',
      },
      boxShadow: {
        'light-sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'light-md': '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
        'light-lg': '0 10px 15px rgba(0, 0, 0, 0.05), 0 4px 6px rgba(0, 0, 0, 0.05)',
        'dark-sm': '0 1px 2px rgba(0, 0, 0, 0.3)',
        'dark-md': '0 4px 6px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.4)',
        'dark-lg': '0 10px 15px rgba(0, 0, 0, 0.3), 0 4px 6px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
};
