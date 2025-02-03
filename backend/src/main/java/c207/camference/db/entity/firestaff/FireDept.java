package c207.camference.db.entity.firestaff;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name="fire_dept")
public class FireDept {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fire_dept_id")
    @Comment(value="소방청ID")
    private Integer fireDeptId;

    @Column(name = "fire_dept_name", nullable = false, length = 50)
    @Comment(value="소방청 이름")
    private String fireDeptName;

    @Column(name = "fire_dept_phone", nullable = false, length = 64)
    @Comment(value="대표전화번호")
    private String fireDeptPhone;

    @Column(name = "fire_dept_region", nullable = false)
    @Comment(value="주소")
    private String fireDeptRegion;

    @Column(name = "fire_dept_is_activate", nullable = false)
    @Comment(value = "활성화여부")
    private Boolean fireDeptIsActivate = true;

    @CreationTimestamp
    @Column(name = "fire_dept_created_at", nullable = false)
    @Comment(value = "생성시간")
    private LocalDateTime fireDeptCreatedAt;

    @UpdateTimestamp
    @Column(name = "fire_dept_updated_at", nullable = false)
    @Comment(value = "수정시간")
    private LocalDateTime fireDeptUpdatedAt;


}
