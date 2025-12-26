package com.splitwise.clone.service;

import com.splitwise.clone.dto.CreateExpenseRequest;
import com.splitwise.clone.dto.ExpenseResponse;
import com.splitwise.clone.dto.ExpenseSplitResponse;
import com.splitwise.clone.entity.Expense;
import com.splitwise.clone.entity.ExpenseSplit;
import com.splitwise.clone.entity.Group;
import com.splitwise.clone.entity.User;
import com.splitwise.clone.repository.ExpenseRepository;
import com.splitwise.clone.repository.ExpenseSplitRepository;
import com.splitwise.clone.repository.SettlementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseService {
        private final ExpenseRepository expenseRepository;
        private final ExpenseSplitRepository expenseSplitRepository;
        private final SettlementRepository settlementRepository;
        private final GroupService groupService;
        private final UserService userService;

        @Transactional
        public ExpenseResponse addExpense(CreateExpenseRequest request) {
                Group group = groupService.findById(request.getGroupId());
                User paidBy = userService.findById(request.getPaidBy());
                User createdBy = userService.findById(request.getCreatedBy());

                Expense expense = Expense.builder()
                                .group(group)
                                .description(request.getDescription())
                                .amount(request.getAmount())
                                .paidBy(paidBy)
                                .createdBy(createdBy)
                                .build();

                expense = expenseRepository.save(expense);

                for (var splitReq : request.getSplits()) {
                        User user = userService.findById(splitReq.getUserId());
                        ExpenseSplit split = ExpenseSplit.builder()
                                        .expense(expense)
                                        .user(user)
                                        .owedAmount(splitReq.getOwedAmount())
                                        .build();
                        expenseSplitRepository.save(split);
                }

                return mapToResponse(expense);
        }

        @Transactional
        public void deleteExpense(UUID expenseId) {
                Expense expense = expenseRepository.findById(expenseId)
                                .orElseThrow(() -> new RuntimeException("Expense not found"));

                if (settlementRepository.existsByGroup(expense.getGroup())) {
                        throw new RuntimeException("Cannot delete expense: settlements exist in this group");
                }

                expense.setIsDeleted(true);
                expenseRepository.save(expense);
        }

        public List<ExpenseResponse> getGroupExpenses(UUID groupId) {
                Group group = groupService.findById(groupId);
                return expenseRepository.findByGroupAndIsDeletedFalse(group).stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        private ExpenseResponse mapToResponse(Expense expense) {
                List<ExpenseSplitResponse> splits = expenseSplitRepository.findByExpense(expense).stream()
                                .map(split -> ExpenseSplitResponse.builder()
                                                .userId(split.getUser().getId())
                                                .userName(split.getUser().getName())
                                                .owedAmount(split.getOwedAmount())
                                                .build())
                                .collect(Collectors.toList());

                return ExpenseResponse.builder()
                                .id(expense.getId())
                                .description(expense.getDescription())
                                .amount(expense.getAmount())
                                .paidBy(expense.getPaidBy().getId())
                                .paidByName(expense.getPaidBy().getName())
                                .createdAt(expense.getCreatedAt())
                                .splits(splits)
                                .build();
        }
}
