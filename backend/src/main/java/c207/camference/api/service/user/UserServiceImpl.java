package c207.camference.api.service.user;

import c207.camference.api.request.user.UserCreateRequest;
import c207.camference.db.entity.User;
import c207.camference.db.repository.UserRepository;
import jakarta.mail.Message;
import lombok.RequiredArgsConstructor;
import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.apache.commons.validator.routines.EmailValidator;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final ModelMapper modelMapper;

    @Override
    public void createUser(UserCreateRequest request){

        //중복 체크는 미리 다른 url로 할 것이기 때문에 따로 검증하지 않는다.

        //UserCreateRequest에 있는 값들을 그대로 받으면 자동으로 추가한다.
        User user = modelMapper.map(request, User.class);

        //비밀번호 암호화
        user.setUserPassword(bCryptPasswordEncoder.encode(user.getUserPassword()));
        userRepository.save(user);

    };

    @Override
    public Boolean validEmail(String userEmail){


        if (userRepository.existsByUserEmail(userEmail)){
            //이메일 형식이 다르거나 이미 있는 메일이면 (사용불가)
            return false;
        }
        //없는 메일이다.(사용가능)
        return true;
    }

}
