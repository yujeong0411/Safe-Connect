import { create } from 'zustand';
import { PatientInfo, PatientStore, FormData, CurrentCall } from '@/types/common/Patient.types.ts';
import {controlService, patientService, protectorService} from '@features/control/services/controlApiService.ts';
import {useOpenViduStore} from "@/store/openvidu/OpenViduStore.tsx";

const initialFormData: FormData = {
    patientName: '',
    patientGender: '',
    patientAge: '',
    patientBloodSugar: '',
    patientDiastolicBldP: '',
    patientDiastolicBldPress:'', // 혈압최소
    patientSystolicBldPress:'', // 혈압최대
    patientBreatheRate:'', // 호흡수
    patientTemperature:'', // 체온
    patientSpo2:'', // 산소포화도
    patientMental:'', // 의식상태
    patientSymptom:'', // 증상
}

export const dispatchPatientStore = create<PatientStore>((set, get) => ({
    patientInfo: null,
    formData: initialFormData,


}))