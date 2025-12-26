package com.splitwise.clone.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class ExpenseSplitResponse {
    private UUID userId;
    private String userName;
    private BigDecimal owedAmount;
}
