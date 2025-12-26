package com.splitwise.clone.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class ExpenseResponse {
    private UUID id;
    private String description;
    private BigDecimal amount;
    private UUID paidBy;
    private String paidByName;
    private LocalDateTime createdAt;
    private List<ExpenseSplitResponse> splits;
}
