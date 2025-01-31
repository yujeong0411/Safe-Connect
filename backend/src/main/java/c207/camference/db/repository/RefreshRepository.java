package c207.camference.db.repository;

import c207.camference.db.entity.Refresh;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefreshRepository extends CrudRepository<Refresh, String> {

    default Boolean existsByRefresh(String refresh) {
        // findAll()을 사용하여 모든 refreshToken을 가져온 뒤
        // refresh 값이 일치하는지 확인
        Iterable<Refresh> all = findAll();
        for (Refresh token : all) {
            if (token.getRefresh().equals(refresh)) {
                return true;
            }
        }
        return false;
    }

    default void deleteByRefresh(String refresh){
        Iterable<Refresh> all = findAll();
        for (Refresh token : all) {
            if (token.getRefresh().equals(refresh)) {
                delete(token);
                return;
            }
        }

    }


}
