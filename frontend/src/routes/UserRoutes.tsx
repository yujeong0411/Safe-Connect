import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import UserLoginPage from '@pages/UserPage/UserLoginPage.tsx';
import UserSignupPage1 from '@pages/UserPage/UserSignupPage1.tsx';
import UserSignupPage2 from '@pages/UserPage/UserSignupPage2.tsx';
import UserSignupPage3 from '@pages/UserPage/UserSignupPage3.tsx';
import UserPublicPage from '@pages/UserPage/UserPublicPage.tsx';
import UserMainPage from '@pages/UserPage/UserMainPage.tsx';
import UserInfoPage from '@pages/UserPage/UserInfoPage.tsx';
import UserMediPage from '@pages/UserPage/UserMediPage.tsx';
import UserUpdatePwPage from '@pages/UserPage/UserUpdatePwPage.tsx';
import UserFindEmailPage from '@pages/UserPage/UserFindEmailPage.tsx';
import UserFindPwPage from '@pages/UserPage/UserFindPwPage.tsx';

const UserRoutes = () => {
  return (
    <Routes>
      {/* 인증된 사용자만 접근가능 */}
      <Route element={<PrivateRoute />}>
        <Route path="main" element={<UserMainPage />} />
        <Route path="info" element={<UserInfoPage />} />
        <Route path="medi" element={<UserMediPage />} />
        <Route path="updatepassword" element={<UserUpdatePwPage />} /> // 로그인
      </Route>

      {/* 모든 사용자 접근 가능 */}
      <Route element={<PublicRoute />}>
        <Route path="signup/medi" element={<UserSignupPage3 />} />
        <Route path="" element={<UserPublicPage />} />
        <Route path="login" element={<UserLoginPage />} />
        <Route path="signup" element={<UserSignupPage1 />} />
        <Route path="signup/info" element={<UserSignupPage2 />} />
        <Route path="findemail" element={<UserFindEmailPage />} />
        <Route path="findpassword" element={<UserFindPwPage />} />
      </Route>
    </Routes>
  );
};

export default UserRoutes;
