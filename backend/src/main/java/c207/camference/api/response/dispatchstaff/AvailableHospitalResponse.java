package c207.camference.api.response.dispatchstaff;

import c207.camference.util.serializer.PointSerializer;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.*;
import org.locationtech.jts.geom.Point;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AvailableHospitalResponse {

    private Integer hospitalId;
    private String hospitalName;
    private String hospitalPhone;
    private Integer hospitalCapacity;
    private String hospitalAddress;
    private Double hospitalDistance;
    private double hospitalLat;
    private double hospitalLng;

}
