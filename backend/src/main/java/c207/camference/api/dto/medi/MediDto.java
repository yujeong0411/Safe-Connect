package c207.camference.api.dto.medi;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Builder
public class MediDto {
    private Integer mediId;
    private String mediName;
}
