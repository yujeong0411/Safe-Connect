package c207.camference.db.repository.report;

import c207.camference.db.entity.report.Call;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CallRepository extends JpaRepository<Call, Integer> {
    List<Call> findCallsByFireStaff_FireStaffId(int fireStaffId);
    Call findCallByCallId(int callId);
}
