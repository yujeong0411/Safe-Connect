package c207.camference.api.request.patient;

import lombok.Data;

@Data
public class PatientInfoRequest {
    private Integer patientId;
    private boolean patientIsUser;
    private String patientName;
    private Character patientGender;
    private Integer patientAge;
    private Integer patientBloodSugar;
    private Integer patientDiastolicBldPress;
    private Integer patientSystolicBldPress;
    private Integer patientPulseRate;
    private Float patientTemperature;
    private Float patientSpo2;
    private String patientMental;
    private String patientPreKtas;
    private String patientSymptom;

}