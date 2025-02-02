package c207.camference.api.dto.openapi;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HospitalDto {

    private String hospitalLoginId;
    @JsonIgnore // 응답으로 보낼 때는 안보이게
    private String hospitalPassword;
    private String hospitalName;
    private String hospitalAddress;
    private String hospitalPhone;
    @JsonIgnore
    private double hospitalLatitude;
    @JsonIgnore
    private double hospitalLongitude;

}
