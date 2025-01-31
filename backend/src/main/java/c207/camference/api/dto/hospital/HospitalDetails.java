package c207.camference.api.dto.hospital;

import c207.camference.db.entity.hospital.Hospital;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;

public class HospitalDetails implements UserDetails {
    private final Hospital hospital;
    public HospitalDetails(Hospital hospital) {
        this.hospital = hospital;
    }

    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> collection = new ArrayList<>();
        collection.add(new GrantedAuthority() {
            @Override
            public String getAuthority() {
                return "ROLE_HOSP";
            }
        });
        return collection;
    }


    public String getPassword() {
        return hospital.getHospitalPassword();
    }

    public String getUsername() {
        return hospital.getHospitalLoginId();
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
