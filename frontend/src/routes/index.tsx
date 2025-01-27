import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import UserLoginPage from '@pages/UserPage/UserLoginPage.tsx';
import UserSignupPage1 from '@pages/UserPage/UserSignupPage1.tsx';
import UserSignupPage2 from '@pages/UserPage/UserSignupPage2.tsx';
import UserSignupPage3 from '@pages/UserPage/UserSignupPage3.tsx';
import UserPublicPage from '@pages/UserPage/UserPublicPage.tsx';
import UserMainPage from '@pages/UserPage/UserMainPage.tsx';
import UserInfoPage from '@pages/UserPage/UserInfoPage.tsx';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 인증된 사용자만 접근가능 */}
        <Route element={<PrivateRoute />}></Route>

        {/* 모든 사용자 접근 가능 */}
        <Route element={<PublicRoute />}>
          <Route path="/user" element={<UserPublicPage />}></Route>
          <Route path="/user/main" element={<UserMainPage />}></Route> // 로그인 연결될때까지만
          public!!
          <Route path="/user/info" element={<UserInfoPage />}></Route> // 로그인 연결될때까지만
          public!!
          <Route path="/user/login" element={<UserLoginPage />}></Route>
          <Route path="/user/signup" element={<UserSignupPage1 />}></Route>
          <Route path="/user/signup/info" element={<UserSignupPage2 />}></Route>
          <Route path="/user/signup/medi" element={<UserSignupPage3 />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
