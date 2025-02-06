package c207.camference.db.repository.patient;

import c207.camference.db.entity.patient.Patient;
import c207.camference.db.entity.report.Transfer;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient,Integer> {

    @EntityGraph(attributePaths = {"call", "dispatch", "user"})
    Patient findByTransfer(Transfer transfer);
    Optional<Patient> findByTransferId(Integer transferId);

    List<Patient> findAllByDispatchId(Integer dispatchId);
}
