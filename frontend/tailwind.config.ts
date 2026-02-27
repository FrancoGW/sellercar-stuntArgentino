import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: {
        gold: { DEFAULT: '#B59F02', light: '#F4E17F', lighter: '#FFF4B2', hover: '#e4c63d' },
        whatsapp: { DEFAULT: '#25D366', hover: '#20BA5A' },
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        status: { ok: 'hsl(var(--status-ok))', warning: 'hsl(var(--status-warning))', error: 'hsl(var(--status-error))' },
        'price-cta': 'hsl(var(--price-cta))',
        'price-cta-foreground': 'hsl(var(--price-cta-foreground))',
      },
      borderRadius: { lg: 'var(--radius)', md: 'calc(var(--radius) - 2px)', sm: 'calc(var(--radius) - 4px)' },
      boxShadow: { gold: '0 25px 50px -12px rgba(181, 159, 2, 0.25)', 'gold/10': '0 10px 15px -3px rgba(181, 159, 2, 0.1)', 'gold/20': '0 25px 50px -12px rgba(181, 159, 2, 0.2)', 'gold/30': '0 25px 50px -12px rgba(181, 159, 2, 0.3)' },
      keyframes: { fadeInSlide: { '0%': { opacity: '0', transform: 'translateY(-10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } } },
      animation: { 'fade-in-slide': 'fadeInSlide 0.6s ease-out forwards' },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
