package c207.camference.api.service.user;

import org.springframework.http.ResponseEntity;

import java.util.List;

public interface UserMediService {

    ResponseEntity<?> getUserMediInfo();
    ResponseEntity<?> saveMediInfo(List<Integer> mediIds);
    ResponseEntity<?> updateMediInfo(List<Integer> mediIds);
    ResponseEntity<?> getMediList();
}
