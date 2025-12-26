package com.splitwise.clone.dto;

import com.splitwise.clone.enums.SettlementStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class SettlementResponse {
    private UUID id;
    private UUID fromUser;
    private String fromUserName;
    private UUID toUser;
    private String toUserName;
    private BigDecimal amount;
    private SettlementStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime settledAt;
}
