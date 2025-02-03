package c207.camference.api.dto.medi;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class MediInfoDto {

    private List<String> medications;
    private List<String> diseases;
}
