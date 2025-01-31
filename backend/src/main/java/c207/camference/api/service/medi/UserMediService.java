package c207.camference.api.service.medi;

import c207.camference.api.dto.medi.MediCategoryDto;
import c207.camference.db.entity.UserMediDetail;
import c207.camference.db.entity.UserMediMapping;
import c207.camference.db.entity.others.Medi;
import c207.camference.db.entity.others.MediCategory;
import c207.camference.db.entity.users.User;
import c207.camference.db.repository.MediRepository;
import c207.camference.db.repository.UserMediDetailRepository;
import c207.camference.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static c207.camference.api.service.medi.MediService.addMediCategoryDto;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserMediService {

    private final UserRepository userRepository;
    private final UserMediDetailRepository userMediDetailRepository;
    private final MediRepository mediRepository;
    private final MediService mediService;

    // 회원의 약물, 질환 조회
    public List<MediCategoryDto> getUserMediInfo(String userEmail) {
        User user = getUserByEmail(userEmail);

        // user의 UserMediDetail 조회
        UserMediDetail userMediDetail = userMediDetailRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // UserMediMapping에서 Medi 리스트 가져오기
        List<Medi> medis = getUserActiveMedis(userMediDetail);

        return createMediCategoryResponse(medis);
    }

    // 회원의 약물, 질환 저장
    @Transactional
    public List<MediCategoryDto> saveMediInfo(String userEmail, List<Integer> mediIds) {
        User user = getUserByEmail(userEmail);

        // userMediDetail 조회 | 생성
        UserMediDetail userMediDetail = userMediDetailRepository.findByUser(user)
                .orElseGet(() -> createUserMediDetail(user));

        List<Medi> medis = mediRepository.findAllById(mediIds); // Medi 엔티티 조회
        userMediDetail.createMediMappings(medis); // 매핑 정보 생성

        return createMediCategoryResponse(medis);
    }

    // 회원의 약물, 질환 수정
    @Transactional
    public List<MediCategoryDto> updateMediInfo(String userEmail, List<Integer> mediIds) {
        User user = getUserByEmail(userEmail);

        // userMediDetail 조회 | 생성
        UserMediDetail userMediDetail = userMediDetailRepository.findByUser(user)
                .orElseGet(() -> createUserMediDetail(user));

        List<Medi> medis = mediRepository.findAllById(mediIds);
        userMediDetail.updateMediMappings(medis); // 매핑 정보 업데이트

        // UserMediMapping에서 Medi 리스트 가져오기
        List<Medi> currentMediInfo = getUserActiveMedis(userMediDetail);

        return createMediCategoryResponse(currentMediInfo);
    }

    // 이메일로 사용자 조회
    private User getUserByEmail(String userEmail) {
        if (userEmail == null) {
            throw new IllegalArgumentException("User not found");
        }
        return userRepository.findUserByUserEmail(userEmail);
    }

    // UserMediDetail 생성
    private UserMediDetail createUserMediDetail(User user) {
        UserMediDetail userMediDetail = new UserMediDetail(user);
        return userMediDetailRepository.save(userMediDetail);
    }

    // UserMediMapping에서 Medi 리스트 가져오기
    private static List<Medi> getUserActiveMedis(UserMediDetail userMediDetail) {
        List<Medi> medis = userMediDetail.getUserMediMappings().stream()
                .filter(UserMediMapping::getMediIsActive)
                .map(UserMediMapping::getMedi) // UserMediMapping 각 객체에 getMedi() 호출
                .collect(Collectors.toList());
        return medis;
    }

    // 카테고리별로 응답 생성
    private List<MediCategoryDto> createMediCategoryResponse(List<Medi> medis) {
        Map<MediCategory, List<Medi>> medisByCategory = medis.stream()
                .collect(Collectors.groupingBy(Medi::getMediCategory));

        List<MediCategoryDto> mediCategoryDtos = new ArrayList<>();
        medisByCategory.forEach((category, categoryMedis) ->
                addMediCategoryDto(category, categoryMedis, mediCategoryDtos));

        return mediCategoryDtos;
    }
}
