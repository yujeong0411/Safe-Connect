package c207.camference.api.request.dispatchstaff;

import lombok.Getter;

@Getter
public class PatientTransferRequest {
    private Integer dispatchId;
    private Integer hospitalId;
    private Integer patientId;
}
