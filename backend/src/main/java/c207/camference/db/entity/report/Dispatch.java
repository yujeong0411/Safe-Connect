package c207.camference.db.entity.report;

import c207.camference.db.entity.firestaff.DispatchGroup;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name="dispatch")
public class Dispatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dispatch_id", nullable = false)
    @Comment(value = "출동 ID")
    private Integer dispatchId;

    @Column(name = "call_id", nullable = false)
    @Comment(value = "신고ID")
    private Integer callId;

    @Column(name = "dispatch_group_id", nullable = false)
    @Comment(value = "출동그룹ID")
    private Integer dispatchGroupId;

    @Column(name = "dispatch_is_transfer")
    @Comment(value = "병원이송(현장종결)여부")
    private Boolean dispatchIsTransfer = false;

    @CreationTimestamp
    @Column(name = "dispatch_create_at", nullable = false)
    @Comment(value = "출동요청생성시각")
    private LocalDateTime dispatchCreateAt;

    @Column(name = "dispatch_depart_at")
    @Comment(value = "구급 현장 출동 시각")
    private LocalDateTime dispatchDepartAt;

    @Column(name = "dispatch_arrive_at")
    @Comment(value = "구급 현장 도착 시각")
    private LocalDateTime dispatchArriveAt;

    @ManyToOne
    @JoinColumn(name = "call_id", insertable = false, updatable = false)
    private Call call;

    @ManyToOne
    @JoinColumn(name = "dispatch_group_id", insertable = false, updatable = false)
    private DispatchGroup dispatchGroup;
}