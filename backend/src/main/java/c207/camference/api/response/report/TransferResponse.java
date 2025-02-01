package c207.camference.api.response.report;

import c207.camference.api.response.hospital.HospitalResponse;
import c207.camference.db.entity.firestaff.DispatchGroup;
import c207.camference.db.entity.report.Transfer;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class TransferResponse {
    private int transferId;
    private int dispatchGroupId;
    private String hospitalId;
    private int fireStaffTeamId;
    private Boolean transferIsComplete;
    private LocalDateTime transferAcceptAt;
    private LocalDateTime transferArriveAt;
    private DispatchGroup dispatchGroup;
    private HospitalResponse hospital;

    public TransferResponse(Transfer transfer) {
        this.transferId = transfer.getTransferId();
        this.dispatchGroupId = transfer.getDispatchGroupId();
        this.hospitalId = transfer.getHospitalId();
        this.fireStaffTeamId = transfer.getFireStaffTeamId();
        this.transferIsComplete = transfer.getTransferIsComplete();
        this.transferAcceptAt = transfer.getTransferAcceptAt();
        this.transferArriveAt = transfer.getTransferArriveAt();
        this.dispatchGroup = transfer.getDispatchGroup();
        this.hospital = new HospitalResponse(transfer.getHospital());
    }
}
