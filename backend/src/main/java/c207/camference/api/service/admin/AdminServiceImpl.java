package c207.camference.api.service.admin;

import c207.camference.api.request.admin.AdminCreateRequest;
import c207.camference.api.response.admin.AdminResponse;
import c207.camference.api.response.common.ResponseData;
import c207.camference.db.entity.Admin;
import c207.camference.db.repository.AdminRepository;
import c207.camference.util.response.ResponseUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
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
        try{
            Admin admin = modelMapper.map(request, Admin.class);
            admin.setAdminPassword(bCryptPasswordEncoder.encode(request.getAdminPassword()));
            adminRepository.save(admin);
            //비밀번호 암호화
            AdminResponse adminResponse = modelMapper.map(admin, AdminResponse.class);
            ResponseData<AdminResponse> response = ResponseUtil.success(adminResponse, "회원 가입이 완료");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }catch (Exception e){
            ResponseData<Void> response = ResponseUtil.fail(500,"서버 오류가 발생");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

    }

    @Override
    @Transactional
    public ResponseEntity<?> getAdmin(){
        try{
            String adminLoginId = SecurityContextHolder.getContext().getAuthentication().getName();
            System.out.println(adminLoginId);
            Admin admin = adminRepository.findAdminByAdminLoginId(adminLoginId);
            AdminResponse adminResponse = modelMapper.map(admin, AdminResponse.class);
            ResponseData<AdminResponse> response = ResponseUtil.success(adminResponse, "관리자 상세조회 완료");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception e){
            ResponseData<Void> response = ResponseUtil.fail(500,"서버 오류가 발생");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
