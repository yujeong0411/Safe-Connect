package c207.camference.db.repository;

import c207.camference.db.entity.users.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Integer> {
    Optional<Admin> findByAdminLoginId(String adminLoginId);
    Admin findAdminByAdminLoginId(String adminLoginId);
}
