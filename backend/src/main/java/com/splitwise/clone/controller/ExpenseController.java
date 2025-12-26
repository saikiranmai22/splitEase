package com.splitwise.clone.controller;

import com.splitwise.clone.dto.CreateExpenseRequest;
import com.splitwise.clone.dto.ExpenseResponse;
import com.splitwise.clone.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {
    private final ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<ExpenseResponse> addExpense(@Valid @RequestBody CreateExpenseRequest request) {
        return ResponseEntity.ok(expenseService.addExpense(request));
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<ExpenseResponse>> getGroupExpenses(@PathVariable UUID groupId) {
        return ResponseEntity.ok(expenseService.getGroupExpenses(groupId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable UUID id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }
}
