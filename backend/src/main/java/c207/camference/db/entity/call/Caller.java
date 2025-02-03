package c207.camference.db.entity.call;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;


@Entity
@Data
@Table(name="caller")
public class Caller {

    @Id
    @Column(name = "caller_id", nullable = false)
    @Comment(value = "신고자ID")
    private Integer callerId;

    @Column(name = "user_id")
    @Comment(value = "일반회원ID")
    private Integer userId;

    @Column(name = "caller_is_user", nullable = false)
    @Comment(value= "회원여부")
    private Boolean callerIsUser = false;

    @Column(name = "caller_name", length = 45)
    @Comment(value = "이름")
    private String callerName;

    @Column(name = "caller_phone", nullable = false, length = 13)
    @Comment(value = "전화번호")
    private String callerPhone;

    @Column(name = "caller_is_location_accept", nullable = false)
    @Comment(value = "위치정보 동의 여부")
    private Boolean callerIsLocationAccept = false;

    @Column(name = "caller_accepted_at", nullable = false)
    @Comment(value = "위치정보 동의시각")
    private LocalDateTime callerAcceptedAt;

    @CreationTimestamp
    @Column(name = "caller_created_at", nullable = false)
    @Comment(value = "생성시간")
    private LocalDateTime callerCreatedAt;
}
