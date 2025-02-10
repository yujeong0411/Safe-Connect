import {useHospitalTransferStore} from "@/store/hospital/hospitalTransferStore.tsx";

const fetchPatientDetail = async (dispatchId: number, type: string) => {
    const detailData = await useHospitalTransferStore
        .getState()
        .fetchTransferDetail(dispatchId, type);

    return {
        patientId: detailData.patientId,
        name: detailData.patientName ?? null,
        gender: detailData.patientGender ?? null,
        age: detailData.patientAge ?? null,
        mental: detailData.patientMental,
        preKTAS: detailData.patients[0].patientPreKtas,
        // 나머지 필드 매핑
    };
};