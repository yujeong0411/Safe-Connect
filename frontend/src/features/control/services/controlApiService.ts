import { axiosInstance } from '@utils/axios.ts';
import { PatientResponse, CallInfo } from '@/types/common/Patient.types.ts';

export const patientService = {
  serarchByPhone: async (phone: string): Promise<PatientResponse> => {
    const response = await axiosInstance.get<PatientResponse>('/control/medi_list', {
      params: { patientPhone: phone },
    });
    return response.data;
  },

  savePatientInfo: async (info: CallInfo): Promise<PatientResponse> => {
    const response = await axiosInstance.put<PatientResponse>('/contol/call', info);
    return response.data;
  },
};
