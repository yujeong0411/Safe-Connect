package c207.camference.db.repository;

import c207.camference.db.entity.others.FireDept;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FireDeptRepository extends JpaRepository<FireDept, Integer> {
    FireDept findByFireDeptId(int fireDeptId);
}
