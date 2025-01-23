package c207.camference.api.response.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor //
@Builder
public class AdminResponse {
    private String adminLoginId;
}
