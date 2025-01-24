/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,scss}",
  ],
  theme: {
    extend: {
      colors: {
        // 커스텀 색상
        primary: '#ff69b4',
        secondary: '#90cbfb',
      }
    },
    // 기타 테마 확장
  },
  plugins: [],
}

