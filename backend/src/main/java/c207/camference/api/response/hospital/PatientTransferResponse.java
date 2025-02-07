package c207.camference.api.response.hospital;

import c207.camference.db.entity.patient.Patient;
import c207.camference.db.entity.report.Dispatch;
import c207.camference.db.repository.users.UserRepository;

public class PatientTransferResponse {

    private Integer dispatchId;
    private Patient patient;

    public PatientTransferResponse(Dispatch dispatch, Patient patient) {
        this.dispatchId = dispatch.getDispatchId();
        this.patient = Patient.builder()
                .patientId(patient.getPatientId())
                .patientIsUser(patient.getPatientIsUser())
                .patientName(patient.getPatientName())
                .patientGender(patient.getPatientGender())
                .patientAge(patient.getPatientAge())
                .patientBloodSugar(patient.getPatientBloodSugar())
                .patientDiastolicBldPress(patient.getPatientDiastolicBldPress())
                .patientSystolicBldPress(patient.getPatientSystolicBldPress())
                .patientPulseRate(patient.getPatientPulseRate())
                .patientTemperature(patient.getPatientTemperature())
                .patientSpo2(patient.getPatientSpo2())
                .patientMental(patient.getPatientMental())
                .patientPreKtas(patient.getPatientPreKtas())
                .patientSympthom(patient.getPatientSympthom())
                .build();

        // user면 기저질환 넣어줘야 함
        if (patient.getPatientIsUser()) {

        }

    }
}
