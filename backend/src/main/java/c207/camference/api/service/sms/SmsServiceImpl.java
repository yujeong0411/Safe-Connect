package c207.camference.api.service.sms;

import c207.camference.api.request.user.UserValidPhoneCheckRequest;
import c207.camference.api.response.common.ResponseData;
import c207.camference.db.entity.users.User;
import c207.camference.db.repository.users.UserRepository;
import c207.camference.temp.request.MessageRequest;
import c207.camference.util.redis.RedisUtil;
import c207.camference.util.response.ResponseUtil;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.exception.NurigoMessageNotReceivedException;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Random;

// 참고 문헌 https://2junbeom.tistory.com/47
@Service
@RequiredArgsConstructor
public class SmsServiceImpl implements SmsService {

    private final UserRepository userRepository;
    @Value("${spring.coolsms.apiKey}")
    private String apiKey;

    @Value("${spring.coolsms.secretKey}")
    private String secretKey;

    private final RedisUtil redisUtil;
    private final ModelMapper modelMapper;
    private final UserRepository userrepository;

    private String createRandomNumber() {
        Random random = new Random();
        String randomNumber = "";
        for (int i = 0; i < 6; i++) {
            randomNumber += String.valueOf(random.nextInt(10));
        }
        return randomNumber;
    }

    // 인증번호 전송하기
    @Override
    @Transactional
    public ResponseEntity<?> userPhoneValid(String userPhone) {

        try {
            DefaultMessageService messageService = NurigoApp.INSTANCE.initialize(apiKey, secretKey, "https://api.coolsms.co.kr");
            // Message 패키지가 중복될 경우 net.nurigo.sdk.message.model.Message로 치환하여 주세요
            Message message = new Message();

            // 랜덤한 인증 번호 생성
            String randomNum = createRandomNumber();
            //인증 번호를 redis에 저장 만료시간은 5분
            redisUtil.setDataExpire(userPhone, randomNum, 3);
            message.setFrom("01030854889");
            message.setTo(userPhone);
            message.setText("[SafeConnect] 인증번호" + "[" + randomNum + "]를 입력해 주세요.");

            // send 메소드로 ArrayList<Message> 객체를 넣어도 동작합니다!
            messageService.send(message);
            ResponseData<?> response = ResponseUtil.success("인증번호 송부됐습니다.");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (NurigoMessageNotReceivedException exception) {
            // 발송에 실패한 메시지 목록을 확인할 수 있습니다!
            System.out.println(exception.getFailedMessageList());
            System.out.println(exception.getMessage());
            ResponseData<?> response = ResponseUtil.fail(500,"누리고 서버 문제입니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        } catch (Exception exception) {
            System.out.println(exception.getMessage());
            ResponseData<?> response = ResponseUtil.fail(500,"서버 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @Override
    @Transactional
    public ResponseEntity<?> userPhoneValidCheck(UserValidPhoneCheckRequest request) {
        try {
            String userPhone = request.getUserPhone().replace("-", "");
            String randomNum = redisUtil.getData(userPhone);
            if(randomNum.equals(request.getAuthCode())){
                ResponseData<?> response = ResponseUtil.success("전화번호 인증 성공했습니다.");
                return ResponseEntity.status(200).body(response);
            }
            ResponseData<?> response = ResponseUtil.fail(400,"전화번호 인증 실패했습니다.");
            return ResponseEntity.status(400).body(response);
        } catch (Exception exception) {
            System.out.println(exception.getMessage());
            ResponseData<?> response = ResponseUtil.fail(500,"서버 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @Override
    @Transactional
    public ResponseEntity<?> controlSendMessage(MessageRequest request){
        try {
            DefaultMessageService messageService = NurigoApp.INSTANCE.initialize(apiKey, secretKey, "https://api.coolsms.co.kr");
            // Message 패키지가 중복될 경우 net.nurigo.sdk.message.model.Message로 치환하여 주세요
            Message message = new Message();

            String userPhone = request.getCallerPhone();
            User user = userRepository.findByUserPhone(userPhone)
                    .orElseThrow(() -> new EntityNotFoundException("가입자가 아닙니다."));
            String protectorPhone = user.getUserProtectorPhone();
            String userName = user.getUserName();

            //인증 번호를 redis에 저장 만료시간은 5분
            message.setFrom("01030854889");
            message.setTo(protectorPhone.replace("-", ""));
            message.setText("[119 상황실] "+userName+"님께서 현재 구급대원을 호출하였습니다.");

            // send 메소드로 ArrayList<Message> 객체를 넣어도 동작합니다!
            messageService.send(message);
            ResponseData<?> response = ResponseUtil.success("보호자에게 메시지를 모냈습니다.");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (NurigoMessageNotReceivedException exception) {
            // 발송에 실패한 메시지 목록을 확인할 수 있습니다!
            System.out.println(exception.getFailedMessageList());
            System.out.println(exception.getMessage());
            ResponseData<?> response = ResponseUtil.fail(500,"누리고 서버 문제입니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        } catch (Exception exception) {
            System.out.println(exception.getMessage());
            ResponseData<?> response = ResponseUtil.fail(500,"서버 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

    }

    // 인증번호 전송하기
    @Override
    public ResponseEntity<?> sendMessage(String userPhone, String url) {

        try {
            DefaultMessageService messageService = NurigoApp.INSTANCE.initialize(apiKey, secretKey, "https://api.coolsms.co.kr");
            // Message 패키지가 중복될 경우 net.nurigo.sdk.message.model.Message로 치환하여 주세요
            Message message = new Message();

            message.setFrom(userPhone);
            message.setTo(userPhone);
            message.setText("[SafeConnect] 화상지원 URL" + "[" + url + "]");

            // send 메소드로 ArrayList<Message> 객체를 넣어도 동작합니다!
            messageService.send(message);
            ResponseData<?> response = ResponseUtil.success("인증번호 송부됐습니다.");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (NurigoMessageNotReceivedException exception) {
            // 발송에 실패한 메시지 목록을 확인할 수 있습니다!
            System.out.println(exception.getFailedMessageList());
            System.out.println(exception.getMessage());
            ResponseData<?> response = ResponseUtil.fail(500,"누리고 서버 문제입니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        } catch (Exception exception) {
            System.out.println(exception.getMessage());
            ResponseData<?> response = ResponseUtil.fail(500,"서버 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}

