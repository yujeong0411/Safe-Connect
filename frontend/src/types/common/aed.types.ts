// 응답
export interface AedResponse {
  isSuccess: string;
  code: number;
  message: string;
  data: Aed[];
}

export interface Aed{
  aedId: number;
  aedAddress : string
  aedPlace : string
  aedLatitude : number
  aedLongitude : number
}