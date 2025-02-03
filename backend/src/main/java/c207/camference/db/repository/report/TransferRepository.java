package c207.camference.db.repository.report;

import c207.camference.db.entity.firestaff.DispatchGroup;
import c207.camference.db.entity.report.Transfer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransferRepository extends JpaRepository<Transfer, Integer> {
    List<Transfer> findByDispatchGroup(DispatchGroup dispatchGroup);
    Optional<Transfer> findByTransferId(Integer id);
}
