package c207.camference.db.repository.report;

import c207.camference.db.entity.firestaff.DispatchGroup;
import c207.camference.db.entity.hospital.Hospital;
import c207.camference.db.entity.report.Transfer;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransferRepository extends JpaRepository<Transfer, Integer> {
    List<Transfer> findByDispatchGroup(DispatchGroup dispatchGroup);

    @EntityGraph(attributePaths = {"dispatchGroup", "hospital"})
    Optional<Transfer> findByTransferId(Integer id);
    List<Transfer> findByHospital(Hospital hospital);
}
