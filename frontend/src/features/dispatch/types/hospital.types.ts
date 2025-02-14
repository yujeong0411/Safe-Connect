export interface Hospital {
  hospitalId: number;
  hospitalName: string;
  hospitalPhone: string;
  hospitalCapacity: number;
  hospitalAddress: string;
  hospitalLocation: {
    x: number; // longitude
    y: number; // latitude
  };
  distance: number;
  requested?: boolean;
}

export interface APIResponse<T> {
  isSuccess: boolean;
  code: number;
  message: string;
  data: T;
}

export type HospitalResponse = APIResponse<Hospital[]>;