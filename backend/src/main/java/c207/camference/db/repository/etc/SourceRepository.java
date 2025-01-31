package c207.camference.db.repository.etc;

import c207.camference.db.entity.etc.Source;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SourceRepository extends JpaRepository<Source, Integer> {
}
