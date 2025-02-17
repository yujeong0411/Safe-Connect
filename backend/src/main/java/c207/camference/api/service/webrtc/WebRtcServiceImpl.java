package c207.camference.api.service.webrtc;

import c207.camference.api.request.dispatchstaff.PreKtasRequest;
import c207.camference.api.response.common.ResponseData;
import c207.camference.api.service.sms.SmsService;
import c207.camference.db.entity.report.Call;
import c207.camference.db.repository.report.CallRepository;
import c207.camference.util.response.ResponseUtil;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.api.gax.longrunning.OperationFuture;
import com.google.cloud.speech.v1.*;
import com.google.protobuf.ByteString;
import io.openvidu.java.client.Connection;
import io.openvidu.java.client.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;


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


    @Override
    @Transactional
    public ResponseEntity<?> saveSummary(Integer callId, String text, String summary) {
        try {
            Call call = callRepository.findCallByCallId(callId);
            //call.setCallText(text);
            call.setCallSummary(summary);
            call.setCallTextCreatedAt(LocalDateTime.now());

            callRepository.save(call);

            Map<String, String> response = new HashMap<>();
            response.put("callSummary", summary);
            response.put("message", "신고내역요약 ");

            return ResponseEntity.status(HttpStatus.OK).body(response);

        } catch (EntityNotFoundException e) {
            System.out.println("EntityNotFoundException: " + e.getMessage());
            ResponseData<Void> response = ResponseUtil.fail(404, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            System.out.println("Exception: " + e.getMessage());
            e.printStackTrace();
            ResponseData<Void> response = ResponseUtil.fail(500, "서버 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

        /**
         * 상황실 직원이 영상통화방 생성
         *
         * @param customSessionId
         * @return sessionId
         */
        @Override
        public String makeSession (String customSessionId) throws OpenViduJavaClientException, OpenViduHttpException {
            SessionProperties properties = new SessionProperties.Builder()
                    .customSessionId(customSessionId)
                    .build();

            Session session = openvidu.createSession(properties);
            String sessionId = session.getSessionId();

            return sessionId;
        }

        /**
         * 상황실 직원이 영상통화방 session을 만들었으면 이를 바탕으로 접속가능한 URL만든다.
         *
         * @param sessionId
         * @return url
         */
        public String makeUrl (String sessionId){
            String baseUrl = activeProfile.equals("prod")
                    ? "https://i12c207.p.ssafy.io"
                    : "http://localhost:5173";

            return baseUrl + "/caller/join/" + sessionId + "?direct=true";
        }


        /**
         * 토큰 생성 (상황실, 신고자, 구급대원)
         *
         * @return token
         * @params sessionId
         */
        public String getToken (String sessionId) throws OpenViduJavaClientException, OpenViduHttpException {
            Session session = openvidu.getActiveSession(sessionId);
            if (session == null) {
                session = openvidu.createSession(
                        new SessionProperties.Builder()
                                .customSessionId(sessionId)
                                .build()
                );
            }

            ConnectionProperties properties = new ConnectionProperties.Builder()
                    .type(ConnectionType.WEBRTC)
                    .data("") // 필요하다면 사용자 데이터 추가 가능
                    .build();

            Connection connection = session.createConnection(properties);

            return connection.getToken();
        }


        // 화상통화중 녹음된 파일을 텍스트로 변환해주는 메서드
        @Override
        @Transactional
        public String speechToText (MultipartFile audioFile) throws IOException {
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
                            .setEncoding(RecognitionConfig.AudioEncoding.WEBM_OPUS)
                            .setSampleRateHertz(48000)
                            .setLanguageCode("ko-KR")
                            .build();

            // 입력받은 파일이 1분 이상일 경우를 위해
            try {
                // 비동기 변환 요청
                OperationFuture<LongRunningRecognizeResponse, LongRunningRecognizeMetadata> response
                        = speechClient.longRunningRecognizeAsync(recognitionConfig, recognitionAudio);

                // 결과 대기 (최대 3분)
                LongRunningRecognizeResponse result = response.get(3, TimeUnit.MINUTES);

                // 결과 처리
                StringBuilder transcription = new StringBuilder();
                for (SpeechRecognitionResult recognitionResult : result.getResultsList()) {
                    transcription.append(recognitionResult.getAlternatives(0).getTranscript())
                            .append(" ");
                }

                return transcription.toString().trim();

            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("음성 변환이 중단되었습니다.", e);
            } catch (ExecutionException e) {
                throw new RuntimeException("음성 변환 중 오류가 발생했습니다.", e);
            } catch (TimeoutException e) {
                throw new RuntimeException("음성 변환 시간이 초과되었습니다.", e);
            }


            // 오디오-텍스트 변환 수행
//            RecognizeResponse response = speechClient.recognize(recognitionConfig, recognitionAudio);
//            List<SpeechRecognitionResult> results = response.getResultsList();
//
//            if (!results.isEmpty()) {
//                // 주어진 말 뭉치에 대해 여러 가능한 스크립트를 제공. 0번(가장 가능성 있는)을 사용한다.
//                SpeechRecognitionResult result = results.get(0);
//                return result.getAlternatives(0).getTranscript();
//            } else {
//                System.out.println("No transcription result found");
//                return "";
//            }
        }

        // 텍스트로 변환한 음성을 요약해주는 기능

        @Override
        @Transactional
        public String textSummary (String speechToText){
            // 요약을 요청하는 프롬프트 생성

            String prompt = String.format(
                    "너는 119 상담사와 긴급 상황 신고자의 대화 내용을 바탕으로 대화 내용을 요약해주는 비서야." +
                            "다음 텍스트를 환자의 증상을 중심으로 간결하게 요약해줘." +
                            "만약 대화 내용이 너무 짧아 요약을 할 내용이 없다면, \"요약 정보 없음\"이라고만 말해. " +
                            "즉, 앞으로 네가 할 수 있는 대답은 \"요약 정보 없음\", 혹은 네가 요약을 해준 결과물. 이 둘 중 하나밖에 없어." +
                            "알겠다는 대답도 하지 마., 지금부터 시작이야.",
                    "\n\n%s\n\n요약:",
                    speechToText
            );

            return makeRequest(prompt);
        }

        @Override
        public Integer getPreKtas (PreKtasRequest request){
            Integer patientAge = request.getPatientAge(); // 나이
            Integer patientBloodSugar = request.getPatientBloodSugar(); // 혈당
            Integer patientDiastolicBldPress = request.getPatientDiastolicBldPress(); // 혈압최소
            Integer patientSystolicBldPress = request.getPatientSystolicBldPress(); // 혈압최대
            Integer patientPulseRate = request.getPatientPulseRate(); // 호흡수
            Float patientTemperature = request.getPatientTemperature(); // 체온
            Float patientSpo2 = request.getPatientSpo2(); // 산소포화도
            String patientMental = request.getPatientMental(); // 의식상태
            String patientSymptom = request.getPatientSymptom(); // 증상

            String prompt = String.format(
                    "너는 응급환자의 119구급대와 의료기관 간의 원활한 의사소통을 촉진하고, 환자에게 적절한 치료를 신속히 제공하는 것을 목표" +
                            "로 하는 분류체계인 pre-KTAS를 진단하는 구급대원이야. " +
                            "이를 바탕으로, 1단계부터 5단계까지 단계중에서 해당 환자가 몇단계에 해당하는지는 정해줘. 아래는 분류 기준이야." +
                            "Level 1 (소생): 심정지, 중증외상 등 즉각적인 처치가 필요한 매우 중증 상태\n" +
                            "Level 2 (긴급): 호흡곤란, 토혈 등 생명이나 신체기능에 잠재적 위협이 있는 상태\n" +
                            "Level 3 (응급): 경한 호흡부전 등 치료가 필요한 상태로 진행할 수 있는 잠재적 가능성이 있는 경우\n" +
                            "Level 4 (준응급): 착란, 요로감염 등 1-2시간 내에 처치나 재평가가 필요한 상태\n" +
                            "Level 5 (비응급): 상처소독, 약처방 등 긴급하지 않은 상태" +
                            "다음은 응급 환자의 건강상태야. " +
                            "나이 : %s" +
                            "혈당 : %s" +
                            "혈압최소 : %s" +
                            "혈압최대 : %s" +
                            "호흡수 : %s" +
                            "체온 : %s" +
                            "산소포화도 : %s" +
                            "의식상태 : %s" +
                            "증상 : %s" +
                            "위를 바탕으로, 해당 환자가 몇단계에 해당하는지, 답변으로 오직 숫자 하나만 대답해줘. " +
                            "사족을 붙이지 말고, 오로지 정수 하나만 대답해야 해",
                    patientAge, patientBloodSugar, patientDiastolicBldPress, patientSystolicBldPress, patientPulseRate,
                    patientTemperature, patientSpo2, patientMental, patientSymptom
            );

            return Integer.parseInt(makeRequest(prompt));
        }


        private String makeRequest (String prompt){
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
        private String removeCodeBlock (String content){
            // 정규 표현식을 사용하여 ```json과 ``` 제거
            Pattern pattern = Pattern.compile("```json\\n([\\s\\S]*?)\\n```");
            Matcher matcher = pattern.matcher(content);
            if (matcher.find()) {
                return matcher.group(1).trim();
            }
            return content; // 코드 블록이 없을 경우 원본 반환
        }


    }
