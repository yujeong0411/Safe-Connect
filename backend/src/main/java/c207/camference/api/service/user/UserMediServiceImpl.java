package c207.camference.api.service.user;

import c207.camference.api.dto.medi.MediCategoryDto;
import c207.camference.db.entity.etc.Medi;
import c207.camference.db.entity.etc.MediCategory;
import c207.camference.db.entity.users.User;
import c207.camference.db.entity.users.UserMediDetail;
import c207.camference.db.entity.users.UserMediMapping;
import c207.camference.db.repository.etc.MediCategoryRepository;
import c207.camference.db.repository.openapi.MediRepository;
import c207.camference.db.repository.users.UserMediDetailRepository;
import c207.camference.db.repository.users.UserRepository;
import c207.camference.util.jwt.JWTUtil;
import c207.camference.util.medi.MediUtil;
import c207.camference.util.response.ResponseUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserMediServiceImpl implements UserMediService {

    private final JWTUtil jwtUtil;

    private final UserRepository userRepository;
    private final UserMediDetailRepository userMediDetailRepository;
    private final MediRepository mediRepository;
    private final MediCategoryRepository mediCategoryRepository;


    @Override
    @Transactional
    public ResponseEntity<?> getUserMediInfo(String token) {
        User user = getUserFromToken(token);

        UserMediDetail userMediDetail = userMediDetailRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("User medi detail not found"));

        List<Medi> medis = getUserActiveMedis(userMediDetail);
        List<MediCategoryDto> response = MediUtil.createMediCategoryResponse(medis);
        return ResponseEntity.ok().body(ResponseUtil.success(response, "회원의 복용약물, 기저질환 조회 성공"));
    }

    @Override
    @Transactional
    public ResponseEntity<?> saveMediInfo(String token, List<Integer> mediIds) {
        User user = getUserFromToken(token);

        // userMediDetail 조회 | 생성
        UserMediDetail userMediDetail = userMediDetailRepository.findByUser(user)
                .orElseGet(() -> createUserMediDetail(user));

        List<Medi> medis = mediRepository.findAllById(mediIds);
        userMediDetail.createMediMappings(medis);
        userMediDetailRepository.save(userMediDetail);

        List<MediCategoryDto> response = MediUtil.createMediCategoryResponse(medis);
        return ResponseEntity.ok().body(ResponseUtil.success(response, "회원의 복용약물, 기저질환 저장 성공"));
    }

    @Override
    @Transactional
    public ResponseEntity<?> updateMediInfo(String token, List<Integer> mediIds) {
        User user = getUserFromToken(token);

        // userMediDetail 조회 | 생성
        UserMediDetail userMediDetail = userMediDetailRepository.findByUser(user)
                .orElseGet(() -> createUserMediDetail(user));

        List<Medi> medis = mediRepository.findAllById(mediIds);
        userMediDetail.updateMediMappings(medis); // 매핑 정보 업데이트

        List<Medi> currentMediInfo = getUserActiveMedis(userMediDetail);
        List<MediCategoryDto> response = MediUtil.createMediCategoryResponse(currentMediInfo);
        return ResponseEntity.ok().body(ResponseUtil.success(response, "회원의 복용약물, 기저질환 수정 성공"));
    }

    @Override
    @Transactional
    public ResponseEntity<?> getMediList() {
        List<MediCategory> categories = mediCategoryRepository.findByMediCategoryIsActiveTrue();

        List<MediCategoryDto> mediCategoryDtos = new ArrayList<>();
        for (MediCategory category : categories) {
            List<Medi> medis = mediRepository.findByMediCategory_MediCategoryIdAndMediIsActiveTrue(category.getMediCategoryId());

            // Medi -> MediDto -> MediCategoryDto
            MediUtil.addMediCategoryDto(category, medis, mediCategoryDtos);
        }
        return ResponseEntity.ok().body(ResponseUtil.success(mediCategoryDtos, "약물, 기저질환 전체 조회 성공"));
    }

    // 토큰을 통해 유저 객체 가져오기
    public User getUserFromToken(String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        if (jwtUtil.isExpired(token)) {
            throw new IllegalArgumentException("만료된 토큰입니다.");
        }

        String userEmail = jwtUtil.getLoginId(token);

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

}
