package c207.camference.api.dto.medi;

import c207.camference.db.entity.etc.MediCategory;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

@Getter
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
public class MediDto {
    private Integer mediId;
    private String mediName;

    @JsonIgnore
    private MediCategory mediCategory;

}
