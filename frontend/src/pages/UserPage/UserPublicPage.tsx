import Carousel from '@/features/user/components/Carousel.tsx';
import UserPublicTemplate from '@components/templates/UserPublicTemplate.tsx';

const UserPublicPage = () => {
  return (

      <UserPublicTemplate>
          <div className="w-full flex justify-center items-center">
              <div className="max-w-[1100px] flex items-center justify-center mt-10 transform -translate-x-40">
                  <Carousel/>
              </div>
          </div>
      </UserPublicTemplate>
  );
};

export default UserPublicPage;
