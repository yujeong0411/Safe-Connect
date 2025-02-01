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
    private LocalDateTime transferAcceptAt;
    private LocalDateTime transferArriveAt;
    private HospitalResponse hospital;

    public TransferResponse(Transfer transfer) {
        this.transferAcceptAt = transfer.getTransferAcceptAt();
        this.transferArriveAt = transfer.getTransferArriveAt();
        this.hospital = new HospitalResponse(transfer.getHospital());
    }
}
