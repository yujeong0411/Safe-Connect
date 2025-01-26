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
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    responsive: [{}],
  };
  return (
    <div className="slider-container  sm:w-4/5 md:w-3/4 lg:w-[1200px] mx-auto">
      <Slider {...settings}>
        <div>
          <img
            src={carousel1}
            alt="carousel1"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#08455A] text-center">
            <h2 className="text-4xl font-bold mb-4">"실시간 소통으로 더 정확한 응급처치"</h2>
            <p className="text-xl">
              상황실과의 영상통화로 현장 도착 전에도 응급 지도를 받을 수 있습니다. <br />
              또한 119간 실시간 응급 상황을 공유하여 최적의 구급팀이 즉시 출동합니다.
            </p>
          </div>
        </div>

        <div>
          <img
            src={carousel2}
            alt="carousel2"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-[#08455A] text-center">
            <h2 className="text-4xl font-bold mb-4">"한 번의 등록으로 언제나 안전하게"</h2>
            <p className="text-xl">
              기저질환, 복용약물 정보를 미리 등록하시면 <br />
              구급대원이 현장에서 즉시 확인하고 대처할 수 있습니다.
            </p>
          </div>
        </div>

        <div>
          <img
            src={carousel3}
            alt="carousel3"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute top-1/4 left-1/4 transform translate-x-2/4 -translate-y-1/3 text-[#08455A] text-center">
            <h2 className="text-4xl font-bold mb-4">"정확한 위치, 빠른 도착"</h2>
            <p className="text-xl">
              위치 정보 공유로 골든 타임을 놓치지 않고 가장 가까운 구급대가 출동합니다.
            </p>
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default Carousel;
