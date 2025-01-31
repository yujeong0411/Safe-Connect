package c207.camference.api.response.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor //
@Builder
public class UserEmailResponse {
    private String userEmail;
}
