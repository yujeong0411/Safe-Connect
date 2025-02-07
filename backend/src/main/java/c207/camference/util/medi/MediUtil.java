package c207.camference.util.medi;

import c207.camference.api.dto.medi.MediCategoryDto;
import c207.camference.api.dto.medi.MediDto;
import c207.camference.db.entity.etc.Medi;
import c207.camference.db.entity.etc.MediCategory;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class MediUtil {

    // 통일성 있는 응답
    public static List<MediCategoryDto> createMediCategoryResponse(List<Medi> medis) {
        // 카테고리별로 Medi 나누기
        Map<MediCategory, List<Medi>> medisByCategory = new HashMap<>();

        for (Medi medi : medis) {
            MediCategory category = medi.getMediCategory();
            if (!medisByCategory.containsKey(category)) {
                medisByCategory.put(category, new ArrayList<>());
            }
            medisByCategory.get(category).add(medi);
        }

        // result: 카테고리별로 나눠서 Medi 응답 보내기
        List<MediCategoryDto> response = new ArrayList<>();
        for (Map.Entry<MediCategory, List<Medi>> entry : medisByCategory.entrySet()) {
            MediCategory category = entry.getKey();
            List<Medi> catogryMedis = entry.getValue();

            List<MediDto> mediDtos = new ArrayList<>();
            for (Medi medi : catogryMedis) {
                MediDto mediDto = MediDto.builder()
                        .mediId(medi.getMediId())
                        .mediName(medi.getMediName())
                        .mediCategory(medi.getMediCategory())
                        .build();
                mediDtos.add(mediDto);
            }

            MediCategoryDto categoryDto = MediCategoryDto.builder()
                    .categoryId(category.getMediCategoryId())
                    .categoryName(category.getMediCategoryName())
                    .mediList(mediDtos)
                    .build();

            response.add(categoryDto);
        }
        return response;
    }


    // mediCategoryDto 객체 생성 후 값 세팅
    public static void addMediCategoryDto(MediCategory category, List<Medi> medis, List<MediCategoryDto> mediCategoryDtos) {
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
