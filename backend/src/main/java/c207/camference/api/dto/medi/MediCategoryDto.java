package c207.camference.api.dto.medi;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class MediCategoryDto {
    private Integer categoryId;
    private String categoryName;
    private List<MediDto> mediList;
}
