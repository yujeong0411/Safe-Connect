package c207.camference.db.entity.etc;

import jakarta.persistence.*;
import lombok.*;

@Entity(name = "aed")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Aed {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "aed_id")
    private Integer aedId;

    @Column(name = "aed_address", nullable = false)
    private String aedAddress;

    @Column(name = "aed_latitude", nullable = false)
    private double aedLatitude;

    @Column(name = "aed_longitude")
    private double aedLongitude;
}
