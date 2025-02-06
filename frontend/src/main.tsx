// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  // <StrictMode> api를 2번 호출한다.
    <App />
  // </StrictMode>
);
