const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif-luxury': ['Playfair Display', 'serif'],
        'sans-luxury': ['Inter', 'sans-serif'],
      },
      colors: {
        luxury: {
          charcoal: '#1a1a1a',
          champagne: '#F7E7CE',
          rosegold: '#E8B4B8',
          cream: '#FEFCF8',
          midnight: '#0F172A',
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      letterSpacing: {
        tighter: '-0.02em',
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        scroll: "scroll 30s linear infinite",
        'scroll-infinite': 'scroll-x 40s linear infinite',
      },
      keyframes: {
        shimmer: {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
        scroll: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'scroll-x': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-33.33%)' }
        },
      },
    },
  },
  plugins: [addVariablesForColors],
};

function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}