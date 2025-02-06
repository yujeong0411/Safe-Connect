export interface DispatchData {
  id: string;
  requestTime: string;
  patientName: string;
  transferDestination: string;
  requestHospital: string;
  transferCompleteTime: string;
  status: 'pending' | 'in-progress' | 'completed';
  detailInfo?: {
    name: string;
    gender: string;
    age: number;
    consciousness: string;
    preKTAS: number;
    patientContact: string;
    guardianContact: string;
    vitals: {
      sbp: number;
      dbp: number;
      rr: number;
      bt: number;
      spo2: number;
      bst: number;
    };
  };
}