package c207.camference.api.response.dispatchstaff;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class DispatchGroupResponse {

    private Integer dispatchGroupId;
    private Integer fireDeptId;
    private String fireDeptName;

}
