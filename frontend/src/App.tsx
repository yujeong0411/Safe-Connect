import Router from '@/routes/index';
import {Toaster} from "@components/ui/toaster.tsx";

// router 연결 가능

function App() {
  return (
      <>
      <Router />
      <Toaster />
      </>
)}

export default App;
