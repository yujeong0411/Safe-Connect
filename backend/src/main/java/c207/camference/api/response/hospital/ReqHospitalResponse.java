package c207.camference.api.response.hospital;

import c207.camference.db.entity.hospital.Hospital;
import c207.camference.db.entity.hospital.ReqHospital;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class ReqHospitalResponse {
    private HospitalResponse hospital;
    private LocalDateTime reqHospitalCreatedAt;

    public ReqHospitalResponse(ReqHospital reqHospital) {
        this.hospital = new HospitalResponse(reqHospital.getHospital());
        this.reqHospitalCreatedAt = reqHospital.getReqHospitalCreatedAt();
    }
}
