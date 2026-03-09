/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)'
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        navy: {
          DEFAULT: 'hsl(var(--navy))',
          foreground: 'hsl(var(--navy-foreground))'
        },
        'section-bg': 'hsl(var(--section-bg))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))'
      },
      fontFamily: {
        // PERBAIKAN: Definisi untuk tipografi brand KALREN
        heading: ['"DM Sans"', 'sans-serif'], 
  body: ['"DM Sans"', 'sans-serif'],
  sans: ['"DM Sans"', 'sans-serif'],
      },
      letterSpacing: {
        // PERBAIKAN: Spasi huruf untuk vibe luxury
        luxury: '0.25em',
        tightest: '-0.05em',
      },
      fontSize: {
        '7xl': '5rem',
        '8xl': '6rem',
        '9xl': '8rem'
      },
      spacing: {
        'section': 'var(--spacing-section)',
        'section-lg': 'var(--spacing-section-lg)',
        'section-xl': 'var(--spacing-section-xl)'
      },
      boxShadow: {
        'soft': 'var(--shadow-soft)',
        'lift': 'var(--shadow-lift)',
        'elegant': 'var(--shadow-elegant)'
      },
      transitionDuration: {
        'smooth': 'var(--transition-smooth)',
        'lift': 'var(--transition-lift)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 1.2s ease-out forwards'
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};