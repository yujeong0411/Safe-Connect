package c207.camference.db.repository.users;

import c207.camference.db.entity.users.User;
import c207.camference.db.entity.users.UserMediDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserMediDetailRepository extends JpaRepository<UserMediDetail, Integer> {
    Optional<UserMediDetail> findByUser(User user);
}
