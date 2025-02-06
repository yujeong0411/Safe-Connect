package c207.camference.db.repository.call;

import c207.camference.db.entity.call.VideoCallUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface VideoCallUserRepository extends JpaRepository<VideoCallUser, Integer> {
    List<VideoCallUser> findByVideoCallIdAndVideoCallOutAtIsNull(Integer videoCallId);
}
