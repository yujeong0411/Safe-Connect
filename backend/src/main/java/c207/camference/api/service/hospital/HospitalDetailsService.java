package c207.camference.api.service.hospital;

import c207.camference.db.entity.hospital.Hospital;
import c207.camference.db.repository.hospital.HospitalRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
public class HospitalDetailsService implements UserDetailsService {
    private final HospitalRepository hospitalRepository;

    public HospitalDetailsService(HospitalRepository hospitalRepository) {
        this.hospitalRepository = hospitalRepository;
    }

    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String hospitalLoginId) throws UsernameNotFoundException {
        Hospital hospital = hospitalRepository.findByHospitalLoginId(hospitalLoginId)
                .orElseThrow(() -> new UsernameNotFoundException("입력하신 이메일로 가입된 사용자를 찾을 수 없습니다.: " + hospitalLoginId));
        return new org.springframework.security.core.userdetails.User(
                hospital.getHospitalLoginId(),
                hospital.getHospitalPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_HOSP")));
        // role을 가져와서 만드는게 아니라 직접 만드는 방법
    }
}