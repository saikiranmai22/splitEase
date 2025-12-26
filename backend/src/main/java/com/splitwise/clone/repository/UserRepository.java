package com.splitwise.clone.repository;

import com.splitwise.clone.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);

    @Query(value = "SELECT DISTINCT u.* FROM users u " +
            "JOIN group_members gm1 ON u.id = gm1.user_id " +
            "JOIN group_members gm2 ON gm1.group_id = gm2.group_id " +
            "WHERE gm2.user_id = :userId AND u.id != :userId", nativeQuery = true)
    List<User> findFriendsByUserId(@Param("userId") UUID userId);
}
