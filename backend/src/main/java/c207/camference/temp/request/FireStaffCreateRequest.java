package c207.camference.temp.request;

import c207.camference.db.entity.others.FireDept;
import lombok.Data;

@Data
public class FireStaffCreateRequest {
    private String fireStaffLoginId;
    private String fireStaffPassword;
    private FireDept fireDept;
    private String fireStaffNumber;
    private String fireStaffName;
    private String fireStaffCategory;
}
