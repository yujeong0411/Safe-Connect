package c207.camference.api.service.webrtc;

import c207.camference.api.response.common.ResponseData;
import c207.camference.api.service.sms.SmsService;
import c207.camference.db.entity.report.Call;
import c207.camference.db.repository.report.CallRepository;
import c207.camference.util.response.ResponseUtil;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.cloud.speech.v1.*;
import com.google.protobuf.ByteString;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
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

import java.io.IOException;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

@Service
@RequiredArgsConstructor
public class WebRtcServiceImpl implements WebRtcService {
    private final CallRepository callRepository;
    @Value("${OPENVIDU_URL}")
    private String OPENVIDU_URL;

    @Value("${OPENVIDU_SECRET}")
    private String OPENVIDU_SECRET;

    @Value("${openai.api.key}")
    private String openaiApiKey;


    private OpenVidu openvidu;
    private final SpeechClient speechClient;
    private final SmsService smsService;
    private final ObjectMapper objectMapper;

    @PostConstruct
    public void init() {
        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }

    private final OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS) // 연결 타임아웃
            .readTimeout(60, TimeUnit.SECONDS)   // 읽기 타임아웃
            .writeTimeout(60, TimeUnit.SECONDS)  // 쓰기 타임아웃
            .build();

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

        Connection connCaller = session.createConnection(connProps);
        Connection connFireStaff = session.createConnection(connProps);

        String tokenCaller = connCaller.getToken();
        String tokenFireStaff = connFireStaff.getToken();

        URL = "http://localhost:3000/" + "?sessionid=" + session.getSessionId() + "token=" + tokenCaller;

        // todo : video_call(영상통화방) 테이블 생성

        // todo : vidoe_call_user(영상통화참여) 테이블에 신고자, 상황실 직원 정보 2개 INSERT

        System.out.println(URL); // 디버그용. 삭제할것

        // 생성한 URL을 SMS로 전송하는 로직 추가
        smsService.sendMessage(callerPhone, URL);

        return ResponseEntity.ok().build();
    }

    // todo : 구급대원용 토큰 생성
    /**
    @param : 세션ID
    @return : Map<> tokenId
     */
    @Override
    public String createStaffToken(String sessionId)
            throws OpenViduJavaClientException, OpenViduHttpException {
        Session session = openvidu.getActiveSession(sessionId);

        Map<String, Object> connectedParams = new HashMap<>(); // 현재는 빈값이지만, 추후 필요한 설정이 있을때 채워넣어도 된다.
        ConnectionProperties properties = ConnectionProperties.fromJson(connectedParams).build();
        Connection connStaff = session.createConnection(properties);
        System.out.println(connStaff.getToken());

        return connStaff.getToken();
    }

    @Override
    public ResponseEntity<?> save(Integer callId, String text, String summary) {
        Call call = callRepository.findCallByCallId(callId);
        call.setCallText(text);
        call.setCallSummary(summary);
        call.setCallTextCreatedAt(LocalDateTime.now());

        return null;
    }


    // todo : 구급대원 영상통화 참여 (출동시간 수정)
    /**
     * params: sessionId
     * @return URL
     */
//    @Override
//    public String dispatch

    // todo : 신고자와 영상통화 종료 (현장 도착시간 수정)


    // 화상통화중 녹음된 파일을 텍스트로 변환해주는 메서드
    @Override
    public String speechToText(MultipartFile audioFile) throws IOException {
        if (audioFile.isEmpty()) {
            throw new IOException("전달받은 음성 데이터 audioFile 빈파일.");
        }

        // 오디오 파일을 byte array로 decode
        byte[] audioBytes = audioFile.getBytes();


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

    // 텍스트로 변환한 음성을 요약해주는 기능
    @Override
    public String textSummary(String speechToText) {
// 요약을 요청하는 프롬프트 생성
        String prompt = String.format(
                "너는 119 상담사와 긴급 상황 신고자의 대화 내용을 바탕으로 대화 내용을 요약해주는 비서야." +
                        "다음 텍스트를 환자의 증상을 중심으로 간결하게 요약해줘.",
                "\n\n%s\n\n요약:",
                speechToText
        );

        try {
            // 요청 바디 생성
            ObjectNode requestBody = objectMapper.createObjectNode();
            requestBody.put("model", "gpt-4o-mini");
            requestBody.put("temperature", 0.7);

            // messages 배열 생성 (대화형 요청)
            ArrayNode messages = objectMapper.createArrayNode();
            ObjectNode message = objectMapper.createObjectNode();
            message.put("role", "user");
            message.put("content", prompt);
            messages.add(message);

            // messages 배열을 requestBody에 추가
            requestBody.set("messages", messages);

            // 요청 바디를 JSON 문자열로 변환 (디버깅용 로그 출력 가능)
            String requestBodyString = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(requestBody);
            System.out.println("Request Body: " + requestBodyString);

            // 요청 바디 생성
            RequestBody body = RequestBody.create(
                    requestBodyString,
                    MediaType.parse("application/json")
            );

            // OpenAI API 엔드포인트로 요청 생성
            Request request = new Request.Builder()
                    .url("https://api.openai.com/v1/chat/completions")
                    .addHeader("Authorization", "Bearer " + openaiApiKey)
                    .addHeader("Content-Type", "application/json")
                    .post(body)
                    .build();

            // API 호출 및 응답 처리
            try (Response response = client.newCall(request).execute()) {
                String responseBody = response.body().string();
                //System.out.println("Response Body: " + responseBody);

                if (!response.isSuccessful()) {
                    System.out.println("OpenAI API error: " + responseBody);
                    throw new IOException("Unexpected code " + response);
                }

                // 응답 파싱
                JsonNode responseJson = objectMapper.readTree(responseBody);
                String content = responseJson
                        .path("choices")
                        .get(0)
                        .path("message")
                        .path("content")
                        .asText()
                        .trim();

                // 코드 블록 제거 (예: ```json ... ```)
                content = removeCodeBlock(content);

                return content;
            }
        } catch (IOException e) {
            e.printStackTrace();
            return "";
        }
    }

    /**
     * 응답 내용에서 코드 블록을 제거하는 메소드
     * 예: ```json\n[ ... ]\n```
     */
    private String removeCodeBlock(String content) {
        // 정규 표현식을 사용하여 ```json과 ``` 제거
        Pattern pattern = Pattern.compile("```json\\n([\\s\\S]*?)\\n```");
        Matcher matcher = pattern.matcher(content);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        return content; // 코드 블록이 없을 경우 원본 반환
    }


}
