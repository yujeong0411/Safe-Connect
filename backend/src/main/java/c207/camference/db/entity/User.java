package c207.camference.db.entity;


import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name="user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    @Comment(value="일반회원ID")
    private Integer userId;

    @Column(name = "user_email", nullable = false, length = 50)
    @Comment(value="이메일(로그인 시 사용)")
    private String userEmail;

    @Column(name = "user_password", nullable = false, length = 64)
    @Comment(value="비밀번호")
    private String userPassword;

    @Column(name = "user_name", nullable = false, length = 45)
    @Comment(value="이름")
    private String userName;

    @Column(name = "user_birthday", nullable = false, length = 6)
    @Comment(value="생년월일")
    private String userBirthday;

    @Column(name = "user_gender", nullable = false)
    @Comment(value="성별(남성:M, 여성:F)")
    private Character userGender;

    @Column(name = "user_phone", nullable = false, length = 15)
    @Comment(value="전화번호")
    private String userPhone;

    @Column(name = "user_protector_phone", length = 15)
    @Comment(value="보호자연락처")
    private String userProtectorPhone;

    @Column(name = "user_withdraw", nullable = false)
    @Comment(value="탈퇴여부")
    private Boolean userWithdraw = false;

    @CreationTimestamp
    @Column(name = "user_created_at", nullable = false)
    @Comment(value="생성시간")
    private LocalDateTime userCreatedAt;

    @UpdateTimestamp
    @Column(name = "user_updated_at", nullable = false)
    @Comment(value="수정시간")
    private LocalDateTime userUpdatedAt;

}
