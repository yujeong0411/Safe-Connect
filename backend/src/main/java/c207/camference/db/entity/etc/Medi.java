package c207.camference.db.entity.etc;

import jakarta.persistence.*;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@EntityListeners(AuditingEntityListener.class)
public class Medi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer mediId;

    @ManyToOne
    @JoinColumn(name = "medi_category_id", nullable = false)
    private MediCategory mediCategory;

    @Column(length = 150, nullable = false)
    private String mediName;

    @Column(nullable = false)
    private Boolean mediIsActive = true;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime mediCreatedAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime mediUpdatedAt;
}
