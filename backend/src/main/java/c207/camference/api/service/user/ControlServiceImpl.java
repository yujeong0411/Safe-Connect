package c207.camference.api.service.user;

import c207.camference.api.response.common.ResponseData;
import c207.camference.db.entity.others.Call;
import c207.camference.db.entity.others.FireDept;
import c207.camference.db.entity.users.FireStaff;
import c207.camference.db.entity.users.User;
import c207.camference.db.repository.CallRepository;
import c207.camference.db.repository.FireDeptRepository;
import c207.camference.db.repository.FireStaffRepository;
import c207.camference.db.repository.UserRepository;
import c207.camference.temp.request.FireStaffCreateRequest;
import c207.camference.temp.request.MessageRequest;
import c207.camference.temp.response.FireStaffResponse;
import c207.camference.util.response.ResponseUtil;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ControlServiceImpl implements ControlService {
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final ModelMapper modelMapper;
    private final FireStaffRepository fireStaffRepository;
    private final CallRepository callRepository;
    private final UserRepository userRepository;
    private final FireDeptRepository fireDeptRepository;


    @Override
    @Transactional
    public ResponseEntity<?> createUser(FireStaffCreateRequest request){
        try{
            FireStaff fireStaff = modelMapper.map(request, FireStaff.class);
            fireStaff.setFireStaffCategory('C');

            FireDept fireDept = fireDeptRepository.findByFireDeptId(request.getFireDept());
            fireStaff.setFireDept(fireDept);
            fireStaffRepository.saveAndFlush(fireStaff);

            //비밀번호 암호화
            fireStaff.setFireStaffPassword(bCryptPasswordEncoder.encode(fireStaff.getFireStaffPassword()));
            FireStaffResponse fireStaffResponse = modelMapper.map(fireStaff, FireStaffResponse.class);
            ResponseData<FireStaffResponse> response = ResponseUtil.success(fireStaffResponse, "상황실 회원 가입이 완료");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }catch (Exception e){
            ResponseData<Void> response = ResponseUtil.fail(500,"서버 오류가 발생");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

    }

    @Override
    @Transactional
    public ResponseEntity<?> getCalls(){
        try{
            String fireStaffLoginId = SecurityContextHolder.getContext().getAuthentication().getName();
            FireStaff fireStaff = fireStaffRepository.findByFireStaffLoginId(fireStaffLoginId)
                    .orElseThrow(() -> new EntityNotFoundException("직원이 일치하지 않습니다."));

            int fireStaffId = fireStaff.getFireStaffId();
            List<Call> calls = callRepository.findCallsByFireStaff_FireStaffId(fireStaffId);

            //비밀번호 암호화
            ResponseData<List> response = ResponseUtil.success(calls, "전체 조회 완료");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception e){
            ResponseData<Void> response = ResponseUtil.fail(500,"서버 오류가 발생");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @Override
    @Transactional
    public ResponseEntity<?> getCall(Integer callId){
        try{
            Call call = callRepository.findCallByCallId(callId);
            //비밀번호 암호화
            ResponseData<Call> response = ResponseUtil.success(call, "상세 조회 완료");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception e){
            ResponseData<Void> response = ResponseUtil.fail(500,"서버 오류가 발생");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    @Override
    @Transactional
    public
    ResponseEntity<?> getUser(String patientPhone){
        try{
            User user = userRepository.findByUserPhone(patientPhone)
                    .orElseThrow(() -> new EntityNotFoundException("일치하는 번호가 없습니다."));
            //비밀번호 암호화
            ResponseData<User> response = ResponseUtil.success(user, "상세 조회 완료");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception e){
            ResponseData<Void> response = ResponseUtil.fail(500,"서버 오류가 발생");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
