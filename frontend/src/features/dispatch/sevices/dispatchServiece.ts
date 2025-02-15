import {axiosInstance} from "@utils/axios.ts";
import {DispatchSavePatientRequest, DispatchSavePatientResponse} from "@/types/common/Patient.types.ts";

export const updateDispatchPatientInfo = async (patientInfo: DispatchSavePatientRequest):Promise<DispatchSavePatientResponse> => {
    try {
        console.log("구급대원 환자 정보 저장 시도",patientInfo);
        const response = await axiosInstance.put<DispatchSavePatientResponse>('/dispatch_staff/patient_info', patientInfo);
        console.log("구급대원 환자 정보 저장 응답", response);
        return response.data
    } catch (error) {
        console.log("구급대원 환자정보 저장 실패", error)
        throw error;
    }
}