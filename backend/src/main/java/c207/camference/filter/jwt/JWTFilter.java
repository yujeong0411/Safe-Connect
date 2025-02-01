package c207.camference.filter.jwt;

import c207.camference.api.dto.admin.AdminDetails;
import c207.camference.api.dto.fireStaff.FireStaffDetails;
import c207.camference.api.dto.hospital.HospitalDetails;
import c207.camference.api.dto.user.CustomUserDetails;
import c207.camference.db.entity.admin.Admin;
import c207.camference.db.entity.firestaff.FireStaff;
import c207.camference.db.entity.hospital.Hospital;
import c207.camference.db.entity.users.User;
import c207.camference.util.jwt.JWTUtil;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;

public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;

    public JWTFilter(JWTUtil jwtUtil) {

        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
     // 리프레시 토큰 엔드포인트는 필터링 제외
        if ("/reissue".equals(request.getRequestURI())) {
            filterChain.doFilter(request, response);
            return;
        }



        //request에서 Authorization 헤더를 찾음
        String authHeader = request.getHeader("Authorization");

        //Authorization 헤더 검증
        if (authHeader  == null|| !authHeader .startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        String token = authHeader.substring(7);
        //토큰 소멸 시간 검증
        try {
            jwtUtil.isExpired(token);
        } catch (ExpiredJwtException e) {

            //response body
            PrintWriter writer = response.getWriter();
            writer.print("access token expired");

            //response status code
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String category = jwtUtil.getCategory(token);

        if (!category.equals("access")) {
            //response body
            PrintWriter writer = response.getWriter();
            writer.print("invalid access token");
            //response status code
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
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
            System.out.println("fireStaff");

        } else {
            // 병원 생기면 추가해야함

            Hospital hospital = new Hospital();
            hospital.setHospitalLoginId(loginId);
            hospital.setHospitalPassword("temppassword");
            HospitalDetails hospitalDetails = new HospitalDetails(hospital);
            authToken = new UsernamePasswordAuthenticationToken(hospitalDetails, null, hospitalDetails.getAuthorities());
            System.out.println("hospital");
        }



        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);
    }
}
