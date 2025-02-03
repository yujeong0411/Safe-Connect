package c207.camference.api.response.report;

import c207.camference.db.entity.report.Dispatch;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class DispatchResponse {
     private Boolean dispatchIsTransfer;
     private LocalDateTime dispatchCreatedAt;
     private LocalDateTime dispatchDepartAt;
     private LocalDateTime dispatchArriveAt;

     public DispatchResponse(Dispatch dispatch){
         this.dispatchIsTransfer = dispatch.getDispatchIsTransfer();
         this.dispatchCreatedAt = dispatch.getDispatchCreateAt();
         this.dispatchDepartAt = dispatch.getDispatchDepartAt();
         this.dispatchArriveAt = dispatch.getDispatchArriveAt();
     }
}
