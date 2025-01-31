package c207.camference.db.repository;

import c207.camference.db.entity.others.Call;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CallRepository extends JpaRepository<Call, Integer> {
    List<Call> findCallsByFireStaff_FireStaffId(int fireStaffId);
    Call findCallByCallId(int callId);
}
