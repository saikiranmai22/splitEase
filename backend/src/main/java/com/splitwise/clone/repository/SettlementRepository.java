package com.splitwise.clone.repository;

import com.splitwise.clone.entity.Group;
import com.splitwise.clone.entity.Settlement;
import com.splitwise.clone.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SettlementRepository extends JpaRepository<Settlement, UUID> {
    List<Settlement> findByGroup(Group group);

    List<Settlement> findByFromUserOrToUser(User fromUser, User toUser);

    boolean existsByGroupAndFromUserOrToUser(Group group, User fromUser, User toUser);

    // Check if any settlement exists for an expense (indirectly via group and users
    // involved)
    // Actually, the requirement says "cannot delete expense if settlement exists".
    // This usually means if any settlement has been made in the group after the
    // expense was added,
    // or more specifically if this expense has been settled.
    // For simplicity, let's check if any settlement exists in the group.
    boolean existsByGroup(Group group);
}
