package c207.camference.db.repository;

<<<<<<< HEAD
=======
import c207.camference.db.entity.User;
>>>>>>> 9494a876eee1f3528c5ef7a68f5a37c7b2574c62
import c207.camference.db.entity.UserMediDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

<<<<<<< HEAD
=======
import java.util.List;
>>>>>>> 9494a876eee1f3528c5ef7a68f5a37c7b2574c62
import java.util.Optional;

@Repository
public interface UserMediDetailRepository extends JpaRepository<UserMediDetail, Integer> {
<<<<<<< HEAD
    Optional<UserMediDetail> findByUser(c207.camference.db.entity.users.User user);
=======
    Optional<UserMediDetail> findByUser(User user);
>>>>>>> 9494a876eee1f3528c5ef7a68f5a37c7b2574c62
}
