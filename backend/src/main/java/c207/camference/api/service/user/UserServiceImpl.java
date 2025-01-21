package c207.camference.api.service.user;

import c207.camference.api.request.user.UserCreateRequest;
import c207.camference.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private UserRepository userRepository;

    @Override
    public void createUser(UserCreateRequest request){


    };
}
