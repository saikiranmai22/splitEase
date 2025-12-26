package com.splitwise.clone.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class ExpenseSplitRequest {
    @NotNull(message = "User ID is required")
    private UUID userId;

    @NotNull(message = "Owed amount is required")
    @PositiveOrZero(message = "Owed amount cannot be negative")
    private BigDecimal owedAmount;
}
