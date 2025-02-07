package c207.camference.db.repository.openapi;

import c207.camference.db.entity.etc.Aed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AedRepository extends JpaRepository<Aed, Integer> {

    @Query(value = "SELECT a.* FROM aed a WHERE " +
            "ST_Distance(POINT(a.aed_longitude, a.aed_latitude), " +
            "POINT(:longitude, :latitude)) * 111.195 <= 1",
            nativeQuery = true)
    List<Aed> findAedsWithin1Km(double latitude, double longitude);
}

