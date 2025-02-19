package c207.camference.api.response.hospital;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AcceptedHospitalResponse {
    private Integer transferId;
    private Integer hospitalId;
    private String hospitalName;
    private Double latitude;
    private Double longitude;
}
