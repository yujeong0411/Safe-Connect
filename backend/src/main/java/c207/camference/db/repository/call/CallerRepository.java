package c207.camference.db.repository.call;

import c207.camference.db.entity.call.Caller;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CallerRepository extends JpaRepository<Caller, Integer> {
}
