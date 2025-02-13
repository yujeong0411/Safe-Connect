package c207.camference.api.service.fireStaff;

import c207.camference.api.dto.medi.MediCategoryDto;
import c207.camference.api.request.control.*;
import c207.camference.api.response.common.ResponseData;
import c207.camference.api.response.dispatchstaff.ControlDispatchOrderResponse;
import c207.camference.api.response.dispatchstaff.DispatchGroupResponse;
import c207.camference.api.response.report.CallUpdateResponse;
import c207.camference.api.response.user.ControlUserResponse;
import c207.camference.api.service.sms.SmsService;
import c207.camference.api.service.sse.SseEmitterServiceImpl;
import c207.camference.db.entity.call.Caller;
import c207.camference.db.entity.call.VideoCall;
import c207.camference.db.entity.call.VideoCallUser;
import c207.camference.db.entity.etc.Medi;
import c207.camference.db.entity.firestaff.DispatchGroup;
import c207.camference.db.entity.firestaff.FireDept;
import c207.camference.db.entity.firestaff.FireStaff;
import c207.camference.db.entity.patient.Patient;
import c207.camference.db.entity.report.Call;
import c207.camference.db.entity.report.Dispatch;
import c207.camference.db.entity.users.User;
import c207.camference.db.entity.users.UserMediDetail;
import c207.camference.db.entity.users.UserMediMapping;
import c207.camference.db.repository.call.CallerRepository;
import c207.camference.db.repository.call.VideoCallRepository;
import c207.camference.db.repository.call.VideoCallUserRepository;
import c207.camference.db.repository.firestaff.DispatchGroupRepository;
import c207.camference.db.repository.firestaff.FireDeptRepository;
import c207.camference.db.repository.firestaff.FireStaffRepository;
import c207.camference.db.repository.patient.PatientRepository;
import c207.camference.db.repository.report.CallRepository;
import c207.camference.db.repository.report.DispatchRepository;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
    private final SseEmitterServiceImpl sseEmitterService;
    private final DispatchRepository dispatchRepository;
    private final SmsService smsService;
    private final PatientRepository patientRepository;


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
            UserMediDetail userMediDetail = userMediDetailRepository.findByUser(user);

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
    public ResponseEntity<?> dispatchOrder(ControlDispatchOrderRequest controlRequest) {
        DispatchGroup dispatchGroup = dispatchGroupRepository.findById(controlRequest.getDispatchGroupId())
                .orElseThrow(() -> new RuntimeException("일치하는 구급팀이 존재하지 않습니다."));
        if (!dispatchGroup.getDispatchGroupIsReady()) {
            throw new RuntimeException("현재 출동 불가능한 구급팀입니다.");
        }

        // dispatch insert
        Dispatch dispatch = Dispatch.builder()
                .callId(controlRequest.getCallId())
                .dispatchGroupId(controlRequest.getDispatchGroupId())
                .dispatchCreateAt(LocalDateTime.now())
                .build();
        dispatchRepository.save(dispatch);

        Patient patient = patientRepository.findById(controlRequest.getPatientId())
                .orElse(null);

        // SSE
        // 구급팀 응답 생성
        ControlDispatchOrderResponse dispatchGroupOrderResponse = new ControlDispatchOrderResponse(dispatch, patient, userMediDetailRepository);

        sseEmitterService.sendDispatchOrder(controlRequest, dispatchGroupOrderResponse);

        return ResponseEntity.ok().body(ResponseUtil.success("출동 지령 전송 성공"));
    }


    @Override
    @Transactional
    public ResponseEntity<?> updateCall(CallUpdateRequest request) {
        // Call 엔티티 업데이트
        Call call = callRepository.findCallByCallId(request.getCallId());
        call.setCallSummary(request.getCallSummary());
        call.setCallText(request.getCallText());
        if(!request.getCallSummary().isEmpty() || !request.getCallText().isEmpty()){
            call.setCallTextCreatedAt(LocalDateTime.now());
        }


        User user = null;
        List<MediCategoryDto> mediCategoryDto = null;

        // patient insert
        Patient patient = Patient.builder()
                .callId(call.getCallId())
                .patientBloodSugar(0)
                .patientDiastolicBldPress(0)
                .patientSystolicBldPress(0)
                .patientPulseRate(0)
                .patientTemperature(0.0f)
                .patientSpo2(0.0f)
                .patientMental("A")
                .build();

        // 환자가 가입자
        if (request.getUserId() != null) {
            user = userRepository.findById(request.getUserId()).orElse(null);

            patient.setUserId(request.getUserId());
            patient.setPatientIsUser(true);
            patient.setPatientName(user.getUserName());
            patient.setPatientGender(user.getUserGender());

            int currentYear = LocalDateTime.now().getYear();
            int birthYear = 1900 + Integer.parseInt(user.getUserBirthday().substring(0, 2));
            int age = currentYear - birthYear;
            String ageString = String.valueOf(age / 10);
            patient.setPatientAge(ageString.substring(0, 1));

            UserMediDetail userMediDetail = userMediDetailRepository.findByUser(user);

            if (userMediDetail != null) {
                List<Medi> medis = getUserActiveMedis(userMediDetail);
                mediCategoryDto = MediUtil.createMediCategoryResponse(medis);
            }
        }
        patientRepository.save(patient);

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
    public ResponseEntity<?> createRoom(CallRoomRequest request, String url) {
        // 상황실 직원 아이디
        String fireStaffLoginId = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("fireStaffLoginId: " + fireStaffLoginId);
        Optional<FireStaff> fireStaffOpt = fireStaffRepository.findByFireStaffLoginId(fireStaffLoginId);

        Integer fireStaffId = null;
        if (fireStaffOpt.isPresent()) {
            FireStaff fireStaff = fireStaffOpt.get();
            fireStaffId = fireStaff.getFireStaffId();
        }

        // request(전화번호)로 신고자 조회
        String callerPhone = request.getCallerPhone();

        // 신고자(caller)에 insert
        Caller caller = new Caller();
        caller.setCallerPhone(callerPhone);

        // 신고자가 회원인지 조회
        User user = userRepository.findUserByUserPhone(callerPhone);
        if(user==null){
            caller.setCallerIsUser(false);
        }else{
            caller.setCallerIsUser(true);
            caller.setUserId(user.getUserId());
        }

        caller.setCallerIsLocationAccept(false);
        caller.setCallerAcceptedAt(LocalDateTime.now());

        caller = callerRepository.saveAndFlush(caller);


        System.out.println("callerId: " + caller.getCallerId());
        // ---
        // 신고(call) 생성

        Call call = new Call();
        call.setCallIsDispatched(false);
        call.setFireStaff(fireStaffOpt.get());
        call.setCaller(caller);
        System.out.println("fireStaffId" + fireStaffOpt.get().getFireStaffId());
        call = callRepository.saveAndFlush(call);

//        VideoCall videoCall = VideoCall.builder()
//                .videoCallIsActivate(true)
//                .videoCallId().
//                .build();

        // ---
        // 영상통화(video_call) 생성
        VideoCall videoCall = new VideoCall();
        videoCall.setCallId(call.getCallId());
        videoCall.setVideoCallUrl(url);
        videoCall = videoCallRepository.saveAndFlush(videoCall);


        // ---
        // 영상통화 참여(video_call_user)레코드 생성
        VideoCallUser videoCallUser = new VideoCallUser();
        videoCallUser.setVideoCallId(videoCall.getVideoCallId());
        videoCallUser.setVideoCallUserCategory("C");
        videoCallUser.setVideoCallerId(fireStaffId); // 상황실 직원의 아이디가 들어가야 한다.

        videoCallUserRepository.save(videoCallUser);

        // ---
        // URL을 신고자에게 전송
//        smsService.sendMessage(callerPhone, url);

        // customSessionId를

        Map<String, Object> response = new HashMap<>();
        response.put("videoCallUser", videoCallUser);
        response.put("videoCall", videoCall);
        response.put("call", call);

        return ResponseEntity.ok().body(ResponseUtil.success(response, "신고 내용 생성 완료"));
    }

    @Override
    @Transactional
    public ResponseEntity<?> callEnd(CallEndRequest request) {
        // 상황실 직원 아이디
        String fireStaffLoginId = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<FireStaff> fireStaffOpt = fireStaffRepository.findByFireStaffLoginId(fireStaffLoginId);

        Integer fireStaffId = null;
        if (fireStaffOpt.isPresent()) {
            FireStaff fireStaff = fireStaffOpt.get();
            fireStaffId = fireStaff.getFireStaffId();
        }

        // 신고(call) 종료시각(call_finished_at) 수정
        Integer callId = request.getCallId();
        System.out.println("callId : " + callId);

        Call call = callRepository.findById(callId).orElse(null);
        if (call == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("신고 정보를 찾을 수 없습니다.");
        }

        call.setCallFinishedAt(LocalDateTime.now());
        System.out.println(call); // 디버그용
        callRepository.save(call);

        // ---

        // 영상통화참여(video_call_user) 의 나간시간(video_call_out_at) 수정
        List<VideoCallUser> videoCallUsers = videoCallUserRepository
                .findByVideoCallIdAndVideoCallOutAtIsNullAndVideoCall_Call_CallId(fireStaffId, callId);

        if (videoCallUsers != null && !videoCallUsers.isEmpty()) {
            for (VideoCallUser videoCallUser : videoCallUsers) {
                videoCallUser.setVideoCallOutAt(LocalDateTime.now());

                System.out.println(videoCallUser); // 디버그용
                
                videoCallUserRepository.save(videoCallUser);
            }
        }

        // ---

        // 응답 객체 구성 (예: Map을 사용)
        Map<String, Object> response = new HashMap<>();
        response.put("isSuccess", true);
        response.put("code", 200);
        response.put("message", "신고 종료 시각 수정 성공");

        return ResponseEntity.ok(response);
    }

    // URL 메시지 재전송
    @Override
    @Transactional
    public ResponseEntity<?> resendUrl(ResendRequest request) {
        Integer callId = request.getCallId();
        Call call = callRepository.findCallByCallId(callId);
        String userPhone = call.getCaller().getCallerPhone();

        VideoCall videoCall = videoCallRepository.findByCallId(callId);
        String url = videoCall.getVideoCallUrl();

        ResponseEntity<?> response = smsService.sendMessage(userPhone, url);

        return ResponseEntity.ok(response);
    }

    // 활성화된 의약품/질환 목록 조회
    private List<Medi> getUserActiveMedis(UserMediDetail userMediDetail) {
        return userMediDetail.getUserMediMappings().stream()
                .filter(mapping -> mapping.getMediIsActive())
                .map(UserMediMapping::getMedi)
                .collect(Collectors.toList());
    }
}
