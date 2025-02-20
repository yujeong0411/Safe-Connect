package c207.camference.api.response.report;

import c207.camference.api.response.hospital.HospitalResponse;
import c207.camference.db.entity.report.Transfer;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class TransferDResponse {
    private Integer transferId;
    private LocalDateTime transferAcceptAt;
    private LocalDateTime transferArriveAt;
    private Integer hospitalId;
    private String hospitalName;

    public TransferDResponse(Transfer transfer) {
        this.transferId = transfer.getTransferId();
        this.transferAcceptAt = transfer.getTransferAcceptAt();
        this.transferArriveAt = transfer.getTransferArriveAt();
        this.hospitalId = transfer.getHospitalId();
        this.hospitalName = transfer.getHospital().getHospitalName();
    }
}
