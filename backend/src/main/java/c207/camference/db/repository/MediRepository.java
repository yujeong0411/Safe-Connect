package c207.camference.db.repository;

import c207.camference.db.entity.Medi;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MediRepository extends JpaRepository<Medi, Integer> {
    // mediIsActice = true 인 약물/질환만 조회
    List<Medi> findByMediCategory_MediCategoryIdAndMediIsActiveTrue(Integer mediCategoryId);
}
