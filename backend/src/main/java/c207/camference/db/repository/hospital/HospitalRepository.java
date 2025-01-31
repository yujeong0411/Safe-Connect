package c207.camference.db.repository.hospital;

import c207.camference.db.entity.hospital.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Integer> {
    Optional<Hospital> findByHospitalLoginId(String hospitalLoginId);
}
