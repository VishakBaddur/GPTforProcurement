/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors - elegant grey gradients
        'procurvv-bg': '#fafbfc',
        'procurvv-card': '#ffffff',
        'procurvv-accent': '#6b7280', // Gray 600
        'procurvv-accent-light': '#9ca3af', // Gray 400
        'procurvv-accent-dark': '#374151', // Gray 700
        'procurvv-accent-blue': '#6b7280', // Use grey
        'procurvv-accent-blue-light': '#9ca3af',
        'procurvv-text': '#000000',
        'procurvv-text-light': '#374151',
        'procurvv-muted': '#6b7280',
        'procurvv-border': '#e5e7eb',
        'procurvv-logo': '#6b7280',

        // Gradient colors for sophisticated grey look
        'procurvv-gradient-start': '#f8fafc',
        'procurvv-gradient-end': '#f1f5f9',
        'procurvv-gradient-accent': '#6b7280',
        'procurvv-gradient-accent-light': '#9ca3af',
        'procurvv-gradient-blue': '#6b7280',
        'procurvv-gradient-blue-light': '#9ca3af',

        // Dark theme colors (for auction interface)
        'procurvv-dark-bg': '#0d1117',
        'procurvv-dark-card': '#0f1720',
        'procurvv-dark-text': '#e6eef3',
        'procurvv-dark-muted': '#98a0a6',
        'procurvv-dark-border': '#2a3b4a',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
