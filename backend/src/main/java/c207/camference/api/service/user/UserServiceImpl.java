package c207.camference.api.service.user;

import c207.camference.api.request.user.UserCreateRequest;
import c207.camference.api.request.user.UserPasswordChangeRequest;
import c207.camference.api.request.user.UserUpdateRequest;
import c207.camference.api.response.common.ResponseData;
import c207.camference.api.response.user.UserEmailResponse;
import c207.camference.api.response.user.UserResponse;
import c207.camference.db.entity.users.User;
import c207.camference.db.repository.users.UserRepository;
import c207.camference.util.response.ResponseUtil;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.commons.validator.routines.EmailValidator;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final ModelMapper modelMapper;
    private final JavaMailSender javaMailSender;




    @Override
    @Transactional
    public ResponseEntity<?> createUser(UserCreateRequest request){
        try{
            User user = modelMapper.map(request, User.class);
            userRepository.save(user);
            //비밀번호 암호화
            user.setUserPassword(bCryptPasswordEncoder.encode(user.getUserPassword()));
            UserResponse userResponse = modelMapper.map(user, UserResponse.class);
            ResponseData<UserResponse> response = ResponseUtil.success(userResponse, "회원 가입이 완료");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }catch (Exception e){
            ResponseData<Void> response = ResponseUtil.fail(500,"서버 오류가 발생");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

    }

    @Override
    @Transactional
    public ResponseEntity<?> validEmail(String userEmail){
        try {
            EmailValidator validator = EmailValidator.getInstance();
            //이메일 형식 확인
            if(!validator.isValid(userEmail)){
                ResponseData<?> response = ResponseUtil.fail(400,"메일 형식이 다름");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            if (userRepository.existsByUserEmail(userEmail)){
                //이메일 형식이 다르거나 이미 있는 메일이면 (사용불가)
                ResponseData<?> response = ResponseUtil.fail(409,"이미 있는 이메일");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
            }
            //없는 메일이다.(사용가능)
            ResponseData<?> response = ResponseUtil.success("가입 가능한 메일");
            return ResponseEntity.status(HttpStatus.OK).body(response);

        }catch (Exception e){
            ResponseData<?> response = ResponseUtil.fail(500,"서버 오류가 발생");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @Override
    @Transactional
    public ResponseEntity<?> getUser(){
        try{
            String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            System.out.println(userEmail);
            User user = userRepository.findUserByUserEmail(userEmail);
            UserResponse userResponse = modelMapper.map(user, UserResponse.class);
            ResponseData<UserResponse> response = ResponseUtil.success(userResponse, "유저 상세조회 완료");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception e){
            ResponseData<Void> response = ResponseUtil.fail(500,"서버 오류가 발생");
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
            ResponseData<UserResponse> response = ResponseUtil.success(userResponse, "유저 정보변경 완료");
            return ResponseEntity.status(HttpStatus.OK).body(response);

        }catch (Exception e){
            ResponseData<Void> response = ResponseUtil.fail(500,"서버 오류가 발생");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @Override
    @Transactional
    public ResponseEntity<?> deleteUser(){
        try{
            String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findUserByUserEmail(userEmail);
            user.setUserName("***");
            user.setUserEmail("***");
            user.setUserProtectorPhone("***");
            user.setUserPhone("***");
            user.setUserWithdraw(true);

            userRepository.saveAndFlush(user);

          return ResponseEntity.status(HttpStatus.NO_CONTENT).build(); // 어차피 응답 안나옴

        }catch (Exception e){
            ResponseData<Void> response = ResponseUtil.fail(500,"서버 오류가 발생");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    @Override
    @Transactional
    public ResponseEntity<?> findEmail(String userName, String userPhone) {
        try {
            User user = userRepository.findByUserNameAndUserPhone(userName, userPhone)
                    .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));

            UserEmailResponse userEmailResponse = modelMapper.map(user, UserEmailResponse.class);
            return ResponseEntity.ok(ResponseUtil.success(userEmailResponse, "회원 이메일 조회 완료."));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ResponseUtil.fail(404, "회원 이메일 찾기 실패-회원정보 불일치"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseUtil.fail(500, "서버 오류가 발생."));
        }
    }

    @Override
    @Transactional
    public ResponseEntity<?> findPassword(String userEmail) {
        try {
            User user = userRepository.findByUserEmail(userEmail)
                    .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));

            String newPassword = createRandomPassword();
            user.setUserPassword(bCryptPasswordEncoder.encode(newPassword));
            userRepository.save(user);

            //이메일로 보내기 구현
            sendPasswordResetEmail(userEmail, newPassword);

            return ResponseEntity.ok(ResponseUtil.success("임시 비밀번호 발급 완료."));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ResponseUtil.fail(404, "회원 이메일 찾기 실패-회원정보 불일치"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseUtil.fail(500, "서버 오류가 발생."));
        }
    }

    @Override
    @Transactional
    public ResponseEntity<?> changePassword(UserPasswordChangeRequest request){
        try {
            String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByUserEmail(userEmail)
                    .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));

            if(user.getUserPassword().equals(request.getNewPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ResponseUtil.fail(400, "새 비밀번호가 현재 비밀번호와 같습니다."));
            }

            user.setUserPassword(bCryptPasswordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);

            return ResponseEntity.ok(ResponseUtil.success("비밀번호 변경 완료"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ResponseUtil.fail(404, "회원 이메일 찾기 실패-회원정보 불일치"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseUtil.fail(500, "서버 오류가 발생."));
        }
    }

    private void sendPasswordResetEmail(String userEmail, String newPassword) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(userEmail);
        message.setSubject("비밀번호 재설정 안내");
        message.setText("안녕하세요,\n\n"
                + "임시 비밀번호가 발급되었습니다.\n"
                + "임시 비밀번호: " + newPassword + "\n\n"
                + "보안을 위해 로그인 후 비밀번호를 변경해주시기 바랍니다.\n\n"
                + "감사합니다.");

        try {
            javaMailSender.send(message);
        } catch (MailException e) {
            System.out.println(e.getMessage());
            throw new RuntimeException("이메일 전송에 실패했습니다.", e);
        }
    }

    private String createRandomPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        Random random = new Random();
        StringBuilder password = new StringBuilder();

        for (int i = 0; i < 8; i++) {
            password.append(chars.charAt(random.nextInt(chars.length())));
        }
        return password.toString();
    }
}
