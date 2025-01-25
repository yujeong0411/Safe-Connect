import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import UserLoginPage from '@pages/UserPage/UserLoginPage.tsx';

const router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 인증된 사용자만 접근가능 */}
        <Route element={<PrivateRoute />}></Route>

        {/* 모든 사용자 접근 가능 */}
        <Route element={<PublicRoute />}>
          <Route path="/user/login" element={<UserLoginPage />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default router;

// routes/index.tsx
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      // 기타 보호된 라우트
    ],
  },
]);
