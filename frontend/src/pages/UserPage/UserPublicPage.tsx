import UserPublicTemplate from '@components/templates/UserPublicTemplate.tsx';
import PublicCarousel from "@features/user/components/PublicCarousel.tsx";

const UserPublicPage = () => {
  return (

      <UserPublicTemplate>
          <div className="w-full flex justify-center items-center px-4 md:px-6 lg:px-8">
              <div className="w-full max-w-[1100px] flex items-center justify-center
                      mt-4 sm:mt-6 md:mt-8 lg:mt-10
                      transform translate-x-0 lg:-translate-x-40">
                  <PublicCarousel/>
              </div>
          </div>
      </UserPublicTemplate>
  );
};

export default UserPublicPage;
