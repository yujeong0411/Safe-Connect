import { EmergencyLogItemProps } from './EmergencyLogItem.types';

const EmergencyLogItem = ({ time, dispatchTime, arrivalTime, status }: EmergencyLogItemProps) => {
  return (
    <div className="grid grid-cols-4 gap-4 p-4 border-b border-gray-200 hover:bg-gray-50">
      <span className="text-sm">{time}</span>
      <span className="text-sm">{dispatchTime}</span>
      <span className="text-sm">{arrivalTime}</span>
      <span className="text-sm font-medium">{status}</span>
    </div>
  );
};

export default EmergencyLogItem;