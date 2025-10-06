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
        // Primary brand colors - elegant grey/green gradients
        'procurvv-bg': '#fafbfc',
        'procurvv-card': '#ffffff',
        'procurvv-accent': '#10b981', // Emerald green
        'procurvv-accent-light': '#34d399',
        'procurvv-accent-dark': '#059669',
        'procurvv-text': '#1f2937',
        'procurvv-text-light': '#6b7280',
        'procurvv-muted': '#9ca3af',
        'procurvv-border': '#e5e7eb',
        'procurvv-logo': '#10b981',
        
        // Gradient colors for sophisticated look
        'procurvv-gradient-start': '#f0fdf4',
        'procurvv-gradient-end': '#ecfdf5',
        'procurvv-gradient-accent': '#10b981',
        'procurvv-gradient-accent-light': '#34d399',
        
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
