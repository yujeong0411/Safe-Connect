const WaveBackground = () => (
  <div className="absolute inset-0 overflow-hidden w-screen">
    <svg
      viewBox="0 0 1440 320"
      className="absolute bottom-0 w-full"
      preserveAspectRatio="none"
      // 최소 너비를 설정하여 화면이 작아져도 유지
      style={{ minWidth: '1440px' }}
    >
      <path
        fill="#FFFFFF"
        fillOpacity="0.8"
        d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,112C960,139,1056,181,1152,181.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
      />
    </svg>
  </div>
);

export default WaveBackground;
