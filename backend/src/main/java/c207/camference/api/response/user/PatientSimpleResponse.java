package c207.camference.api.response.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientSimpleResponse {
    private Integer patientId;
    private String patientPreKtas;    // 환자 사전 중증도 분류
    private Character patientGender;     // 환자 성별
    private Integer patientAge;        // 환자 연령대
    private String patientSymptom;       // 환자 증상
    private String patientPhone;
}
