package c207.camference.db.entity.firestaff;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Comment;

@Entity
@Table(name = "dispatch_staff")
@Data
@NoArgsConstructor
public class DispatchStaff {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dispatch_staff_id", nullable = false)
    @Comment(value = "출동직원ID")
    private Integer dispatchStaffId;

    @Column(name = "dispatch_group_id", nullable = false)
    @Comment(value = "출동그룹ID")
    private Integer dispatchGroupId;

    @Column(name = "fire_staff_id", nullable = false)
    @Comment(value = "소방청직원ID")
    private Integer fireStaffId;

    @ManyToOne
    @JoinColumn(name = "dispatch_group_id", insertable = false, updatable = false)
    private DispatchGroup dispatchGroup;

    @ManyToOne
    @JoinColumn(name = "fire_staff_id", insertable = false, updatable = false)
    private FireStaff fireStaff;
}