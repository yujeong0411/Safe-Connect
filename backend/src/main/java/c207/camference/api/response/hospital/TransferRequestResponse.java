package c207.camference.api.response.hospital;

import c207.camference.api.response.user.PatientSimpleResponse;
import c207.camference.db.entity.hospital.ReqHospital;
import c207.camference.db.entity.patient.Patient;
import c207.camference.db.repository.hospital.ReqHospitalRepository;
import c207.camference.db.repository.patient.PatientRepository;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor
public class TransferRequestResponse {
    private Integer patientId;
    private Integer dispatchId;
    private String fireDeptName;            // 소방서 이름
    private LocalDateTime reqHospitalCreatedAt;  // 요청 시각
    private Boolean dispatchIsTransfer;      // 이송 여부
    private List<PatientSimpleResponse> patients;  // 환자 목록
    private Boolean dispatchTransferAccepted;

    private TransferRequestResponse(ReqHospital reqHospital, List<Patient> patients) {
        this.fireDeptName = reqHospital.getDispatch().getDispatchGroup().getFireDept().getFireDeptName();
        this.reqHospitalCreatedAt = reqHospital.getReqHospitalCreatedAt();
        this.dispatchIsTransfer = reqHospital.getDispatch().getDispatchIsTransfer();
        this.dispatchId = reqHospital.getDispatch().getDispatchId();
        this.dispatchTransferAccepted = reqHospital.getDispatch().getDispatchTransferAccepted();
        this.patients = patients.stream()
                .map(patient -> PatientSimpleResponse.builder()
                        .patientPreKtas(patient.getPatientPreKtas())
                        .patientGender(patient.getPatientGender())
                        .patientAge(patient.getPatientAge())
                        .patientSymptom(patient.getPatientSympthom())
                        .patientId(patient.getPatientId())
                        .build())
                .collect(Collectors.toList());
    }

    public static List<TransferRequestResponse> of(Integer hospitalId,
                                                   ReqHospitalRepository reqHospitalRepository,
                                                   PatientRepository patientRepository) {
        List<ReqHospital> reqHospitals = reqHospitalRepository.findAllByHospitalId((hospitalId));

        return reqHospitals.stream()
                .map(reqHospital -> {
                    List<Patient> patients = patientRepository.findAllByDispatchId(reqHospital.getDispatchId());
                    return new TransferRequestResponse(reqHospital, patients);
                })
                .collect(Collectors.toList());
    }
}