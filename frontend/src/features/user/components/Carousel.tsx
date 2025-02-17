import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import carousel1 from '@assets/carousel/Carousel1.png';
import carousel2 from '@assets/carousel/Carousel2.png';
import carousel3 from '@assets/carousel/Carousel3.png';

const Carousel = () => {
  const settings = {
    dots: false,
    autoplay: true,
    infinite: true,
    speed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    // 올바른 responsive 설정
    responsive: [
      {
        breakpoint: 1024, // 데스크톱
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600, // 태블릿
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480, // 모바일
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    // 접근성 개선을 위한 설정 추가
    accessibility: true, // 키보드 탐색 활성화
    swipeToSlide: true, // 스와이프로 슬라이드 이동 가능
    focusOnSelect: false,  // 슬라이드 클릭 시 포커스 방지
    pauseOnFocus: false,   // 포커스 시 자동 재생 유지
    pauseOnHover: false,   // 호버 시 자동 재생 유지
  };

  return (
    <div className="w-full h-[400px] sm:h-[500px] md:h-[600px] relative overflow-hidden">
      <Slider {...settings} className="h-full">
        <div className="relative aspect-[16/9]">
          <img
            src={carousel1}
            alt="carousel1"
            className="w-full h-full object-contain"
          />
          <div className="absolute top-[40%] left-1/2 transform -translate-x-[0%] -translate-y-1/2 text-[#08455A] text-center">
            <h2 className="text-xl md:text-3xl font-bold font-sans mb-2 md:mb-5 text-orange-400">
              "실시간 소통으로 더 정확한 응급처치"
            </h2>
            <p className="text-base md:text-lg font-sans" style={{ lineHeight: '2rem' }}>
              상황실과의 영상통화로 현장 도착 전에도 응급 지도를 받을 수 있습니다. <br />
              또한 실시간 응급 상황을 공유하여 최적의 구급팀이 즉시 출동합니다.
            </p>
          </div>
        </div>

        <div className="relative aspect-[16/9]">
          <img
            src={carousel2}
            alt="carousel2"
            className="w-full h-full object-contain"
          />
          <div className="absolute top-1 left-1/2 transform translate-x-[10%] translate-y-[20%] text-[#08455A] text-center">
            <h2 className="text-xl md:text-3xl font-bold font-sans mb-2 md:mb-4 text-orange-400">
              "한 번의 등록으로 언제나 안전하게"
            </h2>
            <p className="text-base md:text-lg font-sans" style={{ lineHeight: '2rem' }}>
              기저질환, 복용약물 정보를 미리 등록하시면 <br />
              구급대원이 현장에서 즉시 확인하고 대처할 수 있습니다.
            </p>
          </div>
        </div>

        <div className="relative aspect-[16/9]">
          <img
            src={carousel3}
            alt="carousel3"
            className="w-full h-full object-contain"
          />
          <div className="absolute w-1/2 top-1 left-1/2 transform translate-x-[5%] translate-y-[0%] text-[#08455A] text-center">
            <h2 className="text-xl md:text-3xl font-bold font-sans mb-2 md:mb-4 text-orange-400">
              "정확한 위치, 빠른 도착"
            </h2>
            <p className="text-base md:text-lg font-sans" >
              Safe Connect만의 위치 정보 공유를 통해<br/>
              골든 타임을 놓치지 않고 가장 가까운 구급팀이 즉시 출동합니다.
            </p>
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default Carousel;
