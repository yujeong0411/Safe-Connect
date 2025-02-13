package c207.camference.api.response.report;

import c207.camference.api.dto.medi.MediCategoryDto;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
public class CallUpdateResponse {

    // 환자 == 유저
    private String userName;
    private Character userGender;
    private String userAge;
    private String userPhone;
    private String userProtectorPhone;
    private List<MediCategoryDto> mediInfo;

    // update info
    private String symptom;
    private String callSummary;
    private String callText;

    private Integer patientId;

}
