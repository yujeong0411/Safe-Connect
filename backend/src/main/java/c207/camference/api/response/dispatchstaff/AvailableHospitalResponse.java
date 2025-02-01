package c207.camference.api.response.dispatchstaff;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AvailableHospitalResponse {

    private String hospitalName;
    private String hospitalPhone;
    private Integer hospitalCapacity;
//    private String HospitalAddress;
}
