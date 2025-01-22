package c207.camference.api.service.user;

import c207.camference.api.dto.user.CustomUserDetails;
import c207.camference.db.entity.User;
import c207.camference.db.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String userEmail) throws UsernameNotFoundException {
        User userData = userRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("입력하신 이메일로 가입된 사용자를 찾을 수 없습니다.: " + userEmail));
        return new CustomUserDetails(userData);
    }
}