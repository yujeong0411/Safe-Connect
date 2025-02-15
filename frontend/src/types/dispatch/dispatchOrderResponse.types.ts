import {CallInfoRequest} from "@/types/common/Patient.types.ts";
import {PatientInfo} from "@/types/common/Patient.types.ts";
import {PatientDetail} from "@/types/hospital/hospitalTransfer.types.ts";
import {MedicalCategory} from "@/types/common/medical.types.ts";

// patient 타입 정리 (sse.types에 있던 것 삭제)
export interface Patient extends PatientInfo, PatientDetail {
  patientId: number;
  callId: number | null;
  dispatchId: number | null;
  transferId: number | null;
  patientIsUser: boolean;
  patientCreatedAt: string;
  patientInfoCreatedAt: string | null;
  call: CallInfoRequest | null;
  dispatch: unknown | null;
  transfer: unknown | null;
  user: unknown | null;
  dispatchGroup: unknown | null;
  mediInfo: MedicalCategory[];
}

export interface DispatchOrderResponse {
  isSuccess: boolean;
  code: number;
  message: string;
  data: {
    dispatchId: number;
    callId: number;
    patient: Patient;
    mediInfo?: MedicalCategory[];
    callSummary: string;
  }
}