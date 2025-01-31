package c207.camference.api.service.medi;

import c207.camference.api.dto.medi.MediCategoryDto;
import c207.camference.api.dto.medi.MediDto;
<<<<<<< HEAD
import c207.camference.db.entity.others.Medi;
import c207.camference.db.entity.others.MediCategory;
import c207.camference.db.repository.MediCategoryRepository;
import c207.camference.db.repository.MediRepository;
import c207.camference.db.repository.UserMediDetailRepository;
=======
import c207.camference.db.entity.*;
import c207.camference.db.repository.MediCategoryRepository;
import c207.camference.db.repository.MediRepository;
import c207.camference.db.repository.UserMediDetailRepository;
import c207.camference.db.repository.UserRepository;
>>>>>>> 9494a876eee1f3528c5ef7a68f5a37c7b2574c62
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
<<<<<<< HEAD
=======
import java.util.Map;
import java.util.Optional;
>>>>>>> 9494a876eee1f3528c5ef7a68f5a37c7b2574c62
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MediService {

    private final UserMediDetailRepository userMediDetailRepository;
    private final MediCategoryRepository mediCategoryRepository;
    private final MediRepository mediRepository;

    // 약물, 질환 전체 조회 (카테고리별로)
    public List<MediCategoryDto> getMediList() {
        // 활성화된 카테고리 조회
        List<MediCategory> categories = mediCategoryRepository.findByMediCategoryIsActiveTrue();

        List<MediCategoryDto> mediCategoryDtos = new ArrayList<>();
        for (MediCategory category : categories) {
            // 각 카테고리 별 활성화된 의약, 질환 조회
            List<Medi> medis = mediRepository.findByMediCategory_MediCategoryIdAndMediIsActiveTrue(category.getMediCategoryId());

            // Medi -> MediDto -> MediCategoryDto
            addMediCategoryDto(category, medis, mediCategoryDtos);
        }
        return mediCategoryDtos;
    }


    // mediCategoryDto 객체 생성 후 값 세팅
    static void addMediCategoryDto(MediCategory category, List<Medi> medis, List<MediCategoryDto> mediCategoryDtos) {
        List<MediDto> mediDtos = getMediDtos(medis);

        mediCategoryDtos.add(MediCategoryDto.builder()
                .categoryId(category.getMediCategoryId())
                .categoryName(category.getMediCategoryName())
                .mediList(mediDtos)
                .build());
    }

    // Medi -> MediDto
    private static List<MediDto> getMediDtos(List<Medi> medis) {
        List<MediDto> mediDtos = medis.stream() // List<Medi> -> Stream<Medi>
                .map(medi -> MediDto.builder() // medi: stream의 각 요소. List<MediDto>에서 하나씩 꺼낸 객체
                        .mediId(medi.getMediId())
                        .mediName(medi.getMediName()).build()) // dto 변환 끝
                .collect(Collectors.toList()); // stream 각 요소를 List로 모음
        return mediDtos;
    }
}
