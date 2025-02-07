package c207.camference.api.request.dispatchstaff;

import c207.camference.db.entity.hospital.Hospital;
import c207.camference.db.entity.report.Dispatch;

public class PatientTransferRequest {
    private Integer dispatchId;
    private Hospital hospital;

    public PatientTransferRequest(Dispatch dispatch, Hospital hospital) {
        this.dispatchId = dispatch.getDispatchId();
        this.hospital = Hospital.builder()
                .hospitalId(hospital.getHospitalId())
                .hospitalName(hospital.getHospitalName())
                .build();
    }
}
