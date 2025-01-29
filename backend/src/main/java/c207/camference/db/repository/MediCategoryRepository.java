package c207.camference.db.repository;

import c207.camference.db.entity.MediCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MediCategoryRepository extends JpaRepository<MediCategory, Integer> {
    List<MediCategory> findByMediCategoryIsActiveTrue();
}
