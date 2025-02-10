package c207.camference.db.repository.etc;

import c207.camference.db.entity.etc.Refresh;
import c207.camference.util.jwt.JWTUtil;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public interface RefreshRepository extends CrudRepository<Refresh, String> {

    default Boolean existsByRefresh(String refresh) {
        if (refresh == null) {
            System.out.println("입력된 refresh 토큰이 null입니다.");
            return false;
        }

        // null이 아닌 토큰만 리스트로 수집
        List<Refresh> validTokens = new ArrayList<>();
        findAll().forEach(token -> {
            if (token != null && token.getRefresh() != null) {
                validTokens.add(token);
            }
        });

        // 유효한 토큰들 중에서 일치하는 것이 있는지 확인
        for (Refresh token : validTokens) {
            if (token.getRefresh().equals(refresh)) {
                return true;
            }
        }
        return false;
    }
    default void deleteByRefresh(String refresh) {
        if (refresh == null) {
            System.out.println("입력된 refresh 토큰이 null입니다.");
            return;
        }

        List<Refresh> validTokens = new ArrayList<>();
        findAll().forEach(token -> {
            if (token != null && token.getRefresh() != null) {
                validTokens.add(token);
            }
        });

        for (Refresh token : validTokens) {
            if (token.getRefresh().equals(refresh)) {
                delete(token);
                return;
            }
        }
    }

    default void deleteByUsernameAndRole(String username, String role, JWTUtil jwtUtil) {
        if (username == null || role == null || jwtUtil == null) {
            System.out.println("입력된 파라미터 중 null 값이 있습니다.");
            return;
        }

        List<Refresh> validTokens = new ArrayList<>();
        findAll().forEach(token -> {
            if (token != null && token.getRefresh() != null && token.getUsername() != null) {
                validTokens.add(token);
            }
        });

        for (Refresh token : validTokens) {
            try {
                if (token.getUsername().equals(username) &&
                        jwtUtil.getRole(token.getRefresh()).equals(role)) {
                    delete(token);
                }
            } catch (Exception e) {
                System.out.println("토큰 처리 중 에러 발생: " + e.getMessage());
            }
        }
    }
}
