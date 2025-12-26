import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import api from '../api/client';
import type { User } from '../types';

interface SettleUpModalProps {
    groupId: string;
    members: User[];
    currentUserId: string;
    onClose: () => void;
    onSuccess: () => void;
}

const SettleUpModal: React.FC<SettleUpModalProps> = ({ groupId, members, currentUserId, onClose, onSuccess }) => {
    const [fromUser, setFromUser] = useState(currentUserId);
    const [toUser, setToUser] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!toUser) {
            setError('Please select who is being paid');
            return;
        }
        if (fromUser === toUser) {
            setError('Cannot settle with yourself');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await api.post('/settlements', {
                groupId,
                fromUser,
                toUser,
                amount: parseFloat(amount)
            });
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to record settlement');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Settle up</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

                    <div className="space-y-6 mb-8">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Who paid?</label>
                            <select
                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-gray-50"
                                value={fromUser}
                                onChange={(e) => setFromUser(e.target.value)}
                            >
                                {members.map(m => (
                                    <option key={m.id} value={m.id}>{m.id === currentUserId ? 'You' : m.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Who was paid?</label>
                            <select
                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-gray-50"
                                value={toUser}
                                onChange={(e) => setToUser(e.target.value)}
                                required
                            >
                                <option value="">Select a member</option>
                                {members.map(m => (
                                    <option key={m.id} value={m.id}>{m.id === currentUserId ? 'You' : m.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="w-full pl-8 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-gray-50 text-lg font-bold"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-teal-600 text-white font-bold py-4 rounded-xl hover:bg-teal-700 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-teal-100"
                    >
                        {loading ? 'Recording...' : <><CheckCircle size={20} /> Save Settlement</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SettleUpModal;
