import { motion } from 'framer-motion';
import mascot from '@assets/image/mascot1.png';

const PublicCarousel = () => {

  return (
      <div className="relative px-40">
        {/* 배경 장식 요소들 */}
        <div className="absolute inset-0 -z-10">
          <motion.div
              className="absolute top-20 left-40 w-4 h-4 rounded-full bg-orange-200"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
              className="absolute bottom-40 right-60 w-6 h-6 rounded-full bg-blue-200"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
          />
          <motion.div
              className="absolute top-60 right-40 w-3 h-3 rounded-full bg-red-200"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
          />
        </div>

        <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative aspect-[16/9]"
        >
          <div className="relative flex items-start justify-center">
            <div className="relative">
              {/* 마스코트 이미지에 그림자 효과 추가 */}
              <motion.img
                  src={mascot}
                  alt="mastcot"
                  className="w-[800px] h-auto drop-shadow-xl"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* 말풍선 */}
              <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-5 -right-40 p-6 bg-white rounded-[30px] shadow-lg w-80
                             transform -rotate-[2deg]"
              >
                {/* 말풍선 꼬리 */}
                <div
                    className="absolute left-1 top-1/2 w-0 h-0
                                border-t-[15px] border-t-transparent
                                border-r-[30px] border-r-white
                                border-b-[15px] border-b-transparent
                                transform -translate-x-[28px] -translate-y-1/2 rotate-[15deg]"
                ></div>
                <p className="text-xl text-center text-gray-800 leading-relaxed">
                  <span className="text-base font-normal">미리 등록한 </span>
                  <span className="text-xl font-bold text-orange-500">의료 정보</span>
                  <span className="text-base font-normal">로</span>
                  <br />
                  <span className="text-base font-normal">응급 상황 시 </span>
                  <span className="text-xl font-bold text-red-500">
                  자동 연계
                </span>
                  !<br />
                  <span className="inline-flex items-center gap-1">
                  <span className="font-bold">119</span>
                  <span className="text-gray-400">-</span>
                  <span className="font-bold">병원</span>
                  <span className="text-gray-400">-</span>
                  <span className="font-bold">보호자</span>
                </span>
                  <span className="text-base">까지</span>
                  <br />
                  <span className="font-bold text-xl">
                  <span className="text-[#0b485d]">Safe Connect</span>
                </span>
                  <span className="text-base">이 함께합니다.</span>
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
  );
};


export default PublicCarousel;
