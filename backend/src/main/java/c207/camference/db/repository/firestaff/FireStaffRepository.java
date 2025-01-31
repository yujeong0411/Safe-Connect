package c207.camference.db.repository.firestaff;

import c207.camference.db.entity.firestaff.FireStaff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FireStaffRepository extends JpaRepository<FireStaff, Integer> {
    Optional<FireStaff> findByFireStaffLoginId(String fireStaffLoginId);
}
