package c207.camference.api.response.user;

import c207.camference.api.dto.medi.MediCategoryDto;
import c207.camference.db.entity.users.User;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

@Getter
@Builder
public class ControlUserResponse {

    private Integer userId;
    private String userName;
    private Character userGender;
    private String userBirthday;
    private String userAge;
    private String userPhone;
    private String userProtectorPhone;

    private List<MediCategoryDto> mediInfo;


    public static ControlUserResponse from(User user, List<MediCategoryDto> mediInfo) {
        return ControlUserResponse.builder()
                .userId(user.getUserId())
                .userName(user.getUserName())
                .userGender(user.getUserGender())
                .userBirthday(user.getUserBirthday())
                .userAge(calculateAge(user.getUserBirthday()))
                .userPhone(user.getUserPhone())
                .userProtectorPhone(user.getUserProtectorPhone())
                .mediInfo(mediInfo)
                .build();
    }


    public static String calculateAge(String birthday) {
        int year = Integer.parseInt(birthday.substring(0, 2));
        int month = Integer.parseInt(birthday.substring(2, 4));
        int day = Integer.parseInt(birthday.substring(4, 6));

        int fullYear = year < 50 ? 2000 + year : 1900 + year;

        LocalDate birthDate = LocalDate.of(fullYear, month, day);

        int age =  Period.between(birthDate, LocalDate.now()).getYears();

        String ageString = String.valueOf(age);
        return ageString.substring(0, 1);
    }
}
