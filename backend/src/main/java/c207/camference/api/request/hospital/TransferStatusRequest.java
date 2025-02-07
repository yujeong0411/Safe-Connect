package c207.camference.api.request.hospital;

import lombok.Getter;

@Getter
public class TransferStatusRequest {
    private Integer patientId;
    private String status;
}
