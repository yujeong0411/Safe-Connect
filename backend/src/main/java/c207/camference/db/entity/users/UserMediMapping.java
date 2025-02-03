package c207.camference.db.entity.users;

import c207.camference.db.entity.etc.Medi;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Index;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
// user와 의약질환 관계를 관리하는 중간 테이블
public class UserMediMapping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_medi_mapping_id")
    private Integer id;

    @Index(name = "idx_user_medi", columnNames = "user_id, medi_id")
    @ManyToOne(fetch = FetchType.LAZY) // 지연로딩. user_medi_mapping 엔티티 조회 시 user_medi_detail 엔티티를 즉시 가져오지 않음.
    @JoinColumn(name = "user_medi_detail_id", nullable = false) // FK
    private UserMediDetail userMediDetail; // 관계의 주인

    @ManyToOne(fetch = FetchType.LAZY) // 지연로딩. user_medi_mapping 엔티티 조회 시 medi 엔티티를 즉시 가져오지 않음.
    @JoinColumn(name = "medi_id", nullable = false)
    private Medi medi;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT true")
    private Boolean mediIsActive = true;

    public UserMediMapping(UserMediDetail userMediDetail, Medi medi) {
        this.userMediDetail = userMediDetail;
        this.medi = medi;
    }

    public void activate() {
        this.mediIsActive = true;
    }

    public void deactivate() {
        this.mediIsActive = false;
    }
}
