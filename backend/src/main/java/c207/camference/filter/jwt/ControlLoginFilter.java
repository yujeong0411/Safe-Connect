package c207.camference.filter.jwt;

import c207.camference.db.entity.others.Refresh;
import c207.camference.db.repository.RefreshRepository;
import c207.camference.util.jwt.JWTUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.Collection;
import java.util.Date;
import java.util.Iterator;

public class ControlLoginFilter extends UsernamePasswordAuthenticationFilter {
    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;
    private final RefreshRepository refreshRepository;

    public ControlLoginFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil,
                              RefreshRepository refreshRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.refreshRepository = refreshRepository;

        setAuthenticationManager(authenticationManager);
        setFilterProcessesUrl("/control/login"); // 사용자 로그인 URL 설정
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
        UserDetails controlDetails = (UserDetails) authentication.getPrincipal();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        String access = jwtUtil.createJwt("access",controlDetails.getUsername(), "ROLE_CONTROL",10*60*1000L);
        String refresh = jwtUtil.createJwt("refresh",controlDetails.getUsername(), "ROLE_CONTROL",24 * 60 * 60*1000L);

        //Refresh 토큰 저장
        addRefreshEntity(controlDetails.getUsername(), refresh, 24 * 60 * 60*1000L);


        response.setHeader("access", access);
        response.addCookie(createCookie("refresh",refresh));
        response.setStatus(HttpServletResponse.SC_OK);

        // 성공시 user로 보내기
    }
    private void addRefreshEntity(String username, String refresh, Long expiredMs) {

        Date date = new Date(System.currentTimeMillis() + expiredMs);

        Refresh refreshEntity = new Refresh();
        refreshEntity.setUsername(username);
        refreshEntity.setRefresh(refresh);
        refreshEntity.setExpiration(date.toString());

        refreshRepository.save(refreshEntity);
    }
    private Cookie createCookie(String key, String value) {

        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(24*60*60);
        //cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setHttpOnly(true);

        return cookie;
    }
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) {
        response.setStatus(401);
    }
}
