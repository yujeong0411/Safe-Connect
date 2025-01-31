package c207.camference.api.service.fireStaff;

import c207.camference.api.response.common.ResponseData;
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

@Service
@RequiredArgsConstructor
public class DispatchStaffServiceImpl implements DispatchStaffService {
    private FireStaffRepository fireStaffRepository;
    private DispatchStaffRepository dispatchStaffRepository;
    private DispatchGroupRepository dispatchGroupRepository;
    private DispatchRepository dispatchRepository;
    private TransferRepository transferRepository;

    public DispatchStaffServiceImpl(FireStaffRepository fireStaffRepository, DispatchStaffRepository dispatchStaffRepository, DispatchGroupRepository dispatchGroupRepository, DispatchRepository dispatchRepository, TransferRepository transferRepository) {
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
            Optional<FireStaff> result = fireStaffRepository.findByFireStaffLoginId(fireStaffLoginId);
            if (result.isPresent()) {
                System.out.println("조회된 직원 정보: " + result.get().getFireStaffName());  // 또는 다른 필드
                FireStaff fireStaff = result.get();
                System.out.println("소방서 정보: " + fireStaff.getFireDept().getFireDeptName());  // 연관된 소방서 정보
            } else {
                System.out.println("직원 정보를 찾을 수 없습니다.");
                result.orElseThrow();
            }
//            System.out.println(fireStaffLoginId);
            FireStaff fireStaff = fireStaffRepository.findByFireStaffLoginId(fireStaffLoginId)
                    .orElseThrow(() -> new EntityNotFoundException("직원이 일치하지 않습니다."));
//
            System.out.println("222222222222");

            //직원 찾고, 직원 팀찾고, 직원
            DispatchStaff dispatchStaff = dispatchStaffRepository.findByFireStaff(fireStaff);
            DispatchGroup dispatchGroup = dispatchStaff.getDispatchGroup();
            System.out.println("33333333333");

            List<Transfer> transfers = transferRepository.findByDispatchGroup(dispatchGroup);
            List<Dispatch> dispatches = dispatchRepository.findByDispatchGroup(dispatchGroup);

            Map<String, Object> data = new HashMap<>();
            data.put("transfer", transfers);
            data.put("dispatch", dispatches);

            //비밀번호 암호화
            ResponseData<Map> response = ResponseUtil.success(data, "전체 조회 완료");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception e){
            ResponseData<Void> response = ResponseUtil.fail(500,"서버 오류가 발생");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }


    }
}
