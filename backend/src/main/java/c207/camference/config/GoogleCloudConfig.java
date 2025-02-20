package c207.camference.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.cloud.speech.v1.SpeechClient;
import com.google.cloud.speech.v1.SpeechSettings;
import io.grpc.Context;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;

@Configuration
public class GoogleCloudConfig {
    @Value("${google.cloud.credentials.json}")
    private String jsonCredentials;

    @Bean
    public SpeechClient speechClient() throws IOException {
        // JSON 문자열을 ByteArrayInputStream으로 변환
        String normalizedJson = jsonCredentials.replace("\\\\n", "\\n"); //
        ByteArrayInputStream credentialsStream = new ByteArrayInputStream(normalizedJson.getBytes(StandardCharsets.UTF_8));
        ServiceAccountCredentials credentials = ServiceAccountCredentials.fromStream(credentialsStream);
        SpeechSettings speechSettings = SpeechSettings.newBuilder()
                .setCredentialsProvider(() -> credentials)
                .build();
        return SpeechClient.create(speechSettings);
    }

    @Bean
    public Storage storage() throws IOException {
        // 용량이 큰 녹음 파일을 Google Cloud에 저장을 하기 위해서 사용
//        StorageOptions storageOptions = StorageOptions.newBuilder()
//                .setCredentials(GoogleCredentials.fromStream(
//                        new FileInputStream("path/to/your-service-account.json")))
//                .build();

//      return StorageOptions.getDefaultInstance().getService();
        String normalizedJson = jsonCredentials.replace("\\\\n", "\\n"); //
        ByteArrayInputStream credentialsStream = new ByteArrayInputStream(normalizedJson.getBytes(StandardCharsets.UTF_8));
        ServiceAccountCredentials credentials = ServiceAccountCredentials.fromStream(credentialsStream);

        return StorageOptions.newBuilder()
                .setCredentials(credentials)
                .build()
                .getService();
    }
}