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
        brutal: {
          black: '#0A0A0A',
          dark: '#121212',
          surface: '#18181B',
          card: '#202024',
          border: '#2E2E33',
          borderLight: '#3F3F46',
          white: '#F8FAFC',
          muted: '#71717A',
        },
        status: {
          attended: {
            border: '#10B981',
            bg: 'rgba(6, 78, 59, 0.75)',
            text: '#34D399',
            badge: '#064E3B'
          },
          absent: {
            border: '#EF4444',
            bg: 'rgba(136, 19, 55, 0.75)',
            text: '#F87171',
            badge: '#881337'
          },
          proxy: {
            border: '#0EA5E9',
            bg: 'rgba(12, 74, 110, 0.75)',
            text: '#38BDF8',
            badge: '#0C4A6E'
          },
          exam: {
            border: '#F59E0B',
            bg: 'rgba(120, 53, 15, 0.75)',
            text: '#FBBF24',
            badge: '#78350F'
          },
          exempted: {
            border: '#64748B',
            bg: 'rgba(30, 41, 59, 0.75)',
            text: '#94A3B8',
            badge: '#1E293B'
          }
        }
      },
      boxShadow: {
        'brutal-sm': '2px 2px 0px #000000',
        'brutal': '4px 4px 0px #000000',
        'brutal-lg': '6px 6px 0px #000000',
        'brutal-glow-green': '0 0 15px rgba(16, 185, 129, 0.3)',
        'brutal-glow-red': '0 0 15px rgba(239, 68, 68, 0.3)',
        'brutal-glow-blue': '0 0 15px rgba(14, 165, 233, 0.3)',
        'brutal-glow-yellow': '0 0 15px rgba(245, 158, 11, 0.3)',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['"Space Grotesk"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
}
