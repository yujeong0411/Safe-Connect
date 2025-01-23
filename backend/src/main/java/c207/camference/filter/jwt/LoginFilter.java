package c207.camference.filter.jwt;

import c207.camference.api.dto.user.CustomUserDetails;
import c207.camference.util.jwt.JWTUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.Collection;
import java.util.Iterator;

public class LoginFilter  extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;

    public LoginFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }



    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {

        String userEmail = request.getParameter("userEmail");
        String password = request.getParameter("userPassword");
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userEmail, password, null);
        return authenticationManager.authenticate(authToken);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) {


        //customUserDetails dto에서 이메일, role 가져오기...
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
        String userEmail = customUserDetails.getUserEmail();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        // 확인용 print
        System.out.println("토큰 생성 중......");


        //jwtUtil에서 토큰 생성-> 이메일, 역할, 만료시간 설정
        String token = jwtUtil.createJwt(userEmail, role, 60*60*1000L);//토큰 만료 시간(60분) 기준은 millisecond 다.
        //토큰 저장 데이터를 userEmail로 해야 unique한 값을 이용해 값 찾기가 가능해진다.

        // 응답 헤더에 Authorization : bearer 토큰 을 추가..
        response.addHeader("Authorization", "Bearer " + token);
    }


    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) {
        response.setStatus(401);
    }
}