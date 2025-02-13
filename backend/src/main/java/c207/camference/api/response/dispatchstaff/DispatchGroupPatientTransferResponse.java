package c207.camference.api.response.dispatchstaff;

import c207.camference.db.entity.patient.Patient;
import c207.camference.db.entity.report.Dispatch;
import lombok.Getter;

import java.util.List;

@Getter
public class DispatchGroupPatientTransferResponse {
    private Integer dispatchId;
    private List<String> hospitalNames;
    private Integer patientId;

    public DispatchGroupPatientTransferResponse(Dispatch dispatch, List<String> hospitalNames, Patient patient) {
        this.dispatchId = dispatch.getDispatchId();
        this.hospitalNames = hospitalNames;
        this.patientId = patient.getPatientId();
    }
}
