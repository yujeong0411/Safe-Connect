package c207.camference.api.request.dispatchstaff;

import lombok.Getter;

@Getter
public class PreKtasRequest {
    Integer patientAge; // 나이
    Integer patientBloodSugar; // 혈당
    Integer patientDiastolicBldPress; // 혈압최소
    Integer patientSystolicBldPress; // 혈압최대
    Integer patientPulseRate; // 호흡수
    Float patientTemperature; // 체온
    Float patientSpo2; // 산소포화도
    String patientMental; // 의식상태
    String patientSymptom; // 증상

}
