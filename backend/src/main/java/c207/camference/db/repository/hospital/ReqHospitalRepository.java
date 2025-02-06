package c207.camference.db.repository.hospital;

import c207.camference.db.entity.hospital.Hospital;
import c207.camference.db.entity.hospital.ReqHospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReqHospitalRepository extends JpaRepository<ReqHospital, Integer> {
    List<ReqHospital> findReqHospitalsByDispatchId(int dispatchId);

    List<ReqHospital> findReqHospitalsByHospital(Hospital hospital);
}
