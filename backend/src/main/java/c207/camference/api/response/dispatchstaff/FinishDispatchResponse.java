package c207.camference.api.response.dispatchstaff;

import c207.camference.db.entity.firestaff.DispatchGroup;
import c207.camference.db.entity.report.Dispatch;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class FinishDispatchResponse {
    private Integer dispatchId;
    private DispatchGroupResponse dispatchGroup;

    public FinishDispatchResponse(Dispatch dispatch, DispatchGroup dispatchGroup) {
        this.dispatchId = dispatch.getDispatchId();
        this.dispatchGroup = DispatchGroupResponse.builder()
                .dispatchGroupId(dispatchGroup.getDispatchGroupId())
                .fireDeptId(dispatchGroup.getFireDeptId())
                .fireDeptName(dispatchGroup.getFireDept().getFireDeptName())
                .build();
    }
}
