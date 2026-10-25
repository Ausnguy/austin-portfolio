/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Colors are CSS variables (see index.css) so dark mode swaps the whole palette.
      colors: {
        cream: 'rgb(var(--cream) / <alpha-value>)',
        charcoal: 'rgb(var(--charcoal) / <alpha-value>)',
        slate: 'rgb(var(--slate) / <alpha-value>)',
        sage: 'rgb(var(--sage) / <alpha-value>)',
        rust: 'rgb(var(--rust) / <alpha-value>)',
        sand: 'rgb(var(--sand) / <alpha-value>)',
        white: 'rgb(var(--paper) / <alpha-value>)',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
