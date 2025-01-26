package c207.camference.api.response.medi;

import c207.camference.api.dto.medi.MediDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MediListResponse {

    private List<MediDto> medications;
    private List<MediDto> diseases;

}
