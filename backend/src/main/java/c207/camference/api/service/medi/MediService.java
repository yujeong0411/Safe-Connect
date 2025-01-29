package c207.camference.api.service.medi;

import c207.camference.api.dto.medi.MediCategoryDto;
import c207.camference.api.dto.medi.MediDto;
import c207.camference.db.entity.Medi;
import c207.camference.db.entity.MediCategory;
import c207.camference.db.repository.MediCategoryRepository;
import c207.camference.db.repository.MediRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MediService {

    private final MediRepository mediRepository;
    private final MediCategoryRepository mediCategoryRepository;


/*
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
*/

    // 약물, 질환 전체 조회
    public List<MediCategoryDto> getMediList() {
        // 활성화된 카테고리 조회
        List<MediCategory> categories = mediCategoryRepository.findByMediCategoryIsActiveTrue();

        List<MediCategoryDto> mediCategoryDtos = new ArrayList<>();
        for (MediCategory category : categories) {
            // 각 카테고리 별 활성화된 의약, 질환 조회
            List<Medi> medis = mediRepository.findByMediCategory_MediCategoryIdAndMediIsActiveTrue(category.getMediCategoryId());

            // dto 변환
            List<MediDto> mediDtos = medis.stream() // List<Medi> -> Stream<Medi>
                    .map(medi -> MediDto.builder() // medi: stream의 각 요소. List<Medi>에서 하나씩 꺼낸 객체
                            .mediId(medi.getMediId())
                            .mediName(medi.getMediName()).build()) // dto 변환 끝
                    .collect(Collectors.toList()); // stream 각 요소를 List로 모음

            mediCategoryDtos.add(MediCategoryDto.builder()
                    .categoryId(category.getMediCategoryId())
                    .categoryName(category.getMediCategoryName())
                    .mediList(mediDtos)
                    .build());
        }
        return mediCategoryDtos;
    }
}
