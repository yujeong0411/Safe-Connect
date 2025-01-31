package c207.camference.db.entity.users;

import c207.camference.db.entity.others.Medi;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
// user의 의약질환 정보 관리 테이블
public class UserMediDetail {

    @Id
    private Integer userMediDetailId;

    @OneToOne
    @MapsId // user_medi_detail_id = user_id
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // cascade = CascadeType.ALL: user_medi_detail 엔티티의 변경이 user_medi_mapping에도 전파된다.
    // orphanRemoval = true: 매핑 관계가 끊어진 user_medi_mapping 엔티티는 자동 삭제된다.
    @OneToMany(mappedBy = "userMediDetail", cascade = CascadeType.ALL, orphanRemoval = true)
    private final List<UserMediMapping> userMediMappings = new ArrayList<>();

/*
    // 필요 없다고 판단되어 주석처리
    @Column(nullable = false)
    private Boolean userDetailIsActive = true;
*/

    @CreatedDate
    @Column(nullable = false)
    private LocalDateTime userMediDetailCreatedAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime userMediDetailUpdatedAt;

    // user 받는 생성자
    public UserMediDetail(User user) {
        this.user = user;
    }

    // 의약질환 매핑 생성
    public void createMediMappings(List<Medi> medis) {
        for (Medi medi : medis) {
            boolean exists = userMediMappings.stream()
                    .anyMatch(mapping -> mapping.getMedi().equals(medi));
            // 중복 방지
            if (!exists) {
                userMediMappings.add(new UserMediMapping(this, medi));
            }
        }
    }

    // 의약짏환 매핑 수정. 파라미터는 request로 들어온 medi 객체 리스트
    public void updateMediMappings(List<Medi> medis) {
        for (UserMediMapping mapping : userMediMappings) {
            // 기존에 있던 의약질환이 request에 포함되어 있지 않다면(=회원이 선택하지 않았다) 비활성화
            if (!medis.contains(mapping.getMedi())) {
                mapping.deactivate();
            }
        }

        for (Medi medi : medis) {
            // 기존에 있던 medi는 true 반환
            boolean exists = userMediMappings.stream()
                    .anyMatch(mapping -> mapping.getMedi().equals(medi));
            // 기존에 없던 medi는 추가해줌
            if (!exists) {
                userMediMappings.add(new UserMediMapping(this, medi));
            } else {
                // 기존에 있었지만 비활성화된 medi는 다시 활성화
                userMediMappings.stream()
                        .filter(mapping -> mapping.getMedi().equals(medi))
                        .forEach(mapping -> mapping.activate());
            }
        }
    }
}
