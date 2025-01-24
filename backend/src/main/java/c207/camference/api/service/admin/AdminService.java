package c207.camference.api.service.admin;

import c207.camference.api.request.admin.AdminCreateRequest;
import org.springframework.http.ResponseEntity;

public interface AdminService {
    ResponseEntity<?> createAdmin(AdminCreateRequest request);
    ResponseEntity<?> getAdmin();
}
