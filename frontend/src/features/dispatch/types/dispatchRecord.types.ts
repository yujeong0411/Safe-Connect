// src/features/dispatch/types/dispatchRecord.types.ts

export interface DispatchRecord {
  id: string;
  dispatchResponsible: string;   // 출동 담당자
  dispatchStartTime: string;     // 출동 시작 일시
  dispatchEndTime: string;       // 출동 종료 일시
  hasTransfer: boolean;          // 이송 유무
  hospitalName: string | null;   // 이송 병원
  transferStartTime: string | null; // 이송 시작 일시
  transferEndTime: string | null;   // 이송 종료 일시
  patientInfo: {
    name: string;
    gender: string;
    age: string;
    patientContact: string;
    guardianContact: string;
    consciousness: string;
    preKTAS: string;
    sbp: string;
    dbp: string;
    pr: string;
    bt: string;
    spo2: string;
    bst: string;
    medicalHistory: string;
    medications: string;
    reportSummary: string;
    symptoms: string;
  };
}