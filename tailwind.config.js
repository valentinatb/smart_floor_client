/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Colores que cambian automáticamente con el tema usando variables CSS
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          secondary: 'var(--color-primary-secondary)',
          highlight: 'var(--color-primary-highlight)',
        },
        background: {
          DEFAULT: 'var(--color-background)',
          panel: 'var(--color-background-panel)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
        },
        success: 'var(--color-success)',
        error: 'var(--color-error)',
        action: 'var(--color-action)',
      },
    },
  },
  plugins: [],
}