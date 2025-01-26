package c207.camference.api.service.medi;

import c207.camference.api.dto.medi.MediDto;
import c207.camference.db.entity.Medi;
import c207.camference.db.entity.MediCategory;
import c207.camference.db.repository.MediCategoryRepository;
import c207.camference.db.repository.MediRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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
            mediRepository.save(medi);
        }
    }

    // 복용약물 조회
    public List<MediDto> getMedications() {
        List<Medi> medications = mediRepository.findByMediCategory_MediCategoryIdAndMediIsActiveTrue(1);
        List<MediDto> mediDtos = new ArrayList<>();
        for (Medi medication : medications) {
            mediDtos.add(convertToDto(medication));
        }
        return mediDtos;
    }

    // 기저질환 조회
    public List<MediDto> getDiseases() {
        List<Medi> diseases = mediRepository.findByMediCategory_MediCategoryIdAndMediIsActiveTrue(2);
        List<MediDto> mediDtos = new ArrayList<>();
        for (Medi disease : diseases) {
            mediDtos.add(convertToDto(disease));
        }
        return mediDtos;
    }

    private MediDto convertToDto(Medi medi) {
        MediDto mediDto = new MediDto();
        mediDto.setMediId(medi.getMediId());
        mediDto.setMediName(medi.getMediName());
        mediDto.setMediIsActive(medi.getMediIsActive());
        return mediDto;
    }

}
