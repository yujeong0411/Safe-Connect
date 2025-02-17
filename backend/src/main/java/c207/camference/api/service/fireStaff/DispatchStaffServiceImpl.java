package c207.camference.api.service.fireStaff;

import c207.camference.api.request.dispatchstaff.DispatchRequest;
import c207.camference.api.request.dispatchstaff.PatientTransferRequest;
import c207.camference.api.request.dispatchstaff.PreKtasRequest;
import c207.camference.api.request.dispatchstaff.TransferUpdateRequest;
import c207.camference.api.request.patient.PatientInfoRequest;
import c207.camference.api.response.common.ResponseData;
import c207.camference.api.response.dispatchstaff.*;
import c207.camference.api.response.hospital.HospitalPatientTransferResponse;
import c207.camference.api.response.hospital.ReqHospitalResponse;
import c207.camference.api.response.report.DispatchDetailResponse;
import c207.camference.api.response.report.DispatchResponse;
import c207.camference.api.response.report.TransferDetailResponse;
import c207.camference.api.response.report.TransferResponse;
import c207.camference.api.service.webrtc.WebRtcService;
import c207.camference.api.service.sse.SseEmitterServiceImpl;
import c207.camference.db.entity.firestaff.DispatchGroup;
import c207.camference.db.entity.firestaff.DispatchStaff;
import c207.camference.db.entity.firestaff.FireStaff;
import c207.camference.db.entity.hospital.Hospital;
import c207.camference.db.entity.hospital.ReqHospital;
import c207.camference.db.entity.patient.Patient;
import c207.camference.db.entity.report.Call;
import c207.camference.db.entity.report.Dispatch;
import c207.camference.db.entity.report.Transfer;
import c207.camference.db.repository.firestaff.DispatchGroupRepository;
import c207.camference.db.repository.firestaff.DispatchStaffRepository;
import c207.camference.db.repository.firestaff.FireStaffRepository;
import c207.camference.db.repository.hospital.HospitalRepository;
import c207.camference.db.repository.hospital.ReqHospitalRepository;
import c207.camference.db.repository.patient.PatientRepository;
import c207.camference.db.repository.report.CallRepository;
import c207.camference.db.repository.report.DispatchRepository;
import c207.camference.db.repository.report.TransferRepository;
import c207.camference.db.repository.users.UserMediDetailRepository;
import c207.camference.util.openapi.OpenApiUtil;
import c207.camference.util.response.ResponseUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.json.XML;
import org.locationtech.jts.geom.Point;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.HttpURLConnection;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DispatchStaffServiceImpl implements DispatchStaffService {
    private final FireStaffRepository fireStaffRepository;
    private final DispatchStaffRepository dispatchStaffRepository;
    private final DispatchGroupRepository dispatchGroupRepository;
    private final DispatchRepository dispatchRepository;
    private final TransferRepository transferRepository;
    private final HospitalRepository hospitalRepository;
    private final ReqHospitalRepository reqHospitalRepository;
    private final ModelMapper modelMapper;
    private final PatientRepository patientRepository;
    private final UserMediDetailRepository userMediDetailRepository;
    private final ObjectMapper objectMapper;
    private final SseEmitterServiceImpl sseEmitterService;
    private final CallRepository callRepository;
    private final WebRtcService webRtcService;

    @Value("${openApi.serviceKey}")
    private String serviceKey;

    @Value("${openApi.availableHospitalUrl}")
    private String availableHospitalUrl;


    @Transactional
    @Override
    public ResponseEntity<?> getReports(){
        try{
            String fireStaffLoginId = SecurityContextHolder.getContext().getAuthentication().getName();

            // 1. FireStaff 조회
            FireStaff fireStaff = fireStaffRepository.findByFireStaffLoginId(fireStaffLoginId)
                    .orElseThrow(() -> new EntityNotFoundException("직원이 일치하지 않습니다."));
            System.out.println("FireStaff 조회 성공: " + fireStaff.getFireStaffName());

            // 2. DispatchStaff 조회
            DispatchStaff dispatchStaff = dispatchStaffRepository.findByFireStaff(fireStaff);
            if (dispatchStaff == null) {
                throw new EntityNotFoundException("해당 직원의 출동팀 정보가 없습니다.");
            }

            // 3. DispatchGroup 조회
            DispatchGroup dispatchGroup = dispatchStaff.getDispatchGroup();

            // 4. Dispatch 목록 조회
            List<Dispatch> dispatches = dispatchRepository.findByDispatchGroup(dispatchGroup);

            // 5. Transfer 목록 조회 및 Map으로 변환 (dispatchId를 키로 사용)
            Map<Integer, Transfer> transferMap = transferRepository.findByDispatchGroup(dispatchGroup)
                    .stream()
                    .collect(Collectors.toMap(
                            transfer -> transfer.getDispatchId(),
                            transfer -> transfer
                    ));

            // 6. 통합된 응답 생성
            List<DispatchResponse> reports = dispatches.stream()
                    .map(dispatch -> new DispatchResponse(
                            dispatch,
                            transferMap.get(dispatch.getDispatchId())
                    ))
                    .collect(Collectors.toList());

            ResponseData<List> response = ResponseUtil.success(reports, "출동기록 조회 완료");

            return ResponseEntity.status(HttpStatus.OK).body(response);

        } catch (EntityNotFoundException e) {
            System.out.println("EntityNotFoundException: " + e.getMessage());
            ResponseData<Void> response = ResponseUtil.fail(404, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            System.out.println("Exception: " + e.getMessage());
            e.printStackTrace();
            ResponseData<Void> response = ResponseUtil.fail(500, "서버 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }


    }

    @Transactional
    @Override
    public ResponseEntity<?> dispatchDetail(int dispatchId){
        try{
            Dispatch dispatch = dispatchRepository.findByDispatchId(dispatchId)
                    .orElseThrow(() -> new EntityNotFoundException("일치하는 출동내역이 없습니다."));

            DispatchDetailResponse dispatchDetailResponse = new DispatchDetailResponse(dispatch);

            ResponseData<DispatchDetailResponse> response = ResponseUtil.success(dispatchDetailResponse, "상세 조회 완료");
            return ResponseEntity.status(HttpStatus.OK).body(response);

        } catch (EntityNotFoundException e) {
            System.out.println("EntityNotFoundException: " + e.getMessage());
            ResponseData<Void> response = ResponseUtil.fail(404, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            System.out.println("Exception: " + e.getMessage());
            e.printStackTrace();
            ResponseData<Void> response = ResponseUtil.fail(500, "서버 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

    }

    @Transactional
    @Override
    public ResponseEntity<?> transferDetail(int transferId){
        try{
            Transfer transfer = transferRepository.findByTransferId(transferId)
                    .orElseThrow(() -> new EntityNotFoundException("일치하는 이송내역이 없습니다."));
            Patient patient = patientRepository.findByTransferId(transfer.getTransferId())
                    .orElseThrow(() -> new EntityNotFoundException("일치하는 환자가 없습니다."));

            TransferDetailResponse transferResponse = new TransferDetailResponse(transfer,patient, userMediDetailRepository);

            ResponseData<TransferDetailResponse> response = ResponseUtil.success(transferResponse, "상세 조회 완료");
            return ResponseEntity.status(HttpStatus.OK).body(response);

        } catch (EntityNotFoundException e) {
            System.out.println("EntityNotFoundException: " + e.getMessage());
            ResponseData<Void> response = ResponseUtil.fail(404, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            System.out.println("Exception: " + e.getMessage());
            e.printStackTrace();
            ResponseData<Void> response = ResponseUtil.fail(500, "서버 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

    }

    @Transactional
    @Override
    public ResponseEntity<?> getReportDetail(int dispatchId){
        try{
            List<Patient> patients = patientRepository.findPatientsByDispatchId(dispatchId);

            List<DispatchReportDetailResponse> data = patients.stream()
                    .map(patient->new DispatchReportDetailResponse(patient,userMediDetailRepository))
                    .collect(Collectors.toList());

            ResponseData<List> response = ResponseUtil.success(data, "상세 조회 완료");

            return ResponseEntity.status(HttpStatus.OK).body(response);

        } catch (EntityNotFoundException e) {
            System.out.println("EntityNotFoundException: " + e.getMessage());
            ResponseData<Void> response = ResponseUtil.fail(404, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            System.out.println("Exception: " + e.getMessage());
            e.printStackTrace();
            ResponseData<Void> response = ResponseUtil.fail(500, "서버 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

    }

    @Transactional
    @Override
    public ResponseEntity<?> getReqHospital(int dispatchId){
        try{
            List<ReqHospitalResponse> reqHospital = reqHospitalRepository.findReqHospitalsByDispatchId(dispatchId)
                    .stream().map(ReqHospitalResponse::new)
                    .collect(Collectors.toList());

            ResponseData<List> response = ResponseUtil.success(reqHospital, "상세 조회 완료");

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (EntityNotFoundException e) {
            System.out.println("EntityNotFoundException: " + e.getMessage());
            ResponseData<Void> response = ResponseUtil.fail(404, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            System.out.println("Exception: " + e.getMessage());
            e.printStackTrace();
            ResponseData<Void> response = ResponseUtil.fail(500, "서버 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @Transactional
    @Override
    public ResponseEntity<?> getAvailableHospital(String siDo, String siGunGu, Double longitude, Double latitude, Double range) {
        // List<AvailableHospitalResponse> responses = new ArrayList<>();
        HttpURLConnection urlConnection = null;

        /**
         * 여기서부터 수정된 로직(2025.02.17)
         */

        List<Object[]> results = hospitalRepository.findHospitalsWithinRadius(longitude, latitude, range);
        System.out.println("병원 리스트 : ");
        for (Object[] result : results) {
            System.out.printf(
                    "병원ID: %d, 병원명: %s, 경도: %.6f, 위도: %.6f, 거리: %.2fkm%n",
                    result[0],  // hospital_id
                    result[1],  // hospital_name
                    result[2],  // longitude
                    result[3],  // latitude
                    result[4],   // distance_km
                    result[5],  // latitude
                    result[6]   // distance_km
            );
        }

        List<AvailableHospitalResponse> responses = results.stream()
                .map(result -> AvailableHospitalResponse.builder()
                        .hospitalId((Integer) result[0])
                        .hospitalName((String) result[1])
                        .hospitalLng((Double) result[2])
                        .hospitalLat((Double) result[3])
                        .distance((Double) result[4])
                        .hospitalPhone((String) result[5])
                        .hospitalAddress((String) result[6])
                        .hospitalCapacity(null)  // 아직 이 정보는 조회하지 않음
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok().body(ResponseUtil.success(responses, "가용 가능한 응급실 조회 성공"));
        /**
         * 수정된 로직 끝
         * 이제 이 밑에 필터링한 결과가 가용가능한지를 Open API로 검색을 해야 한다.
         */
//        try {
//            String urlStr = availableHospitalUrl +
//                    "?ServiceKey=" + serviceKey +
//                    "&STAGE1=" + URLEncoder.encode(siDo, StandardCharsets.UTF_8) +
//                    "&STAGE2=" + URLEncoder.encode(siGunGu, StandardCharsets.UTF_8) +
//                    "&numOfRows=" + 100;
//
//            String response = OpenApiUtil.getHttpResponse(urlStr);
//            JSONObject jsonResponse = XML.toJSONObject(response);
//            String jsonStr = jsonResponse.toString();
//
//            JsonNode root = objectMapper.readTree(jsonStr);
//            JsonNode itemNode = root.path("response").path("body").path("items").path("item");
//
//            // item이 단일 객체인 경우
//            if (itemNode.isObject()) {
//                processHospitalItem(itemNode, responses, longitude, latitude, range);
//            }
//            // item이 배열인 경우
//            else if (itemNode.isArray()) {
//                for (JsonNode item : itemNode) {
//                    processHospitalItem(item, responses, longitude, latitude, range);
//                }
//            }
//
//            return ResponseEntity.ok().body(ResponseUtil.success(responses, "가용 가능한 응급실 조회 성공"));
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            throw new RuntimeException("병원 정보 조회 중 오류 발생", e);
//        } finally {
//            if (urlConnection != null) {
//                urlConnection.disconnect();
//            }
//        }
    }

    private void processHospitalItem(JsonNode item, List<AvailableHospitalResponse> responses,
                                     Double longitude, Double latitude, Double range) {
        System.out.println("Processing item: " + item);  // 디버깅용
        String hospitalName = item.get("dutyName").asText();
        System.out.println("Hospital Name: " + hospitalName);  // 디버깅용

        Hospital hospital = hospitalRepository.findByHospitalName(hospitalName)
                .orElse(null);

        if (hospital != null) {
            AvailableHospitalResponse availableHospitalResponse = AvailableHospitalResponse.builder()
                    .hospitalId(hospital.getHospitalId())
                    .hospitalName(hospitalName)
                    .hospitalPhone(hospital.getHospitalPhone())
                    .hospitalCapacity(item.get("hvec").asInt())
                    .hospitalAddress(hospital.getHospitalAddress())
                    .hospitalLng(hospital.getHospitalLocation().getX())
                    .hospitalLat(hospital.getHospitalLocation().getY())
                    .build();

            Point latLong = hospital.getHospitalLocation();
            double distance = hospitalRepository.calculateDistance(
                    latLong.getX(), latLong.getY(), longitude, latitude);

            if(range >= distance && distance >= range - 1.0){
                availableHospitalResponse.setDistance(distance);
                responses.add(availableHospitalResponse);
            }
        }
    }

    @Override
    @Transactional
    public ResponseEntity<?> transferRequest(PatientTransferRequest request) {
        Dispatch dispatch = dispatchRepository.findById(request.getDispatchId())
                .orElseThrow(() -> new RuntimeException("일치하는 출동 정보가 없습니다."));
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("일치하는 환자 정보가 없습니다."));

        System.out.println("요청된 병원 IDs: " + request.getHospitalIds());
        List<Hospital> hospitals = hospitalRepository.findAllByHospitalIdIn(request.getHospitalIds());
        System.out.println("찾은 병원 목록: " + hospitals);
        List<Hospital> activeHospitals = hospitals.stream()
                .filter(Hospital::getHospitalIsActive)
                .collect(Collectors.toList());
        if (activeHospitals.isEmpty()) {
            throw new RuntimeException("활성화된 병원이 없습니다.");
        }

        List<String> reqHospitalNames = new ArrayList<>();
        for (Hospital hospital : activeHospitals) {
            // reqHospital insert
            ReqHospital reqHospital = ReqHospital.builder()
                    .hospitalId(hospital.getHospitalId())
                    .dispatchId(request.getDispatchId())
                    .reqHospitalCreatedAt(LocalDateTime.now())
                    .build();
            reqHospitalRepository.save(reqHospital);
            reqHospitalNames.add(hospital.getHospitalName());

        }
        DispatchGroupPatientTransferResponse sseDispatchGroupResponse = new DispatchGroupPatientTransferResponse(dispatch, reqHospitalNames, patient);
        HospitalPatientTransferResponse sseHospitalResponse = new HospitalPatientTransferResponse(dispatch, patient, userMediDetailRepository);

        // SSE
        sseEmitterService.transferRequest(sseDispatchGroupResponse, sseHospitalResponse);
        return ResponseEntity.ok().body(ResponseUtil.success("응급실에 환자 수용 요청 전송 성공"));
    }

    @Override
    @Transactional
    public ResponseEntity<?> transferUpdate(TransferUpdateRequest request) {
        Transfer transfer = transferRepository.findByTransferId(request.getTransferId())
                .orElseThrow(() -> new RuntimeException("일치하는 이송 내역이 없습니다."));

        transfer.setTransferIsComplete(true);
        transfer.setTransferArriveAt(LocalDateTime.now());
        transferRepository.save(transfer);

        TransferUpdateResponse response = new TransferUpdateResponse(transfer);

        return ResponseEntity.ok().body(ResponseUtil.success(response, "병원 인계여부 수정 성공"));
    }

    @Override
    @Transactional
    public ResponseEntity<?> updatePatientInfo(PatientInfoRequest request){

        try{
            Patient patient = patientRepository.findById(request.getPatientId())
                    .orElseThrow(()->new EntityNotFoundException("환자 정보가 없습니다."));


            ModelMapper modelMapper = new ModelMapper();
            modelMapper.getConfiguration().setSkipNullEnabled(true);

            // 요청 객체에서 null이 아닌 필드만 user 객체에 업데이트
            modelMapper.map(request, patient);

            patientRepository.saveAndFlush(patient);


            Map<String, Integer> data = new HashMap<>();
            data.put("patientId", patient.getPatientId());

            ResponseData<Map<String, Integer>> response = ResponseUtil.success(data, "환자 정보변경 완료");
            return ResponseEntity.status(HttpStatus.OK).body(response);


        } catch (EntityNotFoundException e) {
            System.out.println("EntityNotFoundException: " + e.getMessage());
            ResponseData<Void> response = ResponseUtil.fail(404, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            System.out.println("Exception: " + e.getMessage());
            e.printStackTrace();
            ResponseData<Void> response = ResponseUtil.fail(500, "서버 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /** 출동 시간 수정 → 영상통화 참여가 트리거
     *
     * @param request
     * @return ResponseEntity(dispatch 테이블)
     */
    @Override
    public ResponseEntity<?> updateDepartTime(DispatchRequest request) {
        Integer dispatchId = request.getDispatchId();
        Dispatch dispatch = dispatchRepository.findById(dispatchId)
                .orElseThrow(() -> new RuntimeException("일치하는 출동 정보가 없습니다."));

        dispatch.setDispatchDepartAt(LocalDateTime.now());
        System.out.println(dispatch.getDispatchDepartAt());
        dispatchRepository.save(dispatch);


        Map<String, Object> response = new HashMap<>();
        response.put("dispatch", dispatch);
        response.put("message", "출동시간 수정 완료");

        return ResponseEntity.ok().body(response);
    }

    /**
     * 현장 도착 시간 수정 → 영상통화 종료가 트리거
     * @param request
     * @return ResponseEntity(dispatch 객체, 메시지)
     */
    @Override
    public ResponseEntity<?> updateDispatchArriveAt(DispatchRequest request) {
        Integer dispatchId = request.getDispatchId();
        Dispatch dispatch = dispatchRepository.findById(dispatchId)
                .orElseThrow(() -> new RuntimeException("일치하는 출동 정보가 없습니다."));

        dispatch.setDispatchArriveAt(LocalDateTime.now());
        dispatch=dispatchRepository.saveAndFlush(dispatch);


        Map<String, Object> response = new HashMap<>();
        response.put("dispatch", dispatch);
        response.put("message", "출동시간 수정 완료");

        return ResponseEntity.ok().body(response);
    }

    @Override
    @Transactional
    public ResponseEntity<?> finishDispatch(DispatchRequest request) {
        Dispatch dispatch = dispatchRepository.findById(request.getDispatchId())
                .orElseThrow(() -> new RuntimeException("일치하는 출동 정보가 없습니다."));

        dispatch.getDispatchGroup().setDispatchGroupIsReady(true);
        dispatch.setDispatchArriveAt(LocalDateTime.now());

        FinishDispatchResponse response = new FinishDispatchResponse(dispatch, dispatch.getDispatchGroup());
        return ResponseEntity.ok().body(ResponseUtil.success(response, "현장에서 상황 종료"));
    }

    /**
     * Google STT를 통해서 텍스트로 변환한 신고 내역을 바탕으로 preKTAS를 대략적으로 진단해주는 메서드
     * @param request
     * @return ResponseEntity(preKTAS추측값, 메시지)
     */
    @Override
    public ResponseEntity<?> getPreKtas(PreKtasRequest request) {

        int preKTAS = webRtcService.getPreKtas(request);

        System.out.println(preKTAS);

        Map<String, Object> response = new HashMap<>();
        if(preKTAS >= 1 && preKTAS <= 5){
            response.put("patientPreKtas", preKTAS);
            response.put("message", "preKTAS 환자 중증도 분류 성공");
        }
        else{
            response.put("patientPreKtas", "");
            response.put("message", "서버 오류");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        return ResponseEntity.ok().body(response);
    }
}
