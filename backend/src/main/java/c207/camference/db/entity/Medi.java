package c207.camference.db.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "medi")
@Getter
@Setter
public class Medi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer mediId;

    @ManyToOne
    @JoinColumn(nullable = false)
    private MediCategory mediCategory;

    @Column(length = 150, nullable = false)
    private String mediName;

    @Column(nullable = false)
    private Boolean mediIsActive = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime mediCreatedAt;

    @Column(nullable = false)
    private LocalDateTime mediUpdatedAt;

    // JPA 엔티티 이벤트를 사용해 자도으로 생성 및 수정 시간 업데이트
    @PrePersist
    public void onCreate() {
        this.mediCreatedAt = LocalDateTime.now();
        this.mediUpdatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.mediUpdatedAt = LocalDateTime.now();
    }
}
