package c207.camference.config;

import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.cloud.speech.v1.SpeechClient;
import com.google.cloud.speech.v1.SpeechSettings;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Configuration
public class GoogleCloudConfig {
    @Value("${google.cloud.credentials.json}")
    private String jsonCredentials;

    @Bean
    public SpeechClient speechClient() throws IOException {
        // JSON 문자열을 ByteArrayInputStream으로 변환
        ByteArrayInputStream credentialsStream = new ByteArrayInputStream(jsonCredentials.getBytes(StandardCharsets.UTF_8));
        ServiceAccountCredentials credentials = ServiceAccountCredentials.fromStream(credentialsStream);
        SpeechSettings speechSettings = SpeechSettings.newBuilder()
                .setCredentialsProvider(() -> credentials)
                .build();
        return SpeechClient.create(speechSettings);
    }
}
