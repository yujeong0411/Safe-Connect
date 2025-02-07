package c207.camference.db.repository.openapi;

import c207.camference.db.entity.etc.Medi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MediRepository extends JpaRepository<Medi, Integer> {
    // mediIsActice = true 인 약물|질환 조회
    List<Medi> findByMediCategory_MediCategoryIdAndMediIsActiveTrue(Integer mediCategoryId);
}
