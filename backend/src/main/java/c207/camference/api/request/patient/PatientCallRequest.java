package c207.camference.api.request.patient;

import lombok.Data;

@Data
public class PatientCallRequest {
  private Integer patientId;
  private Integer transferId;
}