package com.splitwise.clone.repository;

import com.splitwise.clone.entity.Expense;
import com.splitwise.clone.entity.ExpenseSplit;
import com.splitwise.clone.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ExpenseSplitRepository extends JpaRepository<ExpenseSplit, UUID> {
    List<ExpenseSplit> findByExpense(Expense expense);

    List<ExpenseSplit> findByUser(User user);
}
