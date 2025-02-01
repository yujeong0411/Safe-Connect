package c207.camference.db.repository.firestaff;

import c207.camference.db.entity.firestaff.FireDept;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FireDeptRepository extends JpaRepository<FireDept, Integer> {
    FireDept findByFireDeptId(int fireDeptId);
}
