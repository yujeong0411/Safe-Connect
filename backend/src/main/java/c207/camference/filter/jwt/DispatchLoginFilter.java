package c207.camference.filter.jwt;

import c207.camference.util.jwt.JWTUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

public class DispatchLoginFilter extends UsernamePasswordAuthenticationFilter {
    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;

    public DispatchLoginFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        setAuthenticationManager(authenticationManager);
        setFilterProcessesUrl("/dispatch/login"); // 사용자 로그인 URL 설정
    }

    // 이거 다음
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) {
        String userId = request.getParameter("fireStaffLoginId");
        String password = request.getParameter("fireStaffPassword");
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userId, password, null);
        return getAuthenticationManager().authenticate(authToken);
    }

    // 여기 x
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) {

        UserDetails adminDetails = (UserDetails) authentication.getPrincipal();

        String token = jwtUtil.createJwt(adminDetails.getUsername(), "ROLE_CONTROL",60*60*1000L);

        response.addHeader("Authorization", "Bearer " + token);
        // 성공시 user로 보내기
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) {
        response.setStatus(401);
    }
}
