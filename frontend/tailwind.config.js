/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,scss}'],
  theme: {
    extend: {
      colors: {
        // 커스텀 색상
        bg: '#F3F5F9',
        banner: '#545F71',
        focus: '#545F71',
      },
    },
  },

  plugins: [],
};
