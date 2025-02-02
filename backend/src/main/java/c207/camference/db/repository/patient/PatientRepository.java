package c207.camference.db.repository.patient;

import c207.camference.db.entity.patient.Patient;
import c207.camference.db.entity.report.Transfer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient,Integer> {
    Optional<Patient> findByTransferId(Integer transferId);
}
