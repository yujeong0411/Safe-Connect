package c207.camference.temp.response;

import c207.camference.db.entity.firestaff.FireDept;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor //
@Builder
public class FireStaffResponse {
    private String fireStaffLoginId;
    private FireDept fireDept;
    private String fireStaffNumber;
    private String fireStaffName;
    private String fireStaffCategory;
}
