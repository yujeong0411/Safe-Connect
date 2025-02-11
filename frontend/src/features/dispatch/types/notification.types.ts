export interface NotificationMessage {
  type: 'status' | 'info';
  hospitalName: string;
  message: string;
  timestamp: string;
}