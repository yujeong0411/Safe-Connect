package c207.camference.api.service.webrtc;

import c207.camference.api.response.common.ResponseData;
import c207.camference.util.response.ResponseUtil;

import com.google.cloud.speech.v1.*;
import com.google.protobuf.ByteString;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.exception.NurigoMessageNotReceivedException;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


import io.openvidu.java.client.Connection;
import io.openvidu.java.client.ConnectionProperties;
import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import io.openvidu.java.client.Session;
import io.openvidu.java.client.SessionProperties;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import java.util.*;


@Service
@RequiredArgsConstructor
public class WebRtcServiceImpl implements WebRtcService {
    @Value("${OPENVIDU_URL}")
    private String OPENVIDU_URL;

    @Value("${OPENVIDU_SECRET}")
    private String OPENVIDU_SECRET;

    private OpenVidu openvidu;
    private final SpeechClient speechClient;

    @PostConstruct
    public void init() {
        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }

    // 신고자에게 영상통화방 URL 전송
    @Override
    public ResponseEntity<?> sendUrlMsg(String callerPhone)
            throws OpenViduJavaClientException, OpenViduHttpException {
        String URL = "";

        // 현재 시간 가져오기
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss");
        String formattedNow = now.format(formatter);

        // 직접 세션 속성을 담을 Map을 생성
        Map<String, Object> params = new HashMap<>();
        params.put("customSessionId", formattedNow);

        // 세션아이디는 어떤걸로 해도 무방하기는 한데, 매 방마다 달라야 하고, 어차피 DB에도 넣어야 하는 값인 생성 시각으로 한다.(02.01 김성준)
        SessionProperties sessionPros = SessionProperties.fromJson(params).build();
        Session session = openvidu.createSession(sessionPros);

        Map<String, Object> connectedParams = new HashMap<>(); // 현재는 빈값이지만, 추후 필요한 설정이 있을때 채워넣어도 된다.
        ConnectionProperties connProps = ConnectionProperties.fromJson(connectedParams).build();
        Connection connection = session.createConnection(connProps);
        String Token = connection.getToken();

        URL = "http://localhost:3000/" + "?sessionid=" + session.getSessionId() + "token=" + Token;


        System.out.println(URL); // 디버그용. 삭제할것

        // 생성한 URL을 SMS로 전송하는 로직 추가




        return ResponseEntity.ok().build();
    }

    // 화상통화중 녹음된 파일을 텍스트로 변환해주는 메서드
    @Override
    public String speechToText(MultipartFile audioFile) throws IOException {
        if (audioFile.isEmpty()) {
            throw new IOException("전달받은 음성 데이터 audioFile 빈파일.");
        }

        // 오디오 파일을 byte array로 decode
        byte[] audioBytes = audioFile.getBytes();

        // 클라이언트 인스턴스화
        //try (SpeechClient speechClient = SpeechClient.create()) {
        //try (SpeechClient speechClient = speechClinet()) { // 넣고 싶은 부분
            // 오디오 객체 생성
            ByteString audioData = ByteString.copyFrom(audioBytes);
            RecognitionAudio recognitionAudio = RecognitionAudio.newBuilder()
                    .setContent(audioData)
                    .build();

            // 설정 객체 생성
            RecognitionConfig recognitionConfig =
                    RecognitionConfig.newBuilder()
                            .setEncoding(RecognitionConfig.AudioEncoding.FLAC)
                            .setSampleRateHertz(44100)
                            .setLanguageCode("ko-KR")
                            .build();

            // 오디오-텍스트 변환 수행
            RecognizeResponse response = speechClient.recognize(recognitionConfig, recognitionAudio);
            List<SpeechRecognitionResult> results = response.getResultsList();

            if (!results.isEmpty()) {
                // 주어진 말 뭉치에 대해 여러 가능한 스크립트를 제공. 0번(가장 가능성 있는)을 사용한다.
                SpeechRecognitionResult result = results.get(0);
                return result.getAlternatives(0).getTranscript();
            } else {
                System.out.println("No transcription result found");
                return "";
            }
        }
//        catch (Exception e) {
//            throw new RuntimeException(e);
//        }
//    }
}
