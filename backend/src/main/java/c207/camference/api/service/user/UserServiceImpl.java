package c207.camference.api.service.user;

import c207.camference.api.request.user.UserCreateRequest;
import c207.camference.api.request.user.UserUpdateRequest;
import c207.camference.api.response.common.ResponseData;
import c207.camference.api.response.user.UserResponse;
import c207.camference.db.entity.User;
import c207.camference.db.repository.UserRepository;
import c207.camference.util.response.ResponseUtil;
import jakarta.mail.Message;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.apache.commons.validator.routines.EmailValidator;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public ResponseEntity<?> createUser(UserCreateRequest request){
        try{
            User user = modelMapper.map(request, User.class);
            userRepository.save(user);
            //비밀번호 암호화
            user.setUserPassword(bCryptPasswordEncoder.encode(user.getUserPassword()));
            UserResponse userResponse = modelMapper.map(user, UserResponse.class);
            ResponseData<UserResponse> response = ResponseUtil.success(userResponse, "회원 가입이 완료되었습니다.");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }catch (Exception e){
            ResponseData<Void> response = ResponseUtil.fail(500,"서버 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

    };

    @Override
    @Transactional
    public ResponseEntity<?> validEmail(String userEmail){
        try {
            EmailValidator validator = EmailValidator.getInstance();
            //이메일 형식 확인
            if(!validator.isValid(userEmail)){
                ResponseData<?> response = ResponseUtil.fail(400,"메일 형식이 다릅니다.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            if (userRepository.existsByUserEmail(userEmail)){
                //이메일 형식이 다르거나 이미 있는 메일이면 (사용불가)
                ResponseData<?> response = ResponseUtil.fail(409,"이미 있는 이메일입니다..");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
            }
            //없는 메일이다.(사용가능)
            ResponseData<?> response = ResponseUtil.success("가입 가능한 메일입니다.");
            return ResponseEntity.status(HttpStatus.OK).body(response);

        }catch (Exception e){
            ResponseData<?> response = ResponseUtil.fail(500,"서버 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @Override
    @Transactional
    public ResponseEntity<?> getUserByEmail(){
        try{
            String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findUserByUserEmail(userEmail);
            UserResponse userResponse = modelMapper.map(user, UserResponse.class);
            ResponseData<UserResponse> response = ResponseUtil.success(userResponse, "유저 상세조회 완료했습니다.");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception e){
            ResponseData<Void> response = ResponseUtil.fail(500,"서버 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @Override
    @Transactional
    public ResponseEntity<?> updateUser(UserUpdateRequest request){
        try{
            String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findUserByUserEmail(userEmail);

            ModelMapper modelMapper = new ModelMapper();
            modelMapper.getConfiguration().setSkipNullEnabled(true);

            // 요청 객체에서 null이 아닌 필드만 user 객체에 업데이트
            modelMapper.map(request, user);

            userRepository.saveAndFlush(user);

            UserResponse userResponse = modelMapper.map(user, UserResponse.class);
            ResponseData<UserResponse> response = ResponseUtil.success(userResponse, "유저 정보변경 완료했습니다.");
            return ResponseEntity.status(HttpStatus.OK).body(response);

        }catch (Exception e){
            ResponseData<Void> response = ResponseUtil.fail(500,"서버 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
