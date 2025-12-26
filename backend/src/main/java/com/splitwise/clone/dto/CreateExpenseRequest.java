package com.splitwise.clone.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
public class CreateExpenseRequest {
    @NotNull(message = "Group ID is required")
    private UUID groupId;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    @NotNull(message = "Paid by user ID is required")
    private UUID paidBy;

    @NotNull(message = "Created by user ID is required")
    private UUID createdBy;

    @NotEmpty(message = "At least one split is required")
    private List<ExpenseSplitRequest> splits;
}
