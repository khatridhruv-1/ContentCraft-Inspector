import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  safelist: [
    'md:hidden',
    'max-md:flex',
    'hidden',
    'pt-32',
    'pb-8',
    'pb-10',
    'md:pb-10',
    {
      pattern:
        /^(bg|text|border|hover:bg|hover:text|hover:border|active:bg|focus:bg|focus-visible:bg|data-\[state=active\]:bg)-teal-(50|100|200|300|400|500|600|700|800|900|950)$/,
    },
    {
      pattern:
        /^(bg|text|border|hover:bg|hover:text|hover:border|active:bg)-teal-(50|100|200|300|400|500|600|700|800|900|950)\/(5|10|20|30|40|45|50|60|70|80|90)$/,
    },
    {
      pattern:
        /^(bg|text|border|hover:bg|hover:text|hover:border|active:bg|focus:bg|focus-visible:bg|data-\[state=active\]:bg)-slate-(50|100|200|300|400|500|600|700|800|900|950)$/,
    },
    {
      pattern:
        /^(bg|text|border|hover:bg|hover:text|hover:border|active:bg)-slate-(50|100|200|300|400|500|600|700|800|900|950)\/(5|10|20|30|40|45|50|60|70|80|90)$/,
    },
  ],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
    '*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        brand: {
          DEFAULT: 'hsl(var(--brand))',
          foreground: 'hsl(var(--brand-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'gradient-x': {
          '0%, 100%': { backgroundSize: '200% 200%', backgroundPosition: 'left center' },
          '50%': { backgroundSize: '200% 200%', backgroundPosition: 'right center' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '15%': { transform: 'translateX(-6px)' },
          '30%': { transform: 'translateX(6px)' },
          '45%': { transform: 'translateX(-4px)' },
          '60%': { transform: 'translateX(4px)' },
          '75%': { transform: 'translateX(-2px)' },
          '90%': { transform: 'translateX(2px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(13, 148, 136, 0)' },
          '50%': { boxShadow: '0 0 20px 6px rgba(13, 148, 136, 0.22)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'gradient-x': 'gradient-x 4s ease infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'shake': 'shake 0.5s ease-in-out',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
