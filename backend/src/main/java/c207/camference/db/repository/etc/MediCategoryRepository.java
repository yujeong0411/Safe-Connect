package c207.camference.db.repository.etc;

import c207.camference.db.entity.etc.MediCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MediCategoryRepository extends JpaRepository<MediCategory, Integer> {
    List<MediCategory> findByMediCategoryIsActiveTrue();
}
