/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        aura: {
          bg: '#09090b',
          surface: '#18181b',
          border: '#27272a',
          muted: '#71717a',
          text: '#fafafa',
          accent: '#a78bfa',
        },
      },
    },
  },
  plugins: [],
};
