export interface TransferRequestResponse {
  isSuccess: boolean;
  code: number;
  message: string;
  data: {
    dispatchId: number;
    hospitalNames: string[];
    patientId: number;
  }
};

export interface AcceptedHospitalResponse {
  isSuccess: boolean;
  code: number;
  message: string;
  data: {
    transferId: number;
    hospitalId: number;
    hospitalName: string;
    latitude: number;
    longitude: number;
  };
};