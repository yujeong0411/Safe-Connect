package c207.camference.api.response.dispatchstaff;

import c207.camference.api.dto.medi.MediCategoryDto;
import c207.camference.api.dto.medi.MediDto;
import c207.camference.db.entity.etc.Medi;
import c207.camference.db.entity.patient.Patient;
import c207.camference.db.entity.users.User;
import c207.camference.db.entity.users.UserMediDetail;
import c207.camference.db.entity.users.UserMediMapping;
import c207.camference.db.repository.users.UserMediDetailRepository;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Getter
public class DispatchReportDetailResponse {
    private Integer patientId;
    private String patientName;
    private Character patientGender;
    private Integer patientAge;
    private String patientMental;
    private Integer patientSystolicBldPress;
    private Integer patientDiastolicBldPress;
    private Integer patientPulseRate;
    private Float patientTemperature;
    private Float patientSpo2;
    private Integer patientBloodSugar;
    private String patientPreKtas;
    private DispatchReportDetilaUserResponse user;
    private String patientSymptom;
    private List<MediCategoryDto> mediInfo;

    public DispatchReportDetailResponse(Patient patient, UserMediDetailRepository userMediDetailRepository) {
        this.patientId = patient.getPatientId();
        this.patientName = patient.getPatientName();
        this.patientGender = patient.getPatientGender();
        this.patientAge = patient.getPatientAge();
        this.patientMental = patient.getPatientMental();
        this.patientSystolicBldPress = patient.getPatientSystolicBldPress();
        this.patientDiastolicBldPress = patient.getPatientDiastolicBldPress();
        this.patientPulseRate = patient.getPatientPulseRate();
        this.patientTemperature = patient.getPatientTemperature();
        this.patientSpo2 = patient.getPatientSpo2();
        this.patientBloodSugar = patient.getPatientBloodSugar();
        this.patientPreKtas = patient.getPatientPreKtas();
        this.patientSymptom =patient.getPatientSymptom();
        // user면 medi 넣어주기
        if (patient.getPatientIsUser()) {
            User user = patient.getUser();
            this.user = new DispatchReportDetilaUserResponse(user);
            UserMediDetail userMediDetail = userMediDetailRepository.findByUser(user);
            if (userMediDetail != null) {
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