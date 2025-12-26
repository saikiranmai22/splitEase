package com.splitwise.clone.service;

import com.splitwise.clone.dto.BalanceSummaryResponse;
import com.splitwise.clone.dto.DebtResponse;
import com.splitwise.clone.entity.*;
import com.splitwise.clone.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class BalanceService {
    private final GroupMemberRepository groupMemberRepository;
    private final ExpenseRepository expenseRepository;
    private final ExpenseSplitRepository expenseSplitRepository;
    private final SettlementRepository settlementRepository;
    private final GroupService groupService;

    public List<BalanceSummaryResponse> getGroupBalances(UUID groupId) {
        Group group = groupService.findById(groupId);
        List<GroupMember> members = groupMemberRepository.findByGroup(group);
        List<Expense> expenses = expenseRepository.findByGroupAndIsDeletedFalse(group);
        List<Settlement> settlements = settlementRepository.findByGroup(group);

        Map<UUID, BigDecimal> netBalances = new HashMap<>();
        for (GroupMember member : members) {
            netBalances.put(member.getUser().getId(), BigDecimal.ZERO);
        }

        // Calculate from expenses
        for (Expense expense : expenses) {
            UUID payerId = expense.getPaidBy().getId();
            netBalances.put(payerId, netBalances.get(payerId).add(expense.getAmount()));

            List<ExpenseSplit> splits = expenseSplitRepository.findByExpense(expense);
            for (ExpenseSplit split : splits) {
                UUID userId = split.getUser().getId();
                netBalances.put(userId, netBalances.get(userId).subtract(split.getOwedAmount()));
            }
        }

        // Calculate from settlements
        for (Settlement settlement : settlements) {
            UUID fromId = settlement.getFromUser().getId();
            UUID toId = settlement.getToUser().getId();

            netBalances.put(fromId, netBalances.get(fromId).add(settlement.getAmount()));
            netBalances.put(toId, netBalances.get(toId).subtract(settlement.getAmount()));
        }

        List<BalanceSummaryResponse> summaries = new ArrayList<>();
        for (GroupMember member : members) {
            User user = member.getUser();
            summaries.add(BalanceSummaryResponse.builder()
                    .userId(user.getId())
                    .userName(user.getName())
                    .netBalance(netBalances.get(user.getId()))
                    .build());
        }

        return summaries;
    }

    public List<DebtResponse> getGroupDebts(UUID groupId) {
        List<BalanceSummaryResponse> balances = getGroupBalances(groupId);

        // Separate into debtors and creditors
        List<BalanceSummaryResponse> debtors = new ArrayList<>();
        List<BalanceSummaryResponse> creditors = new ArrayList<>();

        for (BalanceSummaryResponse b : balances) {
            if (b.getNetBalance().compareTo(BigDecimal.ZERO) < 0) {
                debtors.add(b);
            } else if (b.getNetBalance().compareTo(BigDecimal.ZERO) > 0) {
                creditors.add(b);
            }
        }

        // Sort to optimize transactions (optional but helpful)
        debtors.sort(Comparator.comparing(BalanceSummaryResponse::getNetBalance));
        creditors.sort(Comparator.comparing(BalanceSummaryResponse::getNetBalance).reversed());

        List<DebtResponse> debts = new ArrayList<>();
        int d = 0, c = 0;

        while (d < debtors.size() && c < creditors.size()) {
            BalanceSummaryResponse debtor = debtors.get(d);
            BalanceSummaryResponse creditor = creditors.get(c);

            BigDecimal amountToPay = debtor.getNetBalance().abs().min(creditor.getNetBalance());

            debts.add(DebtResponse.builder()
                    .fromUserId(debtor.getUserId())
                    .fromUserName(debtor.getUserName())
                    .toUserId(creditor.getUserId())
                    .toUserName(creditor.getUserName())
                    .amount(amountToPay)
                    .build());

            debtor.setNetBalance(debtor.getNetBalance().add(amountToPay));
            creditor.setNetBalance(creditor.getNetBalance().subtract(amountToPay));

            if (debtor.getNetBalance().compareTo(BigDecimal.ZERO) == 0)
                d++;
            if (creditor.getNetBalance().compareTo(BigDecimal.ZERO) == 0)
                c++;
        }

        return debts;
    }
}
