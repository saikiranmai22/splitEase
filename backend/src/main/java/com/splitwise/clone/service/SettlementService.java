package com.splitwise.clone.service;

import com.splitwise.clone.dto.CreateSettlementRequest;
import com.splitwise.clone.dto.SettlementResponse;
import com.splitwise.clone.entity.Group;
import com.splitwise.clone.entity.Settlement;
import com.splitwise.clone.entity.User;
import com.splitwise.clone.enums.SettlementStatus;
import com.splitwise.clone.repository.SettlementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SettlementService {
    private final SettlementRepository settlementRepository;
    private final GroupService groupService;
    private final UserService userService;

    @Transactional
    public SettlementResponse createSettlement(CreateSettlementRequest request) {
        Group group = groupService.findById(request.getGroupId());
        User fromUser = userService.findById(request.getFromUser());
        User toUser = userService.findById(request.getToUser());

        Settlement settlement = Settlement.builder()
                .group(group)
                .fromUser(fromUser)
                .toUser(toUser)
                .amount(request.getAmount())
                .status(SettlementStatus.SETTLED) // For MVP, mark as settled immediately
                .settledAt(LocalDateTime.now())
                .build();

        settlement = settlementRepository.save(settlement);
        return mapToResponse(settlement);
    }

    public List<SettlementResponse> getGroupSettlements(UUID groupId) {
        Group group = groupService.findById(groupId);
        return settlementRepository.findByGroup(group).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private SettlementResponse mapToResponse(Settlement settlement) {
        return SettlementResponse.builder()
                .id(settlement.getId())
                .fromUser(settlement.getFromUser().getId())
                .fromUserName(settlement.getFromUser().getName())
                .toUser(settlement.getToUser().getId())
                .toUserName(settlement.getToUser().getName())
                .amount(settlement.getAmount())
                .status(settlement.getStatus())
                .createdAt(settlement.getCreatedAt())
                .settledAt(settlement.getSettledAt())
                .build();
    }
}
