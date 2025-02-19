package c207.camference.db.repository.call;

import c207.camference.db.entity.call.VideoCallUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VideoCallUserRepository extends JpaRepository<VideoCallUser, Integer> {
    // video_call_id가 fireStaffId와 일치하고, 해당 VideoCall의 Call의 callId가 주어진 callId와 일치하며,
    // 아직 나간시간이 기록되지 않은 레코드를 조회하는 메서드.
    List<VideoCallUser> findByVideoCallIdAndVideoCallOutAtIsNullAndVideoCall_Call_CallId(Integer videoCallId, Integer callId);


    VideoCallUser findByVideoCallUserCategoryAndVideoCallerIdAndVideoCallId(String videoCallUserCategory, Integer videoCallerId, Integer videoCallId);
}
