package c207.camference.api.request.dispatchstaff;

import lombok.Getter;

import java.util.List;

@Getter
public class PatientTransferRequest {
    private Integer dispatchId;
    private List<Integer> hospitalIds;
    private Integer patientId;
}
