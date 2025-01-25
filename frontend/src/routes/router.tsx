import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UserLoginPage from '@pages/UserPage/UserLoginPage.tsx';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/userlogin" element={<UserLoginPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
