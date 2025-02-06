// src/features/dispatch/types.ts
export interface DispatchData {
  id: string;
  requestTime: string;
  patientName: string;
  transferDestination: string;
  requestHospital: string;
  transferCompleteTime: string;
  status: 'pending' | 'in-progress' | 'completed';
  
  // 환자 기본 정보
  gender: string;
  age: number;
  consciousness: string;
  preKTAS: number;
  patientContact: string;
  guardianContact: string;

  // 생체 징후
  vitals: {
    sbp: number;
    dbp: number;
    rr: number;
    bt: number;
    spo2: number;
    bst: number;
  };

  // 상세 정보
  symptoms: string;
  diagnosis: string;
  medications: string;
  notes: string;

  // 이송 정보
  transferInfo: {
    requestTime: string;
    endTime: string;
    hospital: string;
  };
}