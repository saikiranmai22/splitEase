package com.splitwise.clone.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
public class BalanceSummaryResponse {
    private UUID userId;
    private String userName;
    private BigDecimal netBalance; // Positive means they are owed, negative means they owe
    private Map<UUID, BigDecimal> owesTo; // Who this user owes and how much
    private Map<UUID, BigDecimal> owedBy; // Who owes this user and how much
}
