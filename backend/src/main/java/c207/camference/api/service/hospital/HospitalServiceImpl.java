package c207.camference.api.service.hospital;

import c207.camference.api.response.common.ResponseData;
import c207.camference.api.response.dispatchstaff.TransferStatusRequest;
import c207.camference.api.response.hospital.AcceptTransferResponse;
import c207.camference.api.response.hospital.AcceptedHospitalResponse;
import c207.camference.api.response.hospital.TransferRequestResponse;
import c207.camference.api.response.patient.PatientDetailResponse;
import c207.camference.api.response.report.TransferDetailResponse;
import c207.camference.api.response.report.TransferResponse;
import c207.camference.api.service.sse.SseEmitterServiceImpl;
import c207.camference.db.entity.hospital.Hospital;
import c207.camference.db.entity.patient.Patient;
import c207.camference.db.entity.report.Dispatch;
import c207.camference.db.entity.report.Transfer;
import c207.camference.db.repository.hospital.HospitalRepository;
import c207.camference.db.repository.hospital.ReqHospitalRepository;
import c207.camference.db.repository.patient.PatientRepository;
import c207.camference.db.repository.report.DispatchRepository;
import c207.camference.db.repository.report.TransferRepository;
import c207.camference.db.repository.users.UserMediDetailRepository;
import c207.camference.util.response.ResponseUtil;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HospitalServiceImpl implements HospitalService {

    private final SseEmitterServiceImpl sseEmitterService;
    private final ReqHospitalRepository reqHospitalRepository;
    private final TransferRepository transferRepository;
    private final HospitalRepository hospitalRepository;
    private final PatientRepository patientRepository;
    private final UserMediDetailRepository userMediDetailRepository;
    private final DispatchRepository dispatchRepository;

    @Override
    @Transactional
    public ResponseEntity<?> getTransferAccepted(){
        try{
            String HospitalLoginId = SecurityContextHolder.getContext().getAuthentication().getName();
            Hospital hospital = hospitalRepository.findByHospitalLoginId(HospitalLoginId)
                    .orElseThrow(() -> new EntityNotFoundException(HospitalLoginId));


            List<TransferResponse> transferResponses = transferRepository.findByHospital(hospital)
                    .stream().map(TransferResponse::new)
                    .collect(Collectors.toList());
            ResponseData<List> response = ResponseUtil.success(transferResponses, "전체 조회 완료");
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
    @Transactional
    public ResponseEntity<?> getTransferAcceptedDetail(int transferId){
        try{

            Transfer transfer = transferRepository.findByTransferId(transferId)
                    .orElseThrow(() -> new EntityNotFoundException(String.valueOf(transferId)));
            Patient patient = patientRepository.findByTransfer(transfer);

            TransferDetailResponse transferResponse = new TransferDetailResponse(transfer,patient,userMediDetailRepository);

            ResponseData<TransferDetailResponse> response = ResponseUtil.success(transferResponse, "전체 조회 완료");
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
    @Transactional
    // 환자 이송 수락/거절
    public ResponseEntity<?> respondToTransfer(TransferStatusRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new EntityNotFoundException("Patient not found with id: " + request.getPatientId()));
        Dispatch dispatch = dispatchRepository.findById(patient.getDispatchId())
                .orElseThrow(() -> new EntityNotFoundException("Dispatch not found with id: " + patient.getDispatchId()));


        if (request.getStatus().equals(TransferStatus.ACCEPTED.name())) {
            LocalDateTime now = LocalDateTime.now();

            // transfer insert
            Transfer transfer = new Transfer();
            transfer.setDispatchGroupId(dispatch.getDispatchGroupId());
            transfer.setDispatchId(dispatch.getDispatchId());
            transfer.setTransferAcceptAt(now);

            // 구급팀 알림 전송
            String hospitalLoginId = SecurityContextHolder.getContext().getAuthentication().getName();
            Hospital hospital = hospitalRepository.findByHospitalLoginId(hospitalLoginId)
                    .orElseThrow(() -> new RuntimeException("일치하는 병원이 없습니다."));

            dispatch.setDispatchTransferAccepted(true);
            dispatchRepository.save(dispatch);

            transfer.setHospitalId(hospital.getHospitalId());
            Transfer savedTransfer = transferRepository.saveAndFlush(transfer);

            patient.setTransferId(transfer.getTransferId());
            patientRepository.save(patient);

            AcceptedHospitalResponse data = AcceptedHospitalResponse.builder()
                    .transferId(savedTransfer.getTransferId())
                    .hospitalId(hospital.getHospitalId())
                    .hospitalName(hospital.getHospitalName())
                    .latitude(hospital.getHospitalLocation().getY())
                    .longitude(hospital.getHospitalLocation().getX())
                    .build();

            sseEmitterService.hospitalResponse(data, true);
            // HTTP 응답
            AcceptTransferResponse response = new AcceptTransferResponse(request.getPatientId(), hospital.getHospitalId(), savedTransfer.getTransferId(), now);
            return ResponseEntity.ok().body(ResponseUtil.success(response, "환자 이송을 수락했습니다."));
        }

        return ResponseEntity.badRequest().body(request.getStatus() + " is invalid status. " +
                "Valid status: " + Arrays.toString(TransferStatus.values()));
    }

    @Override
    @Transactional
    public ResponseEntity<?> transferRequest(){

        try{
            String HospitalLoginId = SecurityContextHolder.getContext().getAuthentication().getName();
            int hospitalId = hospitalRepository.findByHospitalLoginId(HospitalLoginId)
                    .orElseThrow(() -> new EntityNotFoundException(HospitalLoginId)).getHospitalId();

            List<TransferRequestResponse> responses = TransferRequestResponse.of(hospitalId, reqHospitalRepository, patientRepository);

            ResponseData<List> response = ResponseUtil.success(responses, "전체 조회 완료");

            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (EntityNotFoundException e) {
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
    @Transactional
    public ResponseEntity<?> transferRequestDetail(int dispatchId){
        try{
            List<Patient> patients = patientRepository.findAllByDispatchId(dispatchId);

            List<PatientDetailResponse> responses = patients.stream().map(patient -> new PatientDetailResponse(patient,userMediDetailRepository))
                    .collect(Collectors.toList());

            return ResponseEntity.status(HttpStatus.OK).body(responses);

        }catch (EntityNotFoundException e) {
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
}
