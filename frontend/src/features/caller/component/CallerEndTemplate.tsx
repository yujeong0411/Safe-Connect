import NavBar from '@components/organisms/NavBar/NavBar';
import PublicHeader from '@components/organisms/PublicHeader/PublicHeader.tsx';

const CallerEndTemplate = () => {


  const navItems = [
    {
      label: '.......',
      hasModal: false,
      path : '#',
    }
  ];


  return (
    <div className="mih-h-screen bg-bg flex flex-col">
    <PublicHeader
      labels={[
]}
  />
    <div className="-space-y-4">
      <NavBar navItems={navItems} />
    </div>
  </div>
);
};


export default CallerEndTemplate;
