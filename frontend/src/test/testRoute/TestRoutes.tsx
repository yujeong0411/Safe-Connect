// import {Route, Routes } from 'react-router-dom';
// import TestPage from './TestPage';
//
// const ControlRoutes = () => {
//   return (
//     <Routes>
//
//       {/*<Route path="" element={<TestPage/> }  />*/}
//       <Route path="" element={<TestPage />} />
//
//     </Routes>
//   );
// };
//
// export default ControlRoutes;


import { Route, Routes } from 'react-router-dom';
// import TestPage from './TestPage';
import CreateSessionPage from './CreateSessionPage';
import JoinSessionPage from './JoinSessionPage';

const ControlRoutes = () => {
  return (
    <Routes>
      {/*<Route path="" element={<TestPage />} />*/}
      <Route path="create" element={<CreateSessionPage />} />
      <Route path="join/:sessionId/*" element={<JoinSessionPage />} />
    </Routes>
  );
};

export default ControlRoutes;