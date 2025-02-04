package c207.camference.api.response.report;

import c207.camference.db.entity.patient.Patient;
import lombok.*;

import java.util.List;

@Getter
@Setter
public class CallResponse {

    private Integer callId;
    private Boolean callIsDispatched;
    private String callSummary;
    private String callText;

    private List<Patient> patient; // 여기에 환자 정보 한번에 모아서 주고싶다

    public CallResponse(Integer callId, Boolean callIsDispatched, String callSummary, String callText, Patient patient) {
        this.callId = callId;
        this.callIsDispatched = callIsDispatched;
        this.callSummary = callSummary;
        this.callText = callText;
        this.patient = patient;
    }
}
