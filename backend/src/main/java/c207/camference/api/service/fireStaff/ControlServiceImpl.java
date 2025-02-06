package c207.camference.api.service.fireStaff;

import c207.camference.api.dto.medi.MediCategoryDto;
import c207.camference.api.request.control.CallUpdateRequest;
import c207.camference.api.response.report.CallUpdateResponse;
import c207.camference.api.response.common.ResponseData;
import c207.camference.api.response.dispatchstaff.DispatchGroupResponse;
import c207.camference.api.response.user.ControlUserResponse;
import c207.camference.db.entity.etc.Medi;
import c207.camference.db.entity.firestaff.DispatchGroup;
import c207.camference.db.entity.firestaff.FireDept;
import c207.camference.db.entity.firestaff.FireStaff;
import c207.camference.db.entity.report.Call;
import c207.camference.db.entity.users.User;
import c207.camference.db.entity.users.UserMediDetail;
import c207.camference.db.entity.users.UserMediMapping;
import c207.camference.db.repository.firestaff.DispatchGroupRepository;
import c207.camference.db.repository.firestaff.FireDeptRepository;
import c207.camference.db.repository.firestaff.FireStaffRepository;
import c207.camference.db.repository.report.CallRepository;
import c207.camference.db.repository.users.UserMediDetailRepository;
import c207.camference.db.repository.users.UserRepository;
import c207.camference.temp.request.FireStaffCreateRequest;
import c207.camference.temp.response.FireStaffResponse;
import c207.camference.util.medi.MediUtil;
import c207.camference.util.response.ResponseUtil;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ControlServiceImpl implements ControlService {
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final ModelMapper modelMapper;
    private final FireStaffRepository fireStaffRepository;
    private final CallRepository callRepository;
    private final UserRepository userRepository;
    private final FireDeptRepository fireDeptRepository;
    private final DispatchGroupRepository dispatchGroupRepository;
    private final UserMediDetailRepository userMediDetailRepository;


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
    public ResponseEntity<?> getUser(String callerPhone){
        try{
            User user = userRepository.findByUserPhone(callerPhone)
                    .orElseThrow(() -> new EntityNotFoundException("일치하는 번호가 없습니다."));

            List<MediCategoryDto> mediCategoryDto = null;
            UserMediDetail userMediDetail = userMediDetailRepository.findByUser(user)
                    .orElse(null);

            if (userMediDetail != null) {
                List<Medi> medis = getUserActiveMedis(userMediDetail);
                mediCategoryDto = MediUtil.createMediCategoryResponse(medis);
            }

            ControlUserResponse controlUserResponse = ControlUserResponse.from(user, mediCategoryDto);
            ResponseData<ControlUserResponse> response = ResponseUtil.success(controlUserResponse, "상세 조회 완료");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception e){
            ResponseData<Void> response = ResponseUtil.fail(500,"서버 오류가 발생");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @Override
    public ResponseEntity<?> getReadyDispatchGroups() {
        List<DispatchGroup> readyDispatchGroups = dispatchGroupRepository.findByDispatchGroupIsReadyTrue();
        List<DispatchGroupResponse> response = readyDispatchGroups.stream()
                .map(dispatchGroup -> DispatchGroupResponse.builder()
                        .dispatchGroupId(dispatchGroup.getDispatchGroupId())
                        .fireDeptId(dispatchGroup.getFireDeptId())
                        .fireDeptName(dispatchGroup.getFireDept().getFireDeptName())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok().body(ResponseUtil.success(response, "가용 가능한 소방팀 목록 조회 성공"));
    }

    @Override
    @Transactional
    public ResponseEntity<?> updateCall(CallUpdateRequest request) {
        // Call 엔티티 업데이트
        Call call = callRepository.findCallByCallId(request.getCallId());
        call.setCallSummary(request.getCallSummary());
        call.setCallText(request.getCallText());
        call.setCallTextCreatedAt(LocalDateTime.now());

        User user = null;
        List<MediCategoryDto> mediCategoryDto = null;

        if (request.getUserId() != null) {
            user = userRepository.findById(request.getUserId()).orElse(null);
            UserMediDetail userMediDetail = userMediDetailRepository.findByUser(user)
                    .orElse(null);

            if (userMediDetail != null) {
                List<Medi> medis = getUserActiveMedis(userMediDetail);
                mediCategoryDto = MediUtil.createMediCategoryResponse(medis);
            }
        }

        // 응답 생성
        CallUpdateResponse response = CallUpdateResponse.builder()
                .userName(user != null ? user.getUserName() : null)
                .userGender(user != null ? user.getUserGender() : null)
                .userAge(user != null ? ControlUserResponse.calculateAge(user.getUserBirthday()) : null)
                .userPhone(user != null ? user.getUserPhone() : null)
                .userProtectorPhone(user != null ? user.getUserProtectorPhone() : null)
                .mediInfo(mediCategoryDto)
                .symptom(request.getSymptom())
                .callSummary(request.getCallSummary())
                .callText(request.getCallText())
                .build();

        return ResponseEntity.ok().body(ResponseUtil.success(response, "신고 수정 성공"));
    }


    // 활성화된 의약품/질환 목록 조회
    private List<Medi> getUserActiveMedis(UserMediDetail userMediDetail) {
        return userMediDetail.getUserMediMappings().stream()
                .filter(mapping -> mapping.getMediIsActive())
                .map(UserMediMapping::getMedi)
                .collect(Collectors.toList());
    }
}
