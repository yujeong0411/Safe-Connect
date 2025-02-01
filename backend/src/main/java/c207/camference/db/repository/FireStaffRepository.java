package c207.camference.db.repository;

import c207.camference.db.entity.firestaff.FireStaff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FireStaffRepository extends JpaRepository<FireStaff, Integer> {
    Optional<FireStaff> findByFireStaffLoginId(String fireStaffLoginId);
}
