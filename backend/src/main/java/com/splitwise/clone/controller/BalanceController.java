package com.splitwise.clone.controller;

import com.splitwise.clone.dto.BalanceSummaryResponse;
import com.splitwise.clone.service.BalanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/balances")
@RequiredArgsConstructor
public class BalanceController {
    private final BalanceService balanceService;

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<BalanceSummaryResponse>> getGroupBalances(@PathVariable UUID groupId) {
        return ResponseEntity.ok(balanceService.getGroupBalances(groupId));
    }

    @GetMapping("/group/{groupId}/debts")
    public ResponseEntity<List<com.splitwise.clone.dto.DebtResponse>> getGroupDebts(@PathVariable UUID groupId) {
        return ResponseEntity.ok(balanceService.getGroupDebts(groupId));
    }
}
