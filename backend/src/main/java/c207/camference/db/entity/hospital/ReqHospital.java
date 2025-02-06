package c207.camference.db.entity.hospital;


import c207.camference.db.entity.report.Dispatch;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "req_hospital")
@Data
public class ReqHospital {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "req_hospital_id")
    @Comment(value = "요청병원ID")
    private Integer reqHospitalId;

    @Column(name = "hospital_id", length = 30, nullable = false)
    @Comment(value = "병원ID")
    private Integer hospitalId;

    @Column(name = "dispatch_id", nullable = false)
    @Comment(value = "출동 ID")
    private Integer dispatchId;

    @CreationTimestamp
    @Column(name = "req_hospital_created_at", nullable = false)
    @Comment(value = "요청 시각")
    private LocalDateTime reqHospitalCreatedAt;

    @ManyToOne
    @JoinColumn(name = "hospital_id", insertable = false, updatable = false)
    private Hospital hospital;

    @ManyToOne
    @JoinColumn(name = "dispatch_id", insertable = false, updatable = false)
    private Dispatch dispatch;
}
