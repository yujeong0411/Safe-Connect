package c207.camference.db.repository.firestaff;

import c207.camference.db.entity.firestaff.DispatchGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DispatchGroupRepository extends JpaRepository<DispatchGroup, Integer> {
}
