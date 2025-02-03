package c207.camference.api.response.hospital;

import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
public class AcceptTransferResponse {

    private Integer patientid;
    private LocalDateTime transferAcceptAt;
}
