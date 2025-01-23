package c207.camference.config;

import c207.camference.filter.jwt.JWTFilter;
import c207.camference.util.jwt.JWTUtil;
import c207.camference.filter.jwt.LoginFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration //빈에 등록을 위해 추가
@EnableWebSecurity // 웹 보안 활성화를 위해 추가
public class SecurityConfig {


    private final AuthenticationConfiguration authenticationConfiguration;
    private final JWTUtil jwtUtil;

    public SecurityConfig(AuthenticationConfiguration authenticationConfiguration,JWTUtil jwtUtil){
        this.authenticationConfiguration = authenticationConfiguration;
        this.jwtUtil=jwtUtil;
    }

    //AuthenticationManager Bean 등록
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {

        return configuration.getAuthenticationManager();
    }

    @Bean
    //비밀번호 암호화를 위한 인코더
    //한개의 비밀번호에 1개의 salt(비밀번호 암호화 key) 사용
    public BCryptPasswordEncoder bCryptPasswordEncoder() {return new BCryptPasswordEncoder();}


    @Bean
    //http 접근 권한 설정, 인
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                //http bagic 인증 해제 - 모든 페이지마다 로그인을 해야함.. 안전하지만 너무 불편하다
                // BasinAuthenticationFilter 해제
                .httpBasic(AbstractHttpConfigurer::disable)
                //csrf 보안 비활성화(postman으로 접근할 수 있게하기 위해서)
                .csrf(AbstractHttpConfigurer::disable)
                // 기본 로그인 폼 비활성화 (jwt 토큰 사용을 위해서는 제거해야함.)
                .formLogin(AbstractHttpConfigurer::disable);


        //url별 접근 권한 설정
        http.
                authorizeHttpRequests((auth)->auth
                        .requestMatchers("/user/signup","login","/user/valid/**","/user/find/**").permitAll() // 이 경로는 모두 접근 가능
                        .requestMatchers("/user").hasRole("USER")
//                        .requestMatchers("/user/valid/phone").denyAll()
//                        .requestMatchers("/").hasRole("USER") // 유저역할을 가진 사람만
                        .anyRequest().authenticated()); // 나머지는 모두 이용 가능

        // 세션 관리 설정
        // jwt를 사용하기 위해서 sessionless로 설정.-> 매 요청마다 jwt토큰을 확인하며 인증 처리
        http
                .sessionManagement((sessionManagement)->
                        sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS));


        http
                .addFilterBefore(new JWTFilter(jwtUtil), LoginFilter.class); //로그인 필터 등록

        http
                .addFilterAt(new LoginFilter(authenticationManager(authenticationConfiguration), jwtUtil), UsernamePasswordAuthenticationFilter.class);


        return http.build();
    };
}
