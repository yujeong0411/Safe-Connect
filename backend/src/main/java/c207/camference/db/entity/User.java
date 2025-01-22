package c207.camference.db.entity;


import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;
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
    private Integer userId;

    @Column(name = "user_email", nullable = false, length = 50)
    private String userEmail;

    @Column(name = "user_password", nullable = false, length = 64)
    private String userPassword;

    @Column(name = "user_name", nullable = false, length = 45)
    private String userName;

    @Column(name = "user_birthday", nullable = false, length = 6)
    private String userBirthday;

    @Column(name = "user_gender", nullable = false)
    private Character userGender;

    @Column(name = "user_phone", nullable = false, length = 15)
    private String userPhone;

    @Column(name = "user_protector_phone", length = 15)
    private String userProtectorPhone;

    @Column(name = "user_withdraw", nullable = false)
    private Boolean userWithdraw = false;

    @CreationTimestamp
    @Column(name = "user_created_at", nullable = false)
    private LocalDateTime userCreatedAt;

    @UpdateTimestamp
    @Column(name = "user_updated_at", nullable = false)
    private LocalDateTime userUpdatedAt;

}
