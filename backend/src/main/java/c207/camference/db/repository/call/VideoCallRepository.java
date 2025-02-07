package c207.camference.db.repository.call;

import c207.camference.db.entity.call.VideoCall;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VideoCallRepository extends JpaRepository<VideoCall, Integer> {
    VideoCall findByCallId(Integer callId);
}
