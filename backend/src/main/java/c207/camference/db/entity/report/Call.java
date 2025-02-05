package c207.camference.db.entity.report;

import c207.camference.db.entity.firestaff.FireStaff;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name="report_call")
public class Call {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "call_id")
    @Comment(value="신고ID")
    private Integer callId;

    @Column(name = "call_is_dispatched", nullable = false)
    @Comment(value = "출동 필요 여부")
    private Boolean callIsDispatched;

    @ManyToOne
    @JoinColumn(name="fire_staff_id")
    private FireStaff fireStaff;

    @Column(name = "call_summary")
    @Comment(value="신고 요약본")
    @Lob
    private String callSummary;

    @Column(name = "call_text", length = 64)
    @Comment(value="신고 내용")
    @Lob
    private String callText;

    @CreationTimestamp
    @Column(name = "call_started_at", nullable = false)
    @Comment(value = "신고 시작 시간")
    private LocalDateTime callStartedAt;


    @Column(name = "call_text_created_at")
    @Comment(value = "신고내용 작성 시간")
    private LocalDateTime callTextCreatedAt;

    @Column(name = "call_finished_at")
    @Comment(value = "신고 종료 시간")
    private LocalDateTime callFinishedAt;
}
