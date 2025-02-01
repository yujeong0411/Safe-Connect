package c207.camference.api.service.fireStaff;

import c207.camference.api.response.common.ResponseData;
import c207.camference.api.response.report.DispatchResponse;
import c207.camference.api.response.report.TransferResponse;
import c207.camference.db.entity.firestaff.DispatchGroup;
import c207.camference.db.entity.firestaff.DispatchStaff;
import c207.camference.db.entity.firestaff.FireStaff;
import c207.camference.db.entity.report.Dispatch;
import c207.camference.db.entity.report.Transfer;
import c207.camference.db.repository.firestaff.DispatchGroupRepository;
import c207.camference.db.repository.firestaff.DispatchStaffRepository;
import c207.camference.db.repository.firestaff.FireStaffRepository;
import c207.camference.db.repository.report.DispatchRepository;
import c207.camference.db.repository.report.TransferRepository;
import c207.camference.util.response.ResponseUtil;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DispatchStaffServiceImpl implements DispatchStaffService {
    private final FireStaffRepository fireStaffRepository;
    private final DispatchStaffRepository dispatchStaffRepository;
    private final DispatchGroupRepository dispatchGroupRepository;
    private final DispatchRepository dispatchRepository;
    private final TransferRepository transferRepository;

    public DispatchStaffServiceImpl(
            FireStaffRepository fireStaffRepository,
            DispatchStaffRepository dispatchStaffRepository,
            DispatchGroupRepository dispatchGroupRepository,
            DispatchRepository dispatchRepository,
            TransferRepository transferRepository) {
        this.fireStaffRepository = fireStaffRepository;
        this.dispatchStaffRepository = dispatchStaffRepository;
        this.dispatchGroupRepository = dispatchGroupRepository;
        this.dispatchRepository = dispatchRepository;
        this.transferRepository = transferRepository;
    }

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
}
