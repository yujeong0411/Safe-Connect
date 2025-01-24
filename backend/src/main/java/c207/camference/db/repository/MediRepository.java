package c207.camference.db.repository;

import c207.camference.db.entity.Medi;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MediRepository extends JpaRepository<Medi, Integer> {
}
