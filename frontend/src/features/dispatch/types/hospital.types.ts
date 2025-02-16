export interface Hospital {
  hospitalId: number;
  hospitalName: string;
  hospitalPhone: string;
  hospitalCapacity: number;
  hospitalAddress: string;
  distance: number;
  hospitalLat: number;
  hospitalLng: number;
  requested?: boolean;
  eta?: number;
  exactDistance?: number;
}

export interface APIResponse<T> {
  isSuccess: boolean;
  code: number;
  message: string;
  data: T;
}

export type HospitalResponse = APIResponse<Hospital[]>;