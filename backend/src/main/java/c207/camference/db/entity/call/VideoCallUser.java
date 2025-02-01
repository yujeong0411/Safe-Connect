package c207.camference.db.entity.call;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "video_call_user")
public class VideoCallUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "video_call_user_id")
    @Comment(value = "영상통화참여ID")
    private Integer videoCallUserId;

    @Column(name = "video_call_room_id", nullable = false)
    @Comment(value = "영상통화방ID")
    private Integer videoCallRoomId;

    @Column(name = "video_call_user_category", nullable = false, length = 1)
    @Comment(value = "유저종류(신고차 : G , 상황실 : C, 구조팀 :E )")
    private String videoCallUserCategory;

    @Column(name = "video_call_id", nullable = false)
    @Comment(value = "유저ID(종류 확인 후 연결)")
    private Integer videoCallId;

    @CreationTimestamp
    @Column(name = "video_call_insert_at", nullable = false)
    @Comment(value = "참여시간")
    private LocalDateTime videoCallInsertAt;

    @Column(name = "video_call_out_at")
    @Comment(value = "나간시간")
    private LocalDateTime videoCallOutAt=null;

    @ManyToOne
    @JoinColumn(name = "video_call_id", insertable = false, updatable = false)
    private VideoCall videoCall;
}