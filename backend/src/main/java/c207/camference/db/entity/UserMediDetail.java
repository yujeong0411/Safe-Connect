package c207.camference.db.entity;

import jakarta.persistence.*;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
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
    private List<UserMediMapping> userMediMappings = new ArrayList<>();

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


    // 의약질환 매핑 정보 업데이트
    public void updateMediMappings(List<Medi> medis) {
        // 기존 매핑 제거
        userMediMappings.clear();

        // 새로운 매핑 추가
        medis.forEach(medi -> userMediMappings.add(new UserMediMapping(this, medi)));
    }
}
