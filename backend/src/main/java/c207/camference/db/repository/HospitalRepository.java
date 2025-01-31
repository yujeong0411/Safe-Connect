package c207.camference.db.repository;

import c207.camference.db.entity.hospital.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HospitalRepository extends JpaRepository<Hospital, Integer> {
    Optional<Hospital> findByHospitalLoginId(String hospitalLoginId);
}
