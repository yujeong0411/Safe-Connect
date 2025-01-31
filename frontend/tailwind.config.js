/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,scss}'],
  theme: {
    extend: {
      colors: {
        // 커스텀 색상
        bg: '#F3F5F9',
        banner: '#545F71',
        graybtn: '#DDDDDD', // 변수명 gray는 안됨. 다른 컴포넌트에 gray가 사용되어서 그것까지 변함.
        focus: '#545F71',
      },
    },
  },

  plugins: [],
};
