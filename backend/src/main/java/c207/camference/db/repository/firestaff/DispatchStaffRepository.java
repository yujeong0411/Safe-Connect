package c207.camference.db.repository.firestaff;

import c207.camference.db.entity.firestaff.DispatchStaff;
import c207.camference.db.entity.firestaff.FireStaff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DispatchStaffRepository extends JpaRepository<DispatchStaff, Integer> {
    DispatchStaff findByFireStaff(FireStaff fireStaff);

    List<DispatchStaff> findByDispatchGroupId(Integer dispatchGroupId);
}
