import {Route, Routes } from 'react-router-dom';
import TestPage from './TestPage';

const ControlRoutes = () => {
  return (
    <Routes>

      {/*<Route path="" element={<TestPage/> }  />*/}
      <Route path="" element={<TestPage />} />

    </Routes>
  );
};

export default ControlRoutes;