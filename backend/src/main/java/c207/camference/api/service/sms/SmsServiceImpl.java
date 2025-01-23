package c207.camference.api.service.sms;

import c207.camference.api.request.user.UserValidPhoneCheckRequest;
import c207.camference.util.redis.RedisUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.exception.NurigoMessageNotReceivedException;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Random;

// 참고 문헌 https://2junbeom.tistory.com/47
@Service
@RequiredArgsConstructor
public class SmsServiceImpl implements SmsService {

    @Value("${spring.coolsms.apiKey}")
    private String apiKey;

    @Value("${spring.coolsms.secretKey}")
    private String secretKey;

    private final RedisUtil redisUtil;

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
    public void userPhoneValid(String userPhone) {
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

        try {
            // send 메소드로 ArrayList<Message> 객체를 넣어도 동작합니다!
            messageService.send(message);
        } catch (NurigoMessageNotReceivedException exception) {
            // 발송에 실패한 메시지 목록을 확인할 수 있습니다!
            System.out.println(exception.getFailedMessageList());
            System.out.println(exception.getMessage());
        } catch (Exception exception) {
            System.out.println(exception.getMessage());
        }
    }

    @Override
    @Transactional
    public Boolean userPhoneValidCheck(UserValidPhoneCheckRequest request) {

        String userPhone = request.getUserPhone().replace("-", "");
        String randomNum = redisUtil.getData(userPhone);

        if(randomNum.equals(request.getAuthCode())){
            return true;
        }
        return false;
    }
}

