package c207.camference.config;

import c207.camference.api.service.admin.AdminDetailsService;
import c207.camference.api.service.fireStaff.FireStaffDetailsService;
import c207.camference.api.service.user.CustomUserDetailsService;
import c207.camference.db.repository.RefreshRepository;
import c207.camference.filter.jwt.*;
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
    private final FireStaffDetailsService fireStaffDetailsService;

    public SecurityConfig(JWTUtil jwtUtil,
                          CustomUserDetailsService customUserDetailsService,
                          AdminDetailsService adminDetailsService,
                          FireStaffDetailsService fireStaffDetailsService) {
        this.jwtUtil = jwtUtil;
        this.customUserDetailsService = customUserDetailsService;
        this.adminDetailsService = adminDetailsService;
        this.fireStaffDetailsService = fireStaffDetailsService;
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
    public AuthenticationManager fireStaffAuthenticationManager() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(fireStaffDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return new ProviderManager(provider);
    }


    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, RefreshRepository refreshRepository) throws Exception {
        http
                .httpBasic(AbstractHttpConfigurer::disable)
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .logout(AbstractHttpConfigurer::disable)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/logout").permitAll()
                        .requestMatchers("/**").permitAll()
                        .requestMatchers("/reissue").permitAll()
                       .requestMatchers("/user/signup", "/user/login", "/user/valid/**", "/user/find/**").permitAll()
//                        .requestMatchers("/admin/signup", "/admin/login").permitAll()
                        .requestMatchers("/user/**").hasRole("USER")
//                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated())
                .addFilterBefore(new JWTLogoutFilter(jwtUtil, refreshRepository),
                        UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(new JWTFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class)
                .addFilterAt(new UserLoginFilter(userAuthenticationManager(), jwtUtil,refreshRepository),
                        UsernamePasswordAuthenticationFilter.class)
                .addFilterAt(new ControlLoginFilter(fireStaffAuthenticationManager(),jwtUtil,refreshRepository),
                        UsernamePasswordAuthenticationFilter.class)
                .addFilterAt(new DispatchLoginFilter(fireStaffAuthenticationManager(),jwtUtil,refreshRepository),
                        UsernamePasswordAuthenticationFilter.class)
                .addFilterAt(new AdminLoginFilter(adminAuthenticationManager(),jwtUtil,refreshRepository),
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }



}