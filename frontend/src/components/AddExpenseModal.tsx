import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import api from '../api/client';
import type { User } from '../types';

interface AddExpenseModalProps {
    groupId: string;
    members: User[];
    onClose: () => void;
    onSuccess: () => void;
    currentUserId: string;
}

interface Split {
    userId: string;
    owedAmount: number;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ groupId, members, onClose, onSuccess, currentUserId }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [paidBy, setPaidBy] = useState(currentUserId);
    const [splitType, setSplitType] = useState<'EQUAL' | 'EXACT' | 'PERCENTAGE'>('EQUAL');
    const [selectedMembers, setSelectedMembers] = useState<string[]>(members.map(m => m.id));
    const [exactAmounts, setExactAmounts] = useState<Record<string, string>>({});
    const [percentages, setPercentages] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const totalAmount = parseFloat(amount);
        let splits: Split[] = [];

        if (splitType === 'EQUAL') {
            const splitAmount = totalAmount / selectedMembers.length;
            splits = selectedMembers.map(userId => ({
                userId,
                owedAmount: splitAmount
            }));
        } else if (splitType === 'EXACT') {
            splits = selectedMembers.map(userId => ({
                userId,
                owedAmount: parseFloat(exactAmounts[userId] || '0')
            }));
            const sum = splits.reduce((acc, s) => acc + s.owedAmount, 0);
            if (Math.abs(sum - totalAmount) > 0.01) {
                setError(`Total of splits (₹${sum.toFixed(2)}) must equal total amount (₹${totalAmount.toFixed(2)})`);
                setLoading(false);
                return;
            }
        } else if (splitType === 'PERCENTAGE') {
            splits = selectedMembers.map(userId => ({
                userId,
                owedAmount: (totalAmount * parseFloat(percentages[userId] || '0')) / 100
            }));
            const sumPercent = selectedMembers.reduce((acc, userId) => acc + parseFloat(percentages[userId] || '0'), 0);
            if (Math.abs(sumPercent - 100) > 0.01) {
                setError(`Total percentage must equal 100% (current: ${sumPercent}%)`);
                setLoading(false);
                return;
            }
        }

        try {
            await api.post('/expenses', {
                groupId,
                description,
                amount: totalAmount,
                paidBy,
                createdBy: currentUserId,
                splits
            });
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to add expense');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Add an expense</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto">
                    {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

                    <div className="space-y-4 mb-6">
                        <input
                            type="text"
                            placeholder="Enter a description"
                            className="w-full text-lg p-2 border-b focus:border-teal-500 outline-none transition"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                        <div className="flex items-center gap-2">
                            <span className="text-2xl text-gray-400">₹</span>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="text-3xl w-full p-2 border-b focus:border-teal-500 outline-none transition"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Paid by</label>
                        <select
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            value={paidBy}
                            onChange={(e) => setPaidBy(e.target.value)}
                        >
                            {members.map(m => (
                                <option key={m.id} value={m.id}>{m.id === currentUserId ? 'You' : m.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Split Type</label>
                        <div className="flex gap-2">
                            {(['EQUAL', 'EXACT', 'PERCENTAGE'] as const).map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setSplitType(type)}
                                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition ${splitType === type ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Split among</label>
                        <div className="space-y-3">
                            {members.map(m => (
                                <div key={m.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedMembers.includes(m.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) setSelectedMembers([...selectedMembers, m.id]);
                                                else setSelectedMembers(selectedMembers.filter(id => id !== m.id));
                                            }}
                                            className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                                        />
                                        <span className="text-sm text-gray-700">{m.name}</span>
                                    </div>
                                    {selectedMembers.includes(m.id) && splitType !== 'EQUAL' && (
                                        <div className="flex items-center gap-1">
                                            {splitType === 'EXACT' ? (
                                                <>
                                                    <span className="text-gray-400 text-xs">₹</span>
                                                    <input
                                                        type="number"
                                                        className="w-20 p-1 border rounded text-right text-sm"
                                                        value={exactAmounts[m.id] || ''}
                                                        onChange={(e) => setExactAmounts({ ...exactAmounts, [m.id]: e.target.value })}
                                                        required
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <input
                                                        type="number"
                                                        className="w-16 p-1 border rounded text-right text-sm"
                                                        value={percentages[m.id] || ''}
                                                        onChange={(e) => setPercentages({ ...percentages, [m.id]: e.target.value })}
                                                        required
                                                    />
                                                    <span className="text-gray-400 text-xs">%</span>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || selectedMembers.length === 0}
                        className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : <><Save size={20} /> Save Expense</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddExpenseModal;
