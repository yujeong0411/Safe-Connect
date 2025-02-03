package c207.camference.api.request.admin;

import lombok.Data;

@Data
public class AdminCreateRequest {

    private String adminLoginId;

    private String adminPassword;
}
