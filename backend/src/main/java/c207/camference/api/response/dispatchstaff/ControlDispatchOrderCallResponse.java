package c207.camference.api.response.dispatchstaff;


import c207.camference.db.entity.report.Call;
import lombok.Getter;

@Getter
public class ControlDispatchOrderCallResponse {


    private Integer callId;
    private String callSummary;
    private String callerPhone;

    public ControlDispatchOrderCallResponse(Call call) {
        this.callId = call.getCallId();
        this.callSummary = call.getCallSummary();
        this.callerPhone = call.getCaller().getCallerPhone();
    }

}
