package c207.camference.db.entity.users;

import c207.camference.db.entity.others.FireDept;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name="fire_staff")
public class FireStaff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fire_staff_id")
    @Comment(value="소방청직원ID")
    private Integer fireStaffId;

    @Column(name = "fire_staff_login_id", nullable = false, length = 30)
    @Comment(value="소방청직원로그인ID")
    private String fireStaffLoginId;

    @Column(name = "fire_staff_password", nullable = false, length = 64)
    @Comment(value="비밀번호")
    private String fireStaffPassword;

    @ManyToOne
    @JoinColumn(name="fire_dept_id")
    private FireDept fireDept;

    @Column(name = "fire_staff_number", nullable = false, length = 20)
    @Comment(value="직원번호")
    private String fireStaffNumber;

    @Column(name = "fire_staff_name", nullable = false, length = 45)
    @Comment(value="이름")
    private String fireStaffName;


    @Column(name="fire_staff_category", nullable = false, length = 1)
    @Comment(value = "분류 C: 상황실, E : 구급대원")
    private Character fireStaffCategory;

    @Column(name = "fire_staff_is_activate", nullable = false)
    @Comment(value = "활성화여부")
    private Boolean fireStaffIsActivate=true;

    @CreationTimestamp
    @Column(name = "fire_staff_created_at", nullable = false)
    @Comment(value = "생성시간")
    private LocalDateTime fireStaffCreatedAt;

    @UpdateTimestamp
    @Column(name = "fire_staff_updated_at", nullable = false)
    @Comment(value = "수정시간")
    private LocalDateTime fireStaffUpdatedAt;
    
    
}
