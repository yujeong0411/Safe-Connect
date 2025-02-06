package c207.camference.api.response.dispatchstaff;

import c207.camference.api.response.hospital.HospitalResponse;
import c207.camference.db.entity.report.Transfer;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class TransferUpdateResponse {

    private Integer transferId;
    private HospitalResponse hospital;

    public TransferUpdateResponse(Transfer transfer) {
        this.transferId = transfer.getTransferId();
        this.hospital = new HospitalResponse(transfer.getHospital());
    }
}
