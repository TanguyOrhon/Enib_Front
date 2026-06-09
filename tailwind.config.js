/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'blue-enib': '#91D1DD',
        'rose-enib': { DEFAULT: '#EA5F7E', light: '#E88097' },
        'orange-enib': { DEFAULT: '#EA8A00', light: '#FFA11C' },
        'gray-enib': { DEFAULT: '#EDEDED', light: '#F7F4F1' },
        'green-enib': { DEFAULT: '#5FBF64' },
      },
      spacing: {
        112: '28rem',
        128: '31rem',
        140: '40rem',
      },
    },
  },
  plugins: [
    function ({ addUtilities, theme }) {
      const colors = theme('colors');

      addUtilities({
        '.bg-gray-enib': { backgroundColor: colors.gray-enib.DEFAULT },
        '.bg-gray-enib-light': { backgroundColor: colors.gray-enib.light },
        '.bg-blue-enib': { backgroundColor: colors['blue-enib'] },
        '.bg-rose-enib': { backgroundColor: colors['rose-enib'].DEFAULT },
        '.bg-rose-enib-light': { backgroundColor: colors['rose-enib'].light },
        '.bg-orange-enib': { backgroundColor: colors['orange-enib'].DEFAULT },
        '.bg-orange-enib-light': { backgroundColor: colors['orange-enib'].light },
        '.bg-green-enib': { backgroundColor: colors['green-enib'].DEFAULT },
      });
    },
  ],
};
