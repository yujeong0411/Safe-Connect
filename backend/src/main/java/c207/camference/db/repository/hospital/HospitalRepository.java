package c207.camference.db.repository.hospital;

import c207.camference.db.entity.hospital.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Integer> {
    Optional<Hospital> findByHospitalLoginId(String hospitalLoginId);
    Optional<Hospital> findByHospitalName(String hospitalName);

    List<Hospital> findAllByHospitalIdIn(List<Integer> hospitalIds);

    // 위도, 경도로 두 지점간의 거리 계산
    @Query(value = "SELECT ST_Distance_Sphere(" +
            "POINT(:longitude1, :latitude1), " +
            "POINT(:longitude2, :latitude2)" +
            ") / 1000 AS distance_km",
            nativeQuery = true)
    Double calculateDistance(
            @Param("longitude1") double longitude1,
            @Param("latitude1") double latitude1,
            @Param("longitude2") double longitude2,
            @Param("latitude2") double latitude2
    );
}
