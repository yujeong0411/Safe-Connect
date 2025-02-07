package c207.camference.api.service.user;

import org.springframework.http.ResponseEntity;

import java.util.List;

public interface UserMediService {

    ResponseEntity<?> getUserMediInfo(String token);
    ResponseEntity<?> saveMediInfo(String token, List<Integer> mediIds);
    ResponseEntity<?> updateMediInfo(String token, List<Integer> mediIds);
    ResponseEntity<?> getMediList();
}
