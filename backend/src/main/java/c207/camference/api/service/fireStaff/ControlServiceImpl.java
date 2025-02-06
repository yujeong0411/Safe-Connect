package c207.camference.api.service.fireStaff;

import c207.camference.api.dto.medi.MediCategoryDto;
import c207.camference.api.request.control.CallEndRequest;
import c207.camference.api.request.control.CallRoomRequest;
import c207.camference.api.request.control.CallUpdateRequest;
import c207.camference.api.response.common.ResponseData;
import c207.camference.api.response.dispatchstaff.DispatchGroupResponse;
import c207.camference.api.response.report.CallUpdateResponse;
import c207.camference.api.response.user.ControlUserResponse;
import c207.camference.db.entity.call.Caller;
import c207.camference.db.entity.call.VideoCall;
import c207.camference.db.entity.call.VideoCallUser;
import c207.camference.db.entity.etc.Medi;
import c207.camference.db.entity.firestaff.DispatchGroup;
import c207.camference.db.entity.firestaff.FireDept;
import c207.camference.db.entity.firestaff.FireStaff;
import c207.camference.db.entity.report.Call;
import c207.camference.db.entity.users.User;
import c207.camference.db.entity.users.UserMediDetail;
import c207.camference.db.entity.users.UserMediMapping;
import c207.camference.db.repository.call.CallerRepository;
import c207.camference.db.repository.call.VideoCallRepository;
import c207.camference.db.repository.call.VideoCallUserRepository;
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
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
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
    private final CallerRepository callerRepository;
    private final VideoCallUserRepository videoCallUserRepository;
    private final VideoCallRepository videoCallRepository;


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
    @Transactional
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




    // 상황실 직원이 '영상통화방 생성 및 url 전송' 버튼을 눌렀을 시
    // 신고자(caller), 신고(call), 영상통화(video_call), 영상통화 참여(video_call_user) 레코드 생성

    @Override
    @Transactional
    public ResponseEntity<?> createRoom(CallRoomRequest request) {
        // 상황실 직원 아이디
        String fireStaffLoginId = SecurityContextHolder.getContext().getAuthentication().getName();

        // request(전화번호)로 신고자 조회
        String callerPhone = request.getCallerPhone();
        Caller caller = callerRepository.findByCallerPhone(callerPhone);

        // 신고자(caller)에 insert
        if (caller == null) {
            caller = new Caller();
            caller.setCallerPhone(callerPhone);

            // 신고자가 회원인지 조회
            Optional<User> user = userRepository.findByUserPhone(callerPhone);
            caller.setCallerIsUser(user.isPresent());

            caller.setCallerIsUser(false);
            caller.setCallerIsLocationAccept(false);
            caller.setCallerAcceptedAt(LocalDateTime.now());

            caller = callerRepository.save(caller);

        }

        // ---
        
        // 신고(call) 생성
        Call call = new Call();
        //call.setFireStaff(1); // 02.06 : fireStaffId값은 어디에?
        call.setCallIsDispatched(false);
        call.setCallStartedAt(LocalDateTime.now());
        call.setCallFinishedAt(LocalDateTime.now()); // nullabe = false로 고칠것
        call = callRepository.save(call);

        // System.out.println(call.toString());

        // ---
        // URL 전송 (추후 webrtc 기능 develop에 추가되면 수정)

        // ---

        // 영상통화(video_call) 생성
        VideoCall videoCall = new VideoCall();
        videoCall.setCallId(call.getCallId());
        videoCall.setVideoCallUrl("http://localhost:5173/openvidu/join/{sessionId}?direct=true"); // 해당 메서드 완성전까지는 일단 하드코딩(2025.02.06)
        videoCall.setVideoCallIsActivate(true);
        videoCall.setVideoCallCreatedAt(LocalDateTime.now());
        videoCallRepository.save(videoCall);


        // ---
        // 영상통화 참여(video_call_user)레코드 생성
        VideoCallUser videoCallUser = new VideoCallUser();
        videoCallUser.setVideoCallRoomId(videoCall.getVideoCallId());
        videoCallUser.setVideoCallUserCategory("C");
        videoCallUser.setVideoCallInsertAt(LocalDateTime.now());
        //videoCallUser.setVideoCallUserId(fireStaffLoginId); // 상황실 직원의 아이디가 들어가야 한다.
        // videoCallUser.setVideoCallId(caller.getCallerId()); // 일단은 신고자아이디
        videoCallUserRepository.save(videoCallUser);

        
        return null; // 여기 수정할것
    }

    @Override
    public ResponseEntity<?> callEnd(CallEndRequest request) {
        // 상황실 직원 아이디
        String fireStaffLoginId = SecurityContextHolder.getContext().getAuthentication().getName();
        // 요청으로부터 신고(call)테이블의 신고ID 값 추출
        Integer callId = request.getCallId();
        System.out.println(callId);

        Call call = callRepository.findById(callId).orElse(null);
        if (call == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("신고 정보를 찾을 수 없습니다.");
        }

        // 신고(call) 종료시각(call_finished_at) 수정
        call.setCallFinishedAt(LocalDateTime.now());
        callRepository.save(call);

        // ---

        // 영상통화참여(video_call_user) 나간시간(video_call_out_at) 수정



        return null;
    }

    // 활성화된 의약품/질환 목록 조회
    private List<Medi> getUserActiveMedis(UserMediDetail userMediDetail) {
        return userMediDetail.getUserMediMappings().stream()
                .filter(mapping -> mapping.getMediIsActive())
                .map(UserMediMapping::getMedi)
                .collect(Collectors.toList());
    }
}
