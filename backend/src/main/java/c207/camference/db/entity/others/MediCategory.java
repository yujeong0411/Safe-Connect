package c207.camference.db.entity.others;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
public class MediCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer mediCategoryId;

    @Column(nullable = false, length = 50)
    private String mediCategoryName;

    @Column(nullable = false)
    private Boolean mediCategoryIsActive = true;
}
