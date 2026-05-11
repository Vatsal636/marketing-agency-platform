import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        surface: '#12121a',
        'surface-hover': '#1a1a25',
        'surface-2': '#1e1e2a',
        border: '#2a2a3a',
        'border-hover': '#3a3a4f',
        'text-primary': '#f0f0f5',
        'text-secondary': '#8888a0',
        'text-muted': '#555570',
        accent: '#6366f1',
        'accent-hover': '#818cf8',
        'accent-glow': 'rgba(99, 102, 241, 0.15)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
