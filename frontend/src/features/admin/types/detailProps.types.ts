export interface ReportDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  buttons: string;
  data?: {
    callerPhone: string;
    callerIsUser: boolean;
    callIsDispatch: boolean;
    callStartAt: string;
    callFinishAt: string;
    callSummery: string;
    fireStaffName: string;
  };
}

export interface DispatchDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  buttons: string;
  data?: {
    patient: string;
    callerPhone: string;
    patientGender: string;
    patientAge: string;
    fireDept: string;
    fireStaffName: string;
    dispatchCreateAt: string;
    dispatchDepartAt: string;
    dispatchArriveAt: string;
    dispatchIsTransfer: boolean;
    callSummery: string;
  };
}

export interface TransferDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  buttons: string;
  data?: {
    patient: string;
    patientGender: string;
    patientAge: string;
    preTKAS: string;
    fireDept: string;
    fireStaffName: string;
    transferRequestAt: string; // 데이터 명 수정
    transferAcceptAt: string;
    transferArriveAt: string;
    hospitalName: boolean;
  };
}
