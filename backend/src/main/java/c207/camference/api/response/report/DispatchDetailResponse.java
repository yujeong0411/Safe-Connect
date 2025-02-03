package c207.camference.api.response.report;

import c207.camference.db.entity.report.Dispatch;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class DispatchDetailResponse {
    private String fireDeptName;
    private String callSummary;

    public DispatchDetailResponse(Dispatch dispatch) {
        this.fireDeptName = dispatch.getDispatchGroup().getFireDept().getFireDeptName();
        this.callSummary = dispatch.getCall().getCallSummary();
    }
}
