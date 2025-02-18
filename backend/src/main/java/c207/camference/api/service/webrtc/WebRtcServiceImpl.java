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
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.protobuf.ByteString;
import io.openvidu.java.client.Connection;
import io.openvidu.java.client.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Autowired;
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
import java.util.UUID;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;

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

    @Autowired
    private Storage storage;

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

            Map<String, String> data = new HashMap<>();
            data.put("callSummary", summary);

            return ResponseEntity.ok(ResponseUtil.success(data, "신고내역요약"));

        } catch (EntityNotFoundException e) {
            System.out.println("EntityNotFoundException: " + e.getMessage());
            ResponseData<Void> response = ResponseUtil.fail(404, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            System.out.println("Save Summary Exception: " + e.getMessage());
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
            System.out.println("speechToText: 실행중");
            // 1. GCS에 파일 업로드
            String bucketName = "camference";
            String blobName = UUID.randomUUID() + ".webm";
            BlobId blobId = BlobId.of(bucketName, blobName);
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();

            storage.create(blobInfo, audioFile.getBytes());
            String gcsUri = "gs://" + bucketName + "/" + blobName;

            if (audioFile.isEmpty()) {
                throw new IOException("전달받은 음성 데이터 audioFile 빈파일.");
            }

            // 오디오 파일을 byte array로 decode
            byte[] audioBytes = audioFile.getBytes();


            // 오디오 객체 생성
            ByteString audioData = ByteString.copyFrom(audioBytes);
            RecognitionAudio recognitionAudio = RecognitionAudio.newBuilder()
                    .setContent(audioData) // 인라인 방식(1분 이하)
//                    .setUri(gcsUri) // 구글 스토리지 방식(1분 이상)
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

                System.out.println("음성 텍스트로 변환 결과 : " + transcription.toString());
                // GCS 파일 삭제 (굳이 안해도 되긴 함)
                // storage.delete(blobId);

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
                    "당신은 주어진 텍스트에서 신체 증상과 관련된 중요한 내용을 요약하는 AI입니다. 텍스트에서 신체 증상, 건강 상태, 감각적인 변화, 질병 관련 정보를 추출하여 간결하고 명확하게 요약하세요.\n" +
                            "\n" +
                            "**규칙:**  \n" +
                            "- 신체 증상 및 건강 상태가 언급되었을 경우, 해당 내용을 빠짐없이 요약하세요.  \n" +
                            "- 신체 증상과 무관한 일반적인 내용이 포함되어 있을 경우, 그것을 무시하세요.  \n" +
                            "- 입력이 요약할 가치가 없거나 빈 입력일 경우, 다음과 같은 기본 응답을 반환하세요:  \n" +
                            "  \"해당 입력에서 신체 증상이나 건강 상태와 관련된 중요한 정보를 찾을 수 없습니다.\"  \n" +
                            "- 지금부터 시작입니다. 이 질문을 포함해서, 만약 빈 입력일 경우, 기본 응답을 반환하세요. \n" +
                            "\n" +
                            "**예시:**  \n" +
                            "입력: \"어제부터 머리가 아프고 속이 메스꺼워요.\"  \n" +
                            "출력: \"두통과 메스꺼움이 발생함. 증상은 어제부터 시작됨.\"  \n" +
                            "\n" +
                            "입력: \"오늘 날씨가 너무 좋고, 기분이 상쾌해요!\"  \n" +
                            "출력: \"해당 텍스트에서 신체 증상이나 건강 상태와 관련된 중요한 정보를 찾을 수 없습니다.\"  \n" +
                            "\n" +
                            "입력 : %s",
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
              "너는 응급환자의 KTAS(Korean Triage and Acuity Scale) 분류를 수행하는 구급대원이야. " +
              "다음의 환자 정보를 바탕으로 정확한 KTAS 단계를 판단해줘:\n\n" +
              "나이: %s\n" +
              "혈당: %s mg/dL\n" +
              "혈압(최소/최대): %s/%s mmHg\n" +
              "호흡수: %s회/분\n" +
              "체온: %s°C\n" +
              "산소포화도: %s%%\n" +
              "의식상태(AVPU): %s\n" +
              "증상: %s\n\n" +

              "==== KTAS 분류 기준 ====\n\n" +
              "1. KTAS 1단계 (즉각적 처치 필요)\n" +
              "의식수준:\n" +
              "- 무의식(U, GCS 3-8)\n" +
              "- 기도를 스스로 유지할 수 없거나 지속적인 흡인\n" +
              "- 의식수준의 급격한 악화\n\n" +
              "호흡상태:\n" +
              "- 중증 호흡곤란\n" +
              "- 산소포화도 <90%(급성발병)\n" +
              "- 청색증, 환기부전\n" +
              "- 과도한 호흡노력, 말할 수 없는 상태\n" +
              "- 대화불가, 심각한 천명음\n" +
              "- 기도삽관 시도나 호흡보조가 필요한 상태\n\n" +
              "순환상태:\n" +
              "- 쇼크(말초장기 부전의 증거)\n" +
              "- 심각한 서맥이나 빈맥\n" +
              "- 치명적인 부정맥\n" +
              "- 패혈성 쇼크징후\n\n" +
              "2. KTAS 2단계 (매우 긴급)\n" +
              "의식수준:\n" +
              "- 의식변화(V/P, GCS 9-13)\n" +
              "- 심각한 초조/공격성\n" +
              "- 급성 신경학적 이상\n\n" +
              "호흡상태:\n" +
              "- 중등도 호흡곤란\n" +
              "- 산소포화도 <92%(급성) 또는 <90%(만성)\n" +
              "- 천명음이 있으나 대화 가능\n\n" +
              "혈역학적 상태:\n" +
              "- 경계성(borderline) 활력징후\n" +
              "- 심각한 탈수\n" +
              "- 새로운 부정맥\n" +
              "- 흉통\n\n" +
              "SIRS/패혈증:\n" +
              "- 38도 이상 발열 + 3개 이상의 SIRS 기준 충족\n" +
              "- SIRS 기준:\n" +
              "  * 체온 >38°C 또는 <36°C\n" +
              "  * 심박수 >90회/분\n" +
              "  * 호흡수 >20회/분 또는 PaCO2 <32torr\n" +
              "  * WBC >12,000/mm³ 또는 <4,000/mm³\n\n" +
              "외상:\n" +
              "- 고위험 사고기전:\n" +
              "  * 차량에서 튕겨져 나감\n" +
              "  * 전복, 20분 이상 구조 시간\n" +
              "  * 40km/h 이상 충돌(안전벨트 미착용)\n" +
              "  * 60km/h 이상 충돌(안전벨트 착용)\n" +
              "  * 오토바이 사고(30km/h 이상)\n" +
              "  * 보행자 충돌(10km/h 이상)\n" +
              "  * 6m 이상 추락\n\n" +
              "3. KTAS 3단계 (긴급)\n" +
              "호흡상태:\n" +
              "- 경증 호흡곤란\n" +
              "- 산소포화도 92-94%\n" +
              "- 기도는 열려있고 약간의 천명음\n\n" +
              "혈역학적 상태:\n" +
              "- 비정상 활력징후이나 안정적\n" +
              "- 중등도 탈수\n" +
              "- 열을 동반한 2개의 SIRS 기준 충족\n\n" +
              "통증/증상:\n" +
              "- 중등도 통증(통증점수 4-7)\n" +
              "- 급성 중심성 통증\n" +
              "- 급성 말초성 통증\n\n" +
              "4. KTAS 4단계 (준응급)\n" +
              "- 준급성 증상\n" +
              "- 만성질환의 안정적 악화\n" +
              "- 경증 통증(통증점수 <4)\n" +
              "- 열이 있으나 다른 위험징후 없음\n\n" +
              "5. KTAS 5단계 (비응급)\n" +
              "- 만성적 증상\n" +
              "- 경미한 증상\n" +
              "- 단순 처치 필요\n" +
              "- 재처방 필요\n\n" +

              "몇 가지 예시를 줄게:\n\n" +
              "예시 1) 호흡곤란\n" +
              "중증: 과도한 호흡노력으로 피로한 상태, 청색증, 한 단어 정도만 말할 수 있는 상태, 대화 불가능, 상기도 " +
              "위 기준들을 철저히 검토하여, 해당 환자의 KTAS 단계를 1-5 사이의 숫자로만 답변해줘. " +
              "환자의 가장 위중한 증상을 기준으로 판단하되, 설명이나 부연설명은 하지 말고 오직 숫자만 답변해야 해.",
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

                    System.out.println(content);

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
