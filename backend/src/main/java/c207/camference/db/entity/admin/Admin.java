package c207.camference.db.entity.admin;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Comment;

@Entity
@Data
@Table(name="admin")
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "admin_id")
    @Comment(value="관리자ID")
    private Integer adminId;

    @Column(name = "admin_login_id", nullable = false, length = 50)
    @Comment(value="관리자로그인ID")
    private String adminLoginId;

    @Column(name = "admin_password", nullable = false, length = 64)
    @Comment(value="비밀번호")
    private String adminPassword;

}
