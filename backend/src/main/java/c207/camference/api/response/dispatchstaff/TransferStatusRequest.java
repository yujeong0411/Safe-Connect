package c207.camference.api.response.dispatchstaff;

import lombok.Getter;

@Getter
public class TransferStatusRequest {
    private Integer patientId;
    private String status;
}
