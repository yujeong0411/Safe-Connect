package c207.camference.filter.jwt;

import c207.camference.api.dto.FireStaffDetails;
import c207.camference.api.dto.admin.AdminDetails;
import c207.camference.api.dto.user.CustomUserDetails;
import c207.camference.db.entity.users.Admin;
import c207.camference.db.entity.users.FireStaff;
import c207.camference.db.entity.users.User;
import c207.camference.util.jwt.JWTUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;

    public JWTFilter(JWTUtil jwtUtil) {

        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        //request에서 Authorization 헤더를 찾음
        String authorization= request.getHeader("Authorization");

        //Authorization 헤더 검증
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            //조건이 해당되면 메소드 종료 (필수)
            return;
        }

        String token = authorization.split(" ")[1];

        //토큰 소멸 시간 검증
        if (jwtUtil.isExpired(token)) {
            System.out.println("token expired");
            filterChain.doFilter(request, response);
            //조건이 해당되면 메소드 종료 (필수)
            return;
        }

        String role = jwtUtil.getRole(token);
        String loginId = jwtUtil.getLoginId(token);
        Authentication authToken;

        if ("ROLE_USER".equals(role)) {
            User user = new User();
            user.setUserEmail(loginId);
            user.setUserPassword("temppassword");
            CustomUserDetails userDetails = new CustomUserDetails(user);
            authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            System.out.println("user");
        } else if("ROLE_ADMIN".equals(role)) { // ROLE_ADMIN
            Admin admin = new Admin();
            admin.setAdminLoginId(loginId);
            admin.setAdminPassword("temppassword");
            AdminDetails adminDetails = new AdminDetails(admin);
            authToken = new UsernamePasswordAuthenticationToken(adminDetails, null, adminDetails.getAuthorities());
            System.out.println("admin");
        } else if("ROLE_CONTROL".equals(role) || "ROLE_DISPATCH".equals(role)) {
            FireStaff fireStaff = new FireStaff();
            fireStaff.setFireStaffLoginId(loginId);
            fireStaff.setFireStaffPassword("temppassword");
            FireStaffDetails fireStaffDetails = new FireStaffDetails(fireStaff);
            authToken = new UsernamePasswordAuthenticationToken(fireStaffDetails, null, fireStaffDetails.getAuthorities());
            System.out.println("admin");

        }

        SecurityContextHolder.getContext().setAuthentication(authToken);
        filterChain.doFilter(request, response);
    }
}
