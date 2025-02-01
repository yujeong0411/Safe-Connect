package c207.camference.api.service.fireStaff;

import c207.camference.db.entity.firestaff.FireStaff;
import c207.camference.db.repository.firestaff.FireStaffRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class FireStaffDetailsService implements UserDetailsService {
    private final FireStaffRepository fireStaffRepository;

    public FireStaffDetailsService(FireStaffRepository fireStaffRepository) {
        this.fireStaffRepository = fireStaffRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        FireStaff fireStaff =  fireStaffRepository.findByFireStaffLoginId(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if(fireStaff.getFireStaffCategory()=='C'){
            return new org.springframework.security.core.userdetails.User(
                    fireStaff.getFireStaffLoginId(),
                    fireStaff.getFireStaffPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_CONTROL")));
        }else {
            return new org.springframework.security.core.userdetails.User(
                    fireStaff.getFireStaffLoginId(),
                    fireStaff.getFireStaffPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_DISPATCH")));
        }

    }
}
