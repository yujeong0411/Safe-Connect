package c207.camference.db.entity.report;

import c207.camference.db.entity.firestaff.DispatchGroup;
import c207.camference.db.entity.hospital.Hospital;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Comment;

import java.time.LocalDateTime;

@Entity
@Table(name = "transfer")
@Data
@NoArgsConstructor
public class Transfer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transfer_id")
    @Comment(value = "이송ID")
    private Integer transferId;

    @Column(name = "dispatch_group_id", nullable = false)
    @Comment(value = "출동그룹 ID")
    private Integer dispatchGroupId;

    @Column(name = "hospital_id", nullable = false, length = 30)
    @Comment(value = "병원ID")
    private Integer hospitalId;

//    @Column(name = "fire_staff_team_id", nullable = false)
//    @Comment(value = "출동그룹ID")
//    private Integer fireStaffTeamId;

    @Column(name = "transfer_is_complete")
    @Comment(value = "병원인계여부")
    private Boolean transferIsComplete = false;

    @Column(name = "transfer_accept_at")
    @Comment(value = "이송수락시각")
    private LocalDateTime transferAcceptAt;

    @Column(name = "transfer_arrive_at")
    @Comment(value = "병원도착시각")
    private LocalDateTime transferArriveAt;

    @ManyToOne
    @JoinColumn(name = "dispatch_group_id", insertable = false, updatable = false)
    private DispatchGroup dispatchGroup;

    @ManyToOne
    @JoinColumn(name = "hospital_id", insertable = false, updatable = false)
    private Hospital hospital;
}