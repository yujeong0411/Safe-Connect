import ControlMainTemplate from '@features/control/components/ControlMainTemplate.tsx';
import CallRecordForm from '@features/control/components/CallRecordForm.tsx';
// import { error } from 'console';

const ControlMainPage = () => {

  return (
    <ControlMainTemplate>
      <CallRecordForm />
    </ControlMainTemplate>
  );
};

export default ControlMainPage;
