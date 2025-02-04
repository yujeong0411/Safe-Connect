package c207.camference.api.response.openapi;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AedResponse {

    private Integer aedId;
    private String aedAddress;
    private String aedPlace;
    private double aedLatitude;
    private double aedLongitude;
}
