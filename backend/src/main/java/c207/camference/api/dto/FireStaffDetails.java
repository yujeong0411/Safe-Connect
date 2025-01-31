package c207.camference.api.dto;

import c207.camference.db.entity.users.FireStaff;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;

public class FireStaffDetails implements UserDetails {
    private final FireStaff fireStaff;
    public FireStaffDetails(FireStaff fireStaff) {
        this.fireStaff = fireStaff;
    }

    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> collection = new ArrayList<>();

        collection.add(new GrantedAuthority() {
            @Override
            public String getAuthority() {
                if (fireStaff.getFireStaffCategory().equals("C")){
                    return "ROLE_CONTROL";
                }else{
                    return "ROLE_DISPATCH";
                }
            }
        });
        return collection;
    }


    public String getPassword() {
        return fireStaff.getFireStaffPassword();
    }

    public String getUsername() {
        return fireStaff.getFireStaffLoginId();
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
