package c207.camference.api.service.medi;

import c207.camference.db.entity.Medi;
import c207.camference.db.entity.MediCategory;
import c207.camference.db.repository.MediCategoryRepository;
import c207.camference.db.repository.MediRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MediService {
    private final MediRepository mediRepository;
    private final MediCategoryRepository mediCategoryRepository;

    @Autowired
    public MediService(MediRepository mediRepository, MediCategoryRepository mediCategoryRepository) {
        this.mediRepository = mediRepository;
        this.mediCategoryRepository = mediCategoryRepository;
    }

    public void saveMedicationData(List<String> mediNames) {
        // 복용약물 카테고리 조회
        MediCategory mediCategory = mediCategoryRepository.findById(1)
                .orElseThrow(() -> new IllegalArgumentException("Invalid MediCategory ID: 1"));

        for (String mediName : mediNames) {
            Medi medi = new Medi();
            medi.setMediName(mediName);
            medi.setMediIsActive(true);
            medi.setMediCategory(mediCategory);
            medi.setMediCategory(mediCategory);
            mediRepository.save(medi);
        }
    }

}
