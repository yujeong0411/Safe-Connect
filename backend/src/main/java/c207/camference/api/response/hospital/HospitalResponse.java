package c207.camference.api.response.hospital;

import c207.camference.db.entity.hospital.Hospital;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class HospitalResponse {
    private String hospitalName;
    private String locationPoint;  // String으로 변환된 위치 정보

    public HospitalResponse(Hospital hospital) {
        this.hospitalName = hospital.getHospitalName();
        this.locationPoint = hospital.getHospitalLocation().toString();
    }
}
