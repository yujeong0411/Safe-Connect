package c207.camference.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
//                .setAllowedOriginPatterns("*")
                .setAllowedOriginPatterns("http://localhost:8080")  // CORS 설정을 여기서
                .withSockJS();
    }


/*
    // CORS 설정
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/ws/**")
                .allowedOrigins("http://localhost:8080")
                .allowedMethods("GET", "POST")  // WebSocket handshake를 위해 GET도 필요
                .allowCredentials(true)
                .maxAge(3600);
    }

*/
/*

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // 구독 요청 prefix 설정
        // /topic: 일대다 메시징을 위한 prefix(브로드캐스트)
        // /queue: 일대일 메시징을 위한 prefix(특정 사용자에게)
        config.enableSimpleBroker("/topic", "queue");

        // 메시지 발행 요청 prefix 설정
        // /app: 클라이언트에서 서버로 메시지를 보낼 때 사용할 prefix
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // WebSocket 연결 엔드포인트 설정
        registry.addEndpoint("/ws") // /ws: WebSocket 연결을 위한 엔드포인트
//                .setAllowedOrigins("*") // CORS 설정
                .setAllowedOriginPatterns("http://localhost:8080") // 특정 출처 허용
//                .setAllowedOriginPatterns("*") // 모든 출처 허용
                .allowCredentials(true)
                .withSockJS(); // SockJs 지원 추가
    }

*/

}
