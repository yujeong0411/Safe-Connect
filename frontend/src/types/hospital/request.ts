export interface HospitalLoginRequest {
  hospitalLoginId: string;
  hospitalPassword: string;
}

export interface HospitalTransferAcceptRequest {
  patientId: number;
  status: 'accepted' | 'rejected';
}
