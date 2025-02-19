import { motion } from 'framer-motion';
import mascot from '@assets/image/mascot1.png';

const PublicCarousel = () => {
  return (
    <div className="relative px-4 md:px-8 lg:px-20 xl:px-40">
      {/* 배경 장식 요소들 */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-10 left-40 w-2 h-2 md:w-3 md:h-3 lg:w-5 lg:h-5 rounded-full bg-orange-200"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-3 h-3 md:w-4 md:h-4 lg:w-6 lg:h-6 rounded-full bg-blue-200"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-[8rem] right-10 w-2 h-2 md:w-2.5 md:h-2.5 lg:w-4 lg:h-4 rounded-full bg-red-200"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relativ pt-10 md:pt-10 lg:pt-20"
      >
        <div className="relative flex flex-col-reverse md:flex-row items-center justify-center gap-16 md:gap-0">
          <div className="relative w-full md:w-auto">
            {/* 말풍선 */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative md:absolute mb-8 md:mt-0
             md:top-5 md:-right-[15rem]
             p-6 md:p-8 bg-white rounded-[20px] md:rounded-[30px]
             shadow-lg w-full md:w-96
             transform -rotate-[2deg]
             border border-blue-100"
            >
              {/* 말풍선 꼬리 */}
              <div
                className="hidden md:block absolute left-1 top-1/2 w-0 h-0
                border-t-[15px] border-t-transparent
                border-r-[30px] border-r-white
                border-b-[15px] border-b-transparent
                transform -translate-x-[28px] -translate-y-1/2 rotate-[15deg]"
              ></div>
              <p className="text-base md:text-lg lg:text-xl text-center text-gray-800 leading-relaxed">
                <span className="text-lg md:text-xl font-bold text-orange-600">응급 의료 정보</span>
                를<span className="text-sm md:text-base"> 미리 등록하세요.</span>
                <br />
                <span className="text-sm md:text-base">응급 상황에서는 </span>
                <span className="text-lg md:text-xl font-bold text-black">자동으로 전달</span>됩니다.
                <br />
                <span className="text-sm md:text-base">당신의 안전,</span>
                <br />
                <span className="font-bold text-lg md:text-xl">
                  <span className="text-[#0b485d]">Safe Connect</span>
                </span>
                <span className="text-sm md:text-base">와 함께하세요.</span>
              </p>
            </motion.div>

            {/* 마스코트 이미지에 그림자 효과 추가 */}
            <motion.img
              src={mascot}
              alt="mastcot"
              className="w-[350px] sm:w-[400px] md:w-[600px] lg:w-[800px] h-auto mx-auto -mt-15 md:-mt-16 lg:-mt-20"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PublicCarousel;
