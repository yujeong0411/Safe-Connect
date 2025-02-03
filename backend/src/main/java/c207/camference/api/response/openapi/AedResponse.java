package c207.camference.api.response.openapi;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AedResponse {

    private Integer aedId;
    private String aedAddress;
    private double aedLatitude;
    private double aedLongitude;
}
