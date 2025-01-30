package c207.camference.db.entity.others;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "medi_category")
@Getter
@Setter
public class MediCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Integer mediCategoryId;

    @Column(nullable = false, length = 50)
    private String mediCategoryName;

    @Column(nullable = false)
    private Boolean mediCategoryIsActive = true;

}
