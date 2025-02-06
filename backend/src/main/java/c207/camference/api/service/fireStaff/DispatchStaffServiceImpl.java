package c207.camference.api.service.fireStaff;

import c207.camference.api.request.dispatchstaff.TransferUpdateRequest;
import c207.camference.api.response.common.ResponseData;
import c207.camference.api.response.dispatchstaff.AvailableHospitalResponse;
import c207.camference.api.response.dispatchstaff.TransferUpdateResponse;
import c207.camference.api.response.hospital.ReqHospitalResponse;
import c207.camference.api.response.report.DispatchDetailResponse;
import c207.camference.api.response.report.DispatchResponse;
import c207.camference.api.response.report.TransferDetailResponse;
import c207.camference.api.response.report.TransferResponse;
import c207.camference.db.entity.firestaff.DispatchGroup;
import c207.camference.db.entity.firestaff.DispatchStaff;
import c207.camference.db.entity.firestaff.FireStaff;
import c207.camference.db.entity.hospital.Hospital;
import c207.camference.db.entity.patient.Patient;
import c207.camference.db.entity.report.Dispatch;
import c207.camference.db.entity.report.Transfer;
import c207.camference.db.repository.firestaff.DispatchGroupRepository;
import c207.camference.db.repository.firestaff.DispatchStaffRepository;
import c207.camference.db.repository.firestaff.FireStaffRepository;
import c207.camference.db.repository.hospital.HospitalRepository;
import c207.camference.db.repository.hospital.ReqHospitalRepository;
import c207.camference.db.repository.patient.PatientRepository;
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
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.net.HttpURLConnection;
import java.net.URLEncoder;
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

    @Value("${openApi.serviceKey}")
    private String serviceKey;

    @Value("${openApi.availableHospitalUrl}")
    private String availableHospitalUrl;


    @Override
    public ResponseEntity<?> getReports(){
        try{
            String fireStaffLoginId = SecurityContextHolder.getContext().getAuthentication().getName();
            System.out.println("입력된 ID: " + fireStaffLoginId);

            // 1. FireStaff 조회
            FireStaff fireStaff = fireStaffRepository.findByFireStaffLoginId(fireStaffLoginId)
                    .orElseThrow(() -> new EntityNotFoundException("직원이 일치하지 않습니다."));
            System.out.println("FireStaff 조회 성공: " + fireStaff.getFireStaffName());

            // 2. DispatchStaff 조회
            DispatchStaff dispatchStaff = dispatchStaffRepository.findByFireStaff(fireStaff);
            if (dispatchStaff == null) {
                throw new EntityNotFoundException("해당 직원의 출동팀 정보가 없습니다.");
            }
            System.out.println("DispatchStaff 조회 성공: " + dispatchStaff.getDispatchGroup().getDispatchGroupId());

            // 3. DispatchGroup 조회
            DispatchGroup dispatchGroup = dispatchStaff.getDispatchGroup();
            System.out.println("DispatchGroup 조회 성공: " + dispatchGroup.getDispatchGroupId());

            // 4. Transfer와 Dispatch 조회
            List<TransferResponse> transfers = transferRepository.findByDispatchGroup(dispatchGroup)
                    .stream().map(TransferResponse::new)
                    .collect(Collectors.toList());
            List<DispatchResponse> dispatches = dispatchRepository.findByDispatchGroup(dispatchGroup)
                    .stream().map(DispatchResponse::new)
                    .collect(Collectors.toList());


            Map<String, Object> data = new HashMap<>();
            data.put("transfer", transfers);
            data.put("dispatch", dispatches);

            ResponseData<Map> response = ResponseUtil.success(data, "전체 조회 완료");
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
    };

    public ResponseEntity<?> getAvailableHospital(String siDo, String siGunGu) {
        List<AvailableHospitalResponse> responses = new ArrayList<>();
        HttpURLConnection urlConnection = null;

        try {
            String urlStr = availableHospitalUrl +
                    "?ServiceKey=" + serviceKey +  // serviceKey는 인코딩하지 않음
                    "&STAGE1=" + URLEncoder.encode(siDo, "UTF-8") +
                    "&STAGE2=" + URLEncoder.encode(siGunGu, "UTF-8") +
                    "&numOfRows=" + 100;

            String response = OpenApiUtil.getHttpResponse(urlStr);
            JSONObject jsonResponse = XML.toJSONObject(response); // XML 문자열 -> JSON 객체
            String jsonStr = jsonResponse.toString();

            JsonNode root = objectMapper.readTree(jsonStr);
            JsonNode itemArray = root.path("response").path("body").path("items").path("item");

            for (JsonNode item : itemArray) {
                String hospitalName = item.path("dutyName").asText();
                Hospital hospital = hospitalRepository.findByHospitalName(hospitalName)
                        .orElse(null);

                AvailableHospitalResponse availableHospitalResponse = AvailableHospitalResponse.builder()
                        .hospitalId(hospital.getHospitalId())
                        .hospitalName(hospitalName)
                        .hospitalPhone(hospital.getHospitalPhone())
                        .hospitalCapacity(item.path("hvec").asInt())
                        .hospitalAddress(hospital.getHospitalAddress())
                        .hospitalLocation(hospital.getHospitalLocation())
                        .build();

                responses.add(availableHospitalResponse);
            }
            return ResponseEntity.ok().body(ResponseUtil.success(responses, "가용 가능한 응급실 조회 성공"));


        } catch (Exception e) {
            throw new RuntimeException("병원 정보 조회 중 오류 발생", e);
        } finally {
            if (urlConnection != null) {
                urlConnection.disconnect();
            }
        }
    }

    @Override
    public ResponseEntity<?> transferUpdate(TransferUpdateRequest request) {
        Transfer transfer = transferRepository.findByTransferId(request.getTransferId())
                .orElseThrow(() -> new RuntimeException("일치하는 이송 내역이 없습니다."));

        transfer.setTransferIsComplete(true);
        transfer.setTransferArriveAt(LocalDateTime.now());
        transferRepository.save(transfer);

        TransferUpdateResponse response = new TransferUpdateResponse(transfer);

        return ResponseEntity.ok().body(ResponseUtil.success(response, "병원 인계여부 수정 성공"));
    }
}
