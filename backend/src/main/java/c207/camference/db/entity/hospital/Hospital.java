package c207.camference.db.entity.hospital;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;


@Entity
@Table(name = "hospital")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Hospital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hospital_id", nullable = false, length = 30)
    @Comment(value = "병원ID")
    private Integer hospitalId;

    @Column(name = "hospital_login_id", nullable = false, length = 30)
    @Comment(value = "로그인ID")
    private String hospitalLoginId;

    @Column(name = "hospital_password", nullable = false, length = 64)
    @Comment(value = "비밀번호")
    private String hospitalPassword;

    @Column(name = "hospital_name", nullable = false, length = 50)
    @Comment(value = "병원명")
    private String hospitalName;

    @Column(name = "hospital_address", nullable = false)
    @Comment(value = "병원주소")
    private String hospitalAddress;

    // Point 타입은 별도 처리가 필요할 수 있습니다
    @Column(name = "hospital_location", nullable = false, columnDefinition = "GEOMETRY")
    @Comment(value = "병원위치")
    private Point hospitalLocation;

    @Column(name = "hospital_phone", nullable = false, length = 15)
    @Comment(value = "전화번호")
    private String hospitalPhone;

    @Column(name = "hospital_is_active", nullable = false)
    @Comment(value = "활성화여부")
    private Boolean hospitalIsActive = true;

    @CreationTimestamp
    @Column(name = "hospital_created_at", nullable = false)
    @Comment(value = "생성시간")
    private LocalDateTime hospitalCreatedAt;

    @UpdateTimestamp
    @Column(name = "hospital_updated_at", nullable = false)
    @Comment(value = "수정시간")
    private LocalDateTime hospitalUpdatedAt;
}