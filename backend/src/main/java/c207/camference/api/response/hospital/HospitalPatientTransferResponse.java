package c207.camference.api.response.hospital;

import c207.camference.api.dto.medi.MediCategoryDto;
import c207.camference.api.dto.medi.MediDto;
import c207.camference.db.entity.etc.Medi;
import c207.camference.db.entity.patient.Patient;
import c207.camference.db.entity.report.Dispatch;
import c207.camference.db.entity.users.User;
import c207.camference.db.entity.users.UserMediDetail;
import c207.camference.db.entity.users.UserMediMapping;
import c207.camference.db.repository.users.UserMediDetailRepository;
import lombok.Getter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Getter
public class HospitalPatientTransferResponse {

    private final Integer dispatchId;
    private final Patient patient;
    private List<MediCategoryDto> mediInfo;

    public HospitalPatientTransferResponse(Dispatch dispatch, Patient patient, UserMediDetailRepository userMediDetailRepository) {
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
                    .patientSymptom(patient.getPatientSymptom())
                .build();

        // user면 medi 넣어주기
        if (patient.getPatientIsUser()) {
            User user = patient.getUser();
            UserMediDetail userMediDetail = userMediDetailRepository.findByUser(user);
            if (userMediDetail!=null) {
                // 활성화된 medi만
                List<Medi> activeMedis = new ArrayList<>();
                for (UserMediMapping mapping : userMediDetail.getUserMediMappings()) {
                    if (mapping.getMediIsActive()) {
                        activeMedis.add(mapping.getMedi());
                    }
                }

                // 카테고리별로
                Map<String, List<Medi>> groupedMedis = new HashMap<>();
                for (Medi medi : activeMedis) {
                    String categoryName = medi.getMediCategory().getMediCategoryName();
                    groupedMedis.computeIfAbsent(categoryName, k -> new ArrayList<>()).add(medi);
                }

                this.mediInfo = new ArrayList<>();
                for (Map.Entry<String, List<Medi>> entry : groupedMedis.entrySet()) {
                    MediCategoryDto categoryDto = MediCategoryDto.builder()
                            .categoryId(entry.getValue().get(0).getMediCategory().getMediCategoryId())
                            .categoryName(entry.getKey())
                            .mediList(entry.getValue().stream()
                                    .map(medi -> new MediDto(medi.getMediId(), medi.getMediName()))
                                    .collect(Collectors.toList()))
                            .build();
                    this.mediInfo.add(categoryDto);
                }
            }
        }
    }
}
