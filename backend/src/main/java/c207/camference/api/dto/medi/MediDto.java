package c207.camference.api.dto.medi;

import lombok.Data;

// API 데이터 매핑
@Data
public class MediDto {
    private Integer mediId;
    private String mediName;
    private Boolean mediIsActive;
}
