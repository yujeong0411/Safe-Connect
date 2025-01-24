package c207.camference.api.contoller.admin;

import c207.camference.api.request.admin.AdminCreateRequest;
import c207.camference.api.service.admin.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody AdminCreateRequest request){
        return adminService.createAdmin(request);
    }
    @GetMapping("")
    public ResponseEntity<?> getAdmin(){
            return adminService.getAdmin();
    }
}
