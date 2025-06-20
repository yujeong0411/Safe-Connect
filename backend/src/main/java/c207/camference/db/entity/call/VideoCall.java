package c207.camference.db.entity.call;

import c207.camference.db.entity.report.Call;
import c207.camference.db.entity.report.Dispatch;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Builder
@Entity
@Data
@Table(name = "video_call")
@NoArgsConstructor
@AllArgsConstructor
public class VideoCall {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "video_call_id")
    @Comment(value = "영상통화방ID")
    private Integer videoCallId;

    //UserId만 필요한 경우 전체를 로딩하지 않기 위해서, 필요할때만 사용하기 위해서
    //실수로 연관관계를 통해 FK 값이 변경되는 것을 방지할 수 있다
    @Column(name = "call_id", nullable = false)
    @Comment(value = "신고ID")
    private Integer callId;

    @Column(name = "dispatch_id")
    @Comment(value = "출동 ID")
    private Integer dispatchId=null;

    @Column(name = "video_call_url", length = 100, nullable = false)
    @Comment(value = "URL")
    private String videoCallUrl;

    @Column(name="video_call_sessionId",nullable = false,length = 40)
    @Comment(value = "세션Id")
    private String videoCallSessionId;

    @Column(name = "video_call_is_activate")
    @Comment(value = "활성화여부")
    private Boolean videoCallIsActivate = true;

    @CreationTimestamp
    @Column(name = "video_call_created_at", nullable = false)
    @Comment(value = "생성시각")
    private LocalDateTime videoCallCreatedAt;

    @Column(name = "video_call_finished_at")
    @Comment(value = "종료시각")
    private LocalDateTime videoCallFinishedAt = null;

    @ManyToOne
    @JoinColumn(name = "call_id", insertable = false, updatable = false)
    private Call call;

    @ManyToOne
    @JoinColumn(name = "dispatch_id", insertable = false, updatable = false)
    private Dispatch dispatch;

}
