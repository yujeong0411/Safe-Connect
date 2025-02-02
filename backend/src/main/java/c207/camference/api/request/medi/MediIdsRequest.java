package c207.camference.api.request.medi;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class MediIdsRequest {
    private List<Integer> mediIds;
}
