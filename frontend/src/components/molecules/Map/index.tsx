interface MapProps {
  className?: string;
}

const Map = ({ className }: MapProps) => {
  // 실제 지도 구현은 카카오맵이나 네이버맵 API를 사용하여 구현
  return (
    <div className={className}>
      {/* 지도 구현 */}
    </div>
  );
};

export default Map;