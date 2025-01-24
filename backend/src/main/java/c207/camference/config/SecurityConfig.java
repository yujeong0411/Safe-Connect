package c207.camference.config;

import c207.camference.api.service.admin.AdminDetailsService;
import c207.camference.api.service.user.CustomUserDetailsService;
import c207.camference.filter.jwt.AdminLoginFilter;
import c207.camference.filter.jwt.JWTFilter;
import c207.camference.filter.jwt.UserLoginFilter;
import c207.camference.util.jwt.JWTUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
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

    private final JWTUtil jwtUtil;
    private final CustomUserDetailsService customUserDetailsService;
    private final AdminDetailsService adminDetailsService;

    public SecurityConfig(JWTUtil jwtUtil,
                          CustomUserDetailsService customUserDetailsService,
                          AdminDetailsService adminDetailsService) {
        this.jwtUtil = jwtUtil;
        this.customUserDetailsService = customUserDetailsService;
        this.adminDetailsService = adminDetailsService;
    }

    @Primary
    @Bean
    public AuthenticationManager userAuthenticationManager() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(customUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return new ProviderManager(provider);
    }

    @Bean
    public AuthenticationManager adminAuthenticationManager() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(adminDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return new ProviderManager(provider);
    }


    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .httpBasic(AbstractHttpConfigurer::disable)
                .csrf(AbstractHttpConfigurer::disable)
                // 기본 로그인 폼 비활성화 (jwt 토큰 사용을 위해서는 제거해야함.)
                .formLogin(AbstractHttpConfigurer::disable);


        //url별 접근 권한 설정
        http.
                authorizeHttpRequests((auth)->auth
                        .requestMatchers("/**").permitAll()
//                        .requestMatchers("/user/signup","login","/user/valid/**","/user/find/**").permitAll() // 이 경로는 모두 접근 가능
//                        .requestMatchers("/user").hasRole("USER")
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
    }



}
