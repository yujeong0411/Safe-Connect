package c207.camference.temp.request;

import lombok.Data;

@Data
public class FireStaffCreateRequest {
    private String fireStaffLoginId;
    private String fireStaffPassword;
    private int fireDept;
    private String fireStaffNumber;
    private String fireStaffName;
}
