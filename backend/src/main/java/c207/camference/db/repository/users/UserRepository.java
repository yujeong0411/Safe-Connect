package c207.camference.db.repository.users;

import c207.camference.db.entity.users.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

//JpaRepository를 활용해 빠른 쿼리 검색이 가능하도록 한다.
@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    User findUserByUserEmail(String userEmail);
    User findUserByUserPhone(String userPhone);
    Boolean existsByUserEmail(String userEmail);
    Optional<User> findByUserEmail(String userEmail);
    Optional<User> findByUserNameAndUserPhone(String userName, String userPhone);
    Optional<User> findByUserPhone(String userPhone);
}
