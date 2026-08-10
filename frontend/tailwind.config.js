/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0B0F19',
          card: '#161F30',
          cyan: '#06b6d4',
          purple: '#a855f7',
          orange: '#f97316',
          green: '#10b981',
          slate: '#1e293b',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 0 15px rgba(168, 85, 247, 0.6)',
          },
          '50%': {
            opacity: '0.4',
            boxShadow: '0 0 5px rgba(168, 85, 247, 0.2)',
          },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
