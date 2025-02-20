package c207.camference.api.response.report;

import c207.camference.api.dto.medi.MediInfoDto;
import c207.camference.api.response.hospital.HospitalResponse;
import c207.camference.db.entity.etc.Medi;
import c207.camference.db.entity.patient.Patient;
import c207.camference.db.entity.report.Transfer;
import c207.camference.db.entity.users.User;
import c207.camference.db.entity.users.UserMediDetail;
import c207.camference.db.repository.patient.PatientRepository;
import c207.camference.db.repository.users.UserMediDetailRepository;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.core.parameters.P;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
public class TransferDetailResponse {
    private String patientName;          // 이름
    private Character patientGender;        // 성별
    private Integer patientAge;           // 나이
    private String patientMental;        // 의식상태
    private Integer patientSystolicBldPress;  // SBP
    private Integer patientDiastolicBldPress; // DBP
    private Integer patientPulseRate;     // PR
    private Float patientTemperature;   // BT
    private Float patientSpo2;          // SPO2
    private Integer patientBloodSugar;    // BST
    private String userPhone;            // 환자연락처


    private String userProtectorPhone;   // 보호자연락처
    private String patientSymptom;       // 증상
    private List<String> patientMedications;
    private List<String> patientDiseases;


    public TransferDetailResponse(Transfer transfer, Patient patient, UserMediDetailRepository userMediDetailrepository) {
        this.patientName = patient.getPatientName();
        this.patientGender = patient.getPatientGender();
        this.patientAge = patient.getPatientAge();
        this.patientMental = patient.getPatientMental();
        this.patientSymptom = patient.getPatientSymptom();

        if (patient.getPatientIsUser()){
            User user = patient.getUser();
            this.userPhone = user.getUserPhone();
            this.userProtectorPhone = user.getUserProtectorPhone();

            MediInfoDto mediInfoDto = getMedis(patient, userMediDetailrepository);
            this.patientMedications = mediInfoDto.getMedications();
            this.patientDiseases = mediInfoDto.getDiseases();

        } else {
            this.userPhone = patient.getCall().getCaller().getCallerPhone();
        }

        this.patientSystolicBldPress = patient.getPatientSystolicBldPress();
        this.patientDiastolicBldPress = patient.getPatientDiastolicBldPress();
        this.patientPulseRate = patient.getPatientPulseRate();
        this.patientTemperature = patient.getPatientTemperature();
        this.patientSpo2 = patient.getPatientSpo2();
        this.patientBloodSugar = patient.getPatientBloodSugar();

    }

    private MediInfoDto getMedis(Patient patient, UserMediDetailRepository userMediDetailRepository) {
        List<String> medications = new ArrayList<>();
        List<String> diseases = new ArrayList<>();
        UserMediDetail userMediDetail = userMediDetailRepository.findById(patient.getUserId()).orElse(null);

        if (userMediDetail != null) {
            userMediDetail.getUserMediMappings().stream()
                    .filter(mapping -> mapping.getMediIsActive())
                    .forEach(mapping -> {
                        Medi medi = mapping.getMedi();
                        if (medi.getMediCategory().getMediCategoryId() == 1) {
                            medications.add(medi.getMediName());
                        } else if (medi.getMediCategory().getMediCategoryId() == 2) {
                            diseases.add(medi.getMediName());
                        }
                    });
        }
        return new MediInfoDto(medications, diseases);
    }
}