package c207.camference.api.dto.caller;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CallerLocationDto {
    private Double lat;
    private Double lng;
    private String address;

    public CallerLocationDto(Double lat, Double lng) {
        this.lat = lat;
        this.lng = lng;
        this.address = null;
    }
}
