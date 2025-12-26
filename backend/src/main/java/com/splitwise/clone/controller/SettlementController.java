package com.splitwise.clone.controller;

import com.splitwise.clone.dto.CreateSettlementRequest;
import com.splitwise.clone.dto.SettlementResponse;
import com.splitwise.clone.service.SettlementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/settlements")
@RequiredArgsConstructor
public class SettlementController {
    private final SettlementService settlementService;

    @PostMapping
    public ResponseEntity<SettlementResponse> createSettlement(@Valid @RequestBody CreateSettlementRequest request) {
        return ResponseEntity.ok(settlementService.createSettlement(request));
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<SettlementResponse>> getGroupSettlements(@PathVariable UUID groupId) {
        return ResponseEntity.ok(settlementService.getGroupSettlements(groupId));
    }
}
