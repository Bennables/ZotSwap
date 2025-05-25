/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'], // Scans these files for Tailwind classes
  darkMode: 'class',  // Enables dark mode with class strategy
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#88BDF2',
          DEFAULT: '#6A89A7',
          dark: '#384959'
        },
        background: {
          light: '#F7FAFC',
          DEFAULT: '#FFFFFF',
          dark: '#1A202C'
        },
        accent: {
          light: '#F9C896',
          DEFAULT: '#F7B267',
          hover: '#F59E42'
        }
      },
      spacing: {
        'screen-h': '852px',
        'screen-w': '393px'
      },
      borderRadius: {
        'card': '1rem',
        'button': '9999px'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    }
  }
}

