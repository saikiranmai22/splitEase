import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import type { Group, Expense, Balance, User, Settlement, Debt } from '../types';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Users, Receipt, Wallet, CheckCircle, Plus, Copy, Check, Trash2 } from 'lucide-react';
import AddExpenseModal from '../components/AddExpenseModal';
import SettleUpModal from '../components/SettleUpModal';

const GroupDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [group, setGroup] = useState<Group | null>(null);
    const [members, setMembers] = useState<User[]>([]);
    const [activeTab, setActiveTab] = useState<'expenses' | 'balances' | 'settle' | 'members'>('expenses');
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);

    const fetchGroupData = useCallback(async () => {
        if (!id || !user) return;
        setLoading(true);
        try {
            console.log('Fetching group data for ID:', id);
            const groupRes = await api.get(`/groups/user/${user.id}`);
            console.log('User groups fetched:', groupRes.data);
            const foundGroup = groupRes.data.find((g: Group) => g.id === id);

            if (foundGroup) {
                setGroup(foundGroup);
                console.log('Group found, fetching members...');
                const membersRes = await api.get(`/groups/${id}/members`);
                console.log('Members fetched:', membersRes.data);
                setMembers(membersRes.data);
            } else {
                console.warn('Group not found in user groups list');
                setGroup(null);
            }
        } catch (err) {
            console.error('Failed to fetch group data:', err);
        } finally {
            setLoading(false);
        }
    }, [id, user]);

    useEffect(() => {
        fetchGroupData();
    }, [fetchGroupData]);

    const copyInviteLink = () => {
        if (!group) return;
        const link = `${window.location.origin}/join/${group.inviteToken}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
            <p className="text-gray-500">Loading group details...</p>
        </div>
    );

    if (!group) return (
        <div className="max-w-4xl mx-auto p-6 text-center">
            <div className="bg-red-50 text-red-600 p-8 rounded-xl border border-red-100">
                <h2 className="text-2xl font-bold mb-2">Group Not Found</h2>
                <p className="mb-6">We couldn't find the group you're looking for. It might have been deleted or you might not be a member.</p>
                <Link to="/" className="inline-flex items-center gap-2 text-teal-600 font-bold hover:underline">
                    <ArrowLeft size={18} /> Back to Dashboard
                </Link>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-teal-600 mb-4 transition">
                        <ArrowLeft size={18} /> Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-800">{group.name}</h1>
                </div>
                <button
                    onClick={copyInviteLink}
                    className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                >
                    {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                    {copied ? 'Copied Link!' : 'Invite Friends'}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('expenses')}
                    className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition ${activeTab === 'expenses' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Receipt size={18} /> Expenses
                </button>
                <button
                    onClick={() => setActiveTab('balances')}
                    className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition ${activeTab === 'balances' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Wallet size={18} /> Balances
                </button>
                <button
                    onClick={() => setActiveTab('settle')}
                    className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition ${activeTab === 'settle' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <CheckCircle size={18} /> Settle Up
                </button>
                <button
                    onClick={() => setActiveTab('members')}
                    className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition ${activeTab === 'members' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Users size={18} /> Members
                </button>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
                {activeTab === 'expenses' && (
                    <ExpensesTab
                        groupId={group.id}
                        onAddExpense={() => setIsExpenseModalOpen(true)}
                    />
                )}
                {activeTab === 'balances' && <BalancesTab groupId={group.id} />}
                {activeTab === 'settle' && (
                    <SettleUpTab
                        groupId={group.id}
                        onSettleUp={() => setIsSettleModalOpen(true)}
                    />
                )}
                {activeTab === 'members' && <MembersTab groupId={group.id} members={members} />}
            </div>

            {isExpenseModalOpen && user && (
                <AddExpenseModal
                    groupId={group.id}
                    members={members}
                    currentUserId={user.id}
                    onClose={() => setIsExpenseModalOpen(false)}
                    onSuccess={() => {
                        setIsExpenseModalOpen(false);
                        window.location.reload();
                    }}
                />
            )}

            {isSettleModalOpen && user && (
                <SettleUpModal
                    groupId={group.id}
                    members={members}
                    currentUserId={user.id}
                    onClose={() => setIsSettleModalOpen(false)}
                    onSuccess={() => {
                        setIsSettleModalOpen(false);
                        window.location.reload();
                    }}
                />
            )}
        </div>
    );
};

const ExpensesTab: React.FC<{ groupId: string; onAddExpense: () => void }> = ({ groupId, onAddExpense }) => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await api.get(`/expenses/group/${groupId}`);
                setExpenses(response.data);
            } catch (err) {
                console.error('Failed to fetch expenses', err);
            } finally {
                setLoading(false);
            }
        };
        fetchExpenses();
    }, [groupId]);

    const handleDelete = async (expenseId: string) => {
        if (!window.confirm('Are you sure you want to delete this expense?')) return;
        try {
            await api.delete(`/expenses/${expenseId}`);
            setExpenses(expenses.filter(e => e.id !== expenseId));
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to delete expense');
        }
    };

    if (loading) return <p className="text-center py-12 text-gray-500">Loading expenses...</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Expenses</h2>
                <button
                    onClick={onAddExpense}
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700 transition"
                >
                    <Plus size={18} /> Add Expense
                </button>
            </div>

            {expenses.length === 0 ? (
                <p className="text-gray-500 text-center py-12">No expenses yet. Add one to get started!</p>
            ) : (
                <div className="space-y-4">
                    {expenses.map((expense) => (
                        <div key={expense.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition group">
                            <div className="flex items-center gap-4">
                                <div className="text-center min-w-[50px]">
                                    <p className="text-xs text-gray-400 uppercase font-bold">
                                        {new Date(expense.createdAt).toLocaleDateString('en-US', { month: 'short' })}
                                    </p>
                                    <p className="text-xl font-bold text-gray-600">
                                        {new Date(expense.createdAt).getDate()}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800">{expense.description}</h4>
                                    <p className="text-sm text-gray-500">
                                        {expense.paidByName} paid <span className="font-medium text-gray-700">₹{expense.amount.toFixed(2)}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-xs text-gray-400 uppercase font-bold">Total</p>
                                    <p className="text-lg font-bold text-gray-800">
                                        ₹{expense.amount.toFixed(2)}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDelete(expense.id)}
                                    className="text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const BalancesTab: React.FC<{ groupId: string }> = ({ groupId }) => {
    const [balances, setBalances] = useState<Balance[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBalances = async () => {
            try {
                const response = await api.get(`/balances/group/${groupId}`);
                setBalances(response.data);
            } catch (err) {
                console.error('Failed to fetch balances', err);
            } finally {
                setLoading(false);
            }
        };
        fetchBalances();
    }, [groupId]);

    if (loading) return <p className="text-center py-12 text-gray-500">Calculating balances...</p>;

    return (
        <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Group Balances</h2>
            <div className="space-y-4">
                {balances.map((balance) => (
                    <div key={balance.userId} className="flex items-center justify-between p-4 border rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold">
                                {balance.userName.charAt(0)}
                            </div>
                            <span className="font-medium text-gray-800">{balance.userName}</span>
                        </div>
                        <div className="text-right">
                            {balance.netBalance > 0 ? (
                                <p className="text-teal-600 font-bold">is owed ₹{balance.netBalance.toFixed(2)}</p>
                            ) : balance.netBalance < 0 ? (
                                <p className="text-orange-600 font-bold">owes ₹{Math.abs(balance.netBalance).toFixed(2)}</p>
                            ) : (
                                <p className="text-gray-400 font-bold">settled up</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SettleUpTab: React.FC<{ groupId: string; onSettleUp: () => void }> = ({ groupId, onSettleUp }) => {
    const { user } = useAuth();
    const [settlements, setSettlements] = useState<Settlement[]>([]);
    const [debts, setDebts] = useState<Debt[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [settlementsRes, debtsRes] = await Promise.all([
                    api.get(`/settlements/group/${groupId}`),
                    api.get(`/balances/group/${groupId}/debts`)
                ]);
                setSettlements(settlementsRes.data);
                setDebts(debtsRes.data);
            } catch (err) {
                console.error('Failed to fetch settlement data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [groupId]);

    if (loading) return <p className="text-center py-12 text-gray-500">Loading settlement data...</p>;

    const myDebts = debts.filter(d => d.fromUserId === user?.id);

    return (
        <div className="space-y-8">
            {/* Individual Debts Section */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Your Debts</h2>
                    <button
                        onClick={onSettleUp}
                        className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700 transition shadow-md shadow-teal-100"
                    >
                        <CheckCircle size={18} /> Settle Up
                    </button>
                </div>

                {myDebts.length === 0 ? (
                    <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center">
                        <CheckCircle className="mx-auto text-green-500 mb-2" size={32} />
                        <p className="text-green-700 font-medium">You are all settled up!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {myDebts.map((debt, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-orange-50 border border-orange-100 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold">
                                        {debt.toUserName.charAt(0)}
                                    </div>
                                    <p className="text-gray-800">
                                        You owe <span className="font-bold">{debt.toUserName}</span>
                                    </p>
                                </div>
                                <p className="text-lg font-bold text-orange-600">₹{debt.amount.toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Settlement History Section */}
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6">Settlement History</h2>
                {settlements.length === 0 ? (
                    <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-xl border border-dashed">No settlements recorded yet.</p>
                ) : (
                    <div className="space-y-4">
                        {settlements.map((settlement) => (
                            <div key={settlement.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition">
                                <div className="flex items-center gap-4">
                                    <div className="bg-green-100 p-2 rounded-full text-green-600">
                                        <CheckCircle size={20} />
                                    </div>
                                    <div>
                                        <p className="text-gray-800">
                                            <span className="font-bold">{settlement.fromUserName}</span> paid <span className="font-bold">{settlement.toUserName}</span>
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(settlement.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-gray-800">₹{settlement.amount.toFixed(2)}</p>
                                    <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-bold">
                                        {settlement.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const MembersTab: React.FC<{ groupId: string; members: User[] }> = ({ members }) => {
    return (
        <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Group Members</h2>
            <div className="space-y-4">
                {members.map((member) => (
                    <div key={member.id} className="flex items-center gap-4 p-4 border rounded-xl">
                        <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center font-bold text-lg">
                            {member.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold text-gray-800">{member.name}</p>
                            <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GroupDetails;
