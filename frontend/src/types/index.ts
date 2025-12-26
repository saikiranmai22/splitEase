export interface User {
    id: string;
    name: string;
    email: string;
}

export interface Group {
    id: string;
    name: string;
    inviteToken: string;
    createdBy: string;
    createdAt: string;
}

export interface Expense {
    id: string;
    description: string;
    amount: number;
    paidBy: string;
    paidByName: string;
    createdAt: string;
    splits: ExpenseSplit[];
}

export interface ExpenseSplit {
    userId: string;
    userName: string;
    owedAmount: number;
}

export interface Settlement {
    id: string;
    fromUser: string;
    fromUserName: string;
    toUser: string;
    toUserName: string;
    amount: number;
    status: 'PENDING' | 'SETTLED';
    createdAt: string;
    settledAt?: string;
}

export interface Debt {
    fromUserId: string;
    fromUserName: string;
    toUserId: string;
    toUserName: string;
    amount: number;
}

export interface Balance {
    userId: string;
    userName: string;
    netBalance: number;
}
