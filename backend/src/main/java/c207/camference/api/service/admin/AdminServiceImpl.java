package c207.camference.api.service.admin;

import c207.camference.api.request.admin.AdminCreateRequest;
import c207.camference.api.request.user.UserCreateRequest;
import c207.camference.api.response.admin.AdminResponse;
import c207.camference.api.response.common.ResponseData;
import c207.camference.api.response.user.UserResponse;
import c207.camference.db.entity.Admin;
import c207.camference.db.entity.User;
import c207.camference.db.repository.AdminRepository;
import c207.camference.util.response.ResponseUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final ModelMapper modelMapper;
    private final AdminRepository adminRepository;

    @Override
    @Transactional
    public ResponseEntity<?> createAdmin(AdminCreateRequest request){
        System.out.println("00");
        try{
            Admin admin = modelMapper.map(request, Admin.class);

//            admin.setAdminLoginId(request.getAdminLoginId());
            admin.setAdminPassword(bCryptPasswordEncoder.encode(request.getAdminPassword()));

            adminRepository.save(admin);

//            admin.setAdminPassword(bCryptPasswordEncoder.encode(admin.getAdminPassword()));
//            adminRepository.save(admin);
            //비밀번호 암호화
            System.out.println("22");
            AdminResponse adminResponse = modelMapper.map(admin, AdminResponse.class);
            System.out.println("33");
            ResponseData<AdminResponse> response = ResponseUtil.success(adminResponse, "회원 가입이 완료되었습니다.");
            System.out.println("44");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }catch (Exception e){
            ResponseData<Void> response = ResponseUtil.fail(500,"서버 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

    };
}
