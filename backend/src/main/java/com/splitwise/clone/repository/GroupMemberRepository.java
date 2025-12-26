package com.splitwise.clone.repository;

import com.splitwise.clone.entity.Group;
import com.splitwise.clone.entity.GroupMember;
import com.splitwise.clone.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, UUID> {
    List<GroupMember> findByGroup(Group group);

    List<GroupMember> findByUser(User user);

    Optional<GroupMember> findByGroupAndUser(Group group, User user);

    boolean existsByGroupAndUser(Group group, User user);

    List<GroupMember> findByGroupId(UUID groupId);
}
