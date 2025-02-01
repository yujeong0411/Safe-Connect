package c207.camference.db.repository.openapi;

import c207.camference.db.entity.etc.Aed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AedRepository extends JpaRepository<Aed, Integer> {
}

