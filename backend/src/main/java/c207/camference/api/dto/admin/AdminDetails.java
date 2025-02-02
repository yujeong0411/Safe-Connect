package c207.camference.api.dto.admin;

import c207.camference.db.entity.admin.Admin;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;

public class AdminDetails implements UserDetails {
    private final Admin admin;
        public AdminDetails(Admin admin) {
        this.admin = admin;
    }

    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> collection = new ArrayList<>();

        collection.add(new GrantedAuthority() {
            @Override
            public String getAuthority() {
                return "ROLE_ADMIN"; // 유저 역할 강제 추가를 위해서 넣음.. 나중에 소방서, 병원 관련 db 생성 시 생각해봐야 할것...
            }
        });
        return collection;
    }


    public String getPassword() {
        return admin.getAdminPassword();
    }

    public String getUsername() {
        return admin.getAdminLoginId();
    }

    public boolean isAccountNonExpired() {
        return true;
    }

    public boolean isAccountNonLocked() {
        return true;
    }

    public boolean isCredentialsNonExpired() {
        return true;
    }

    public boolean isEnabled() {
        return true;
    }


}
