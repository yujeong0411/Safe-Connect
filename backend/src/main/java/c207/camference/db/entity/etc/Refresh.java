package c207.camference.db.entity.etc;

import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.redis.core.RedisHash;

@Getter
@Setter
@RedisHash(value = "refreshToken",timeToLive=24 * 60 * 60)
public class Refresh {

    @Id
    private String id;
    private String username;
    private String refresh;
    private String expiration;
}