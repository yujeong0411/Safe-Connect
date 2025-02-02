package c207.camference.api.response.report;

import c207.camference.api.response.hospital.HospitalResponse;
import c207.camference.db.entity.patient.Patient;
import c207.camference.db.entity.report.Transfer;
import c207.camference.db.entity.users.User;
import c207.camference.db.repository.patient.PatientRepository;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.core.parameters.P;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class TransferDetailResponse {
    private String patientName;          // 이름
    private Character patientGender;        // 성별
    private String patientAge;           // 나이
    private String patientMental;        // 의식상태
    private Integer patientSystolicBldPress;  // SBP
    private Integer patientDiastolicBldPress; // DBP
    private Integer patientPulseRate;     // PR
    private Float patientTemperature;   // BT
    private Float patientSpo2;          // SPO2
    private Integer patientBloodSugar;    // BST
    private String userPhone;            // 환자연락처


    private String userProtectorPhone;   // 보호자연락처
//    private String patientSymptom;       // 증상
//    private String mediName;             // 현재 병력
//    private String mediName2;


    public TransferDetailResponse(Transfer transfer,Patient patient) {
        this.patientName = patient.getPatientName();
        this.patientGender = patient.getPatientGender();
        this.patientAge = patient.getPatientAge();
        this.patientMental = patient.getPatientMental();
        if (patient.getPatientIsUser()){
            User user = patient.getUser();
            this.userPhone = user.getUserPhone();
            this.userProtectorPhone = user.getUserProtectorPhone();
//            this.patientSymptom = user.getPatientSymptom(); //찬미에게 부탁해야할듯..
//            this.mediName = user.getMediName();
//            this.mediName2 = user.getMediName2();
        }

        this.patientSystolicBldPress = patient.getPatientSystolicBldPress();
        this.patientDiastolicBldPress = patient.getPatientDiastolicBldPress();
        this.patientPulseRate = patient.getPatientPulseRate();
        this.patientTemperature = patient.getPatientTemperature();
        this.patientSpo2 = patient.getPatientSpo2();
        this.patientBloodSugar = patient.getPatientBloodSugar();

    }
}