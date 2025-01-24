package c207.camference.api.service.admin;

import c207.camference.db.entity.Admin;
import c207.camference.db.repository.AdminRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
public class AdminDetailsService implements UserDetailsService {
    private final AdminRepository adminRepository;

    public AdminDetailsService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String adminLoginId) throws UsernameNotFoundException {
        Admin admin = adminRepository.findByAdminLoginId(adminLoginId)
                .orElseThrow(() -> new UsernameNotFoundException("입력하신 이메일로 가입된 사용자를 찾을 수 없습니다.: " + adminLoginId));
        return new org.springframework.security.core.userdetails.User(
                admin.getAdminLoginId(),
                admin.getAdminPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN")));
        // role을 가져와서 만드는게 아니라 직접 만드는 방법
    }
}
