package c207.camference.db.repository.report;

import c207.camference.db.entity.firestaff.DispatchGroup;
import c207.camference.db.entity.report.Dispatch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DispatchRepository extends JpaRepository<Dispatch, Integer> {
    List<Dispatch> findByDispatchGroup(DispatchGroup dispatchGroup);
    Optional<Dispatch> findByDispatchId(int dispatchId);
}
