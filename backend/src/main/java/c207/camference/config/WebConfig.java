package c207.camference.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173")// 허용할 url
                //.allowedOrigins("/**")// 허용할 url
                .allowedMethods("GET", "POST", "PUT", "DELETE")//허용할 메서드
                .allowedHeaders("*") // 허용할 헤더
                .exposedHeaders("Authorization") // 응답에 노출 시킬 헤더->나중에 확인 필요
                .allowCredentials(true) //클라이언트 측에 대한 응답에 쿠키, 인증헤더를 포함시킬지 여부
                .maxAge(3600);// 원하는 시간만큼 pre-flight 리퀘스트를 캐싱
    }
}
