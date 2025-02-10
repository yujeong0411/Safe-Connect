import { NotificationMessage } from '@/features/dispatch/types/notification.types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { X } from 'lucide-react';

interface NotificationToastProps {
  notification: NotificationMessage;
  onClose: () => void;
}

export const NotificationToast = ({ notification, onClose }: NotificationToastProps) => {
  const { type, hospitalName, message, timestamp } = notification;

  return (
    <Alert className={`mb-2 ${
      type === 'status' ? 'border-blue-500 bg-blue-50' : 'border-green-500 bg-green-50'
    }`}>
      <div className="flex justify-between items-start">
        <div>
          <AlertTitle className="text-sm font-semibold">
            {hospitalName}
          </AlertTitle>
          <AlertDescription className="text-sm mt-1">
            {message}
            <div className="text-xs text-gray-500 mt-1">
              {new Date(timestamp).toLocaleTimeString()}
            </div>
          </AlertDescription>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={16} />
        </button>
      </div>
    </Alert>
  );
};
