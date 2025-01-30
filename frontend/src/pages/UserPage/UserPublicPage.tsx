import Carousel from '@/features/user/components/Carousel.tsx';
import UserPublicTemplate from '@components/templates/UserPublicTemplate.tsx';

const UserPublicPage = () => {
  return (
    <UserPublicTemplate>
      {/* 캐러셀을 가운데 정렬하고 크기 유지 */}
      <div className="w-full max-w-[1400px] min-h-[600px] flex justify-center items-center">
        <Carousel />
      </div>
    </UserPublicTemplate>
  );
};

export default UserPublicPage;
