package c207.camference.db.entity.firestaff;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "dispatch_group")
@Data
@NoArgsConstructor
public class DispatchGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dispatch_group_id", nullable = false)
    @Comment(value = "출동그룹ID")
    private Integer dispatchGroupId;

    @Column(name = "fire_dept_id", nullable = false)
    @Comment(value = "소방청ID")
    private Integer fireDeptId;

    @Column(name = "dispatch_group_is_activate")
    @Comment(value = "활성화여부")
    private Boolean dispatchGroupIsActivate = true;

    @Column(name = "dispatch_group_is_ready")
    @Comment(value = "출동가능여부")
    private Boolean dispatchGroupIsReady = true;

    @CreationTimestamp
    @Column(name = "dispatch_group_create_at", nullable = false)
    @Comment(value = "생성시간")
    private LocalDateTime dispatchGroupCreateAt;

    @UpdateTimestamp
    @Column(name = "dispatch_group_update_at", nullable = false)
    @Comment(value = "수정시간")
    private LocalDateTime dispatchGroupUpdateAt;

    @ManyToOne
    @JoinColumn(name = "fire_dept_id", insertable = false, updatable = false)
    private FireDept fireDept;
}