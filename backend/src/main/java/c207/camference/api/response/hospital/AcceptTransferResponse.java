package c207.camference.api.response.hospital;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class AcceptTransferResponse {

    private Integer patientid;
    private Integer hospitalid;
    private Integer transferid;
    private LocalDateTime transferAcceptAt;
}
