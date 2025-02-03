package c207.camference.api.service.hospital;

import c207.camference.api.response.common.ResponseData;
import c207.camference.api.response.report.TransferResponse;
import c207.camference.db.entity.hospital.Hospital;
import c207.camference.db.entity.patient.Patient;
import c207.camference.db.entity.report.Transfer;
import c207.camference.db.repository.hospital.HospitalRepository;
import c207.camference.db.repository.patient.PatientRepository;
import c207.camference.db.repository.report.TransferRepository;
import c207.camference.util.response.ResponseUtil;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HospitalServiceImpl implements HospitalService {

    TransferRepository transferRepository;
    HospitalRepository hospitalRepository;
    PatientRepository patientRepository;

    public HospitalServiceImpl(TransferRepository transferRepository, HospitalRepository hospitalRepository, PatientRepository patientRepository) {
        this.transferRepository = transferRepository;
        this.hospitalRepository = hospitalRepository;
        this.patientRepository = patientRepository;
    }

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

            TransferDetailResponse transferResponse = new TransferDetailResponse(transfer,patient);

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
}
