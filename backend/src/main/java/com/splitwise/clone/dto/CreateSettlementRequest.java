package com.splitwise.clone.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class CreateSettlementRequest {
    @NotNull(message = "Group ID is required")
    private UUID groupId;

    @NotNull(message = "From user ID is required")
    private UUID fromUser;

    @NotNull(message = "To user ID is required")
    private UUID toUser;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;
}
