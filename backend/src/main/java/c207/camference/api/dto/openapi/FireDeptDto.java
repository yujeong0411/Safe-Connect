package c207.camference.api.dto.openapi;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FireDeptDto {

    private String fireDeptName;
    private String fireDeptPhone;
    private String fireDeptRegion;

}
