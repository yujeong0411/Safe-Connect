interface BaseResponse<T> {
    isSuccess: boolean;
    code: number;
    message: string;
    data: T;
  }
  
  // 상황실-구급팀
  interface DispatchOrderData {
    dispatchGroupId: number;
    callId: number;
  }
  
  // 구급팀-병원 (구급팀)
  interface DispatchToHospitalData {
    dispatchId: number;
    hospitalIds: number[];
    patientId: number;
  }
  
  // 구급팀-병원 (병원)
  interface Patient {
    patientId: number;
    callId: number | null;
    dispatchId: number | null;
    transferId: number | null;
    userId: number | null;
    patientIsUser: boolean;
    patientName: string | null;
    patientGender: string | null;
    patientAge: string | null;
    patientBloodSugar: number;
    patientSystolicBldPress: number;
    patientPulseRate: number;
    patientTemperature: number;
    patientSpo2: number;
    patientMental: string;
    patientPreKtas: string | null;
    patientSympthom: string | null;
    patientCreatedAt: string;
    patientInfoCreatedAt: string | null;
    call: any | null; // 필요한 경우 Call 인터페이스 정의
    dispatch: any | null; // 필요한 경우 Dispatch 인터페이스 정의
    transfer: any | null; // 필요한 경우 Transfer 인터페이스 정의
    user: any | null; // 필요한 경우 User 인터페이스 정의
    dispatchGroup: any | null; // 필요한 경우 DispatchGroup 인터페이스 정의
  }
  
  interface HospitalTransferData {
    patient: Patient;
    dispatchId: number;
    mediInfo: any | null;
  }