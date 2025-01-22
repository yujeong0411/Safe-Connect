package c207.camference;

import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class CamferenceApplication {

    public static void main(String[] args) {SpringApplication.run(CamferenceApplication.class, args);}
    
    // ModelMapper를 사용하기 위한 Bean 추가
    @Bean
    public ModelMapper getModelMapper() {
        return new ModelMapper();
    }

}
