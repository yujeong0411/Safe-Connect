package c207.camference.api.response.report;

import c207.camference.db.entity.report.Dispatch;
import c207.camference.db.entity.report.Transfer;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class DispatchResponse {
    private Integer dispatchId;
    private Boolean dispatchIsTransfer;
    private LocalDateTime dispatchCreatedAt;
    private LocalDateTime dispatchDepartAt;
    private String callerPhone;
    private LocalDateTime dispatchArriveAt;// transfer 정보 추가

    // Transfer 정보 (optional)
    private TransferResponse transfer;

    public DispatchResponse(Dispatch dispatch, Transfer transfer) {
        // Dispatch 정보 설정
        this.callerPhone = dispatch.getCall().getCaller().getCallerPhone();
        this.dispatchId = dispatch.getDispatchId();
        this.dispatchIsTransfer = dispatch.getDispatchIsTransfer();
        this.dispatchCreatedAt = dispatch.getDispatchCreateAt();
        this.dispatchDepartAt = dispatch.getDispatchDepartAt();
        this.dispatchArriveAt = dispatch.getDispatchArriveAt();

        // Transfer 정보가 있는 경우에만 설정
        if (transfer != null) {
            this.transfer = new TransferResponse(transfer);
        }
    }
}