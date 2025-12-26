import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Save, UserPlus, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { User } from '../types';

const CreateGroup: React.FC = () => {
    const [name, setName] = useState('');
    const [friends, setFriends] = useState<User[]>([]);
    const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchingFriends, setFetchingFriends] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFriends = async () => {
            if (!user) return;
            try {
                const res = await api.get(`/users/${user.id}/friends`);
                setFriends(res.data);
            } catch (err) {
                console.error('Failed to fetch friends', err);
            } finally {
                setFetchingFriends(false);
            }
        };
        fetchFriends();
    }, [user]);

    const toggleFriend = (friendId: string) => {
        setSelectedFriends(prev =>
            prev.includes(friendId)
                ? prev.filter(id => id !== friendId)
                : [...prev, friendId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        try {
            const response = await api.post('/groups', {
                name,
                initialMembers: selectedFriends,
                createdBy: user.id
            });
            navigate(`/groups/${response.data.id}`);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create group');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-teal-600 mb-6 transition">
                <ArrowLeft size={20} /> Back to Dashboard
            </Link>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Group</h1>

                <form onSubmit={handleSubmit}>
                    {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

                    <div className="mb-6">
                        <label className="block text-gray-700 font-bold mb-2">Group Name</label>
                        <input
                            type="text"
                            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="e.g. Goa Trip, Apartment Expenses"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-8">
                        <label className="block text-gray-700 font-bold mb-4">Add Friends Directly</label>
                        {fetchingFriends ? (
                            <p className="text-gray-400 text-sm">Loading friends...</p>
                        ) : friends.length === 0 ? (
                            <div className="bg-gray-50 p-4 rounded-xl text-center">
                                <p className="text-gray-500 text-sm">No friends found yet.</p>
                                <p className="text-gray-400 text-xs mt-1">You can still invite people later using the group link.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
                                {friends.map(friend => (
                                    <button
                                        key={friend.id}
                                        type="button"
                                        onClick={() => toggleFriend(friend.id)}
                                        className={`flex items-center justify-between p-3 rounded-xl border transition ${selectedFriends.includes(friend.id)
                                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                                            : 'border-gray-100 bg-white text-gray-600 hover:border-teal-200'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${selectedFriends.includes(friend.id) ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {friend.name.charAt(0)}
                                            </div>
                                            <span className="font-medium text-sm truncate max-w-[120px]">{friend.name}</span>
                                        </div>
                                        {selectedFriends.includes(friend.id) ? (
                                            <Check size={16} className="text-teal-600" />
                                        ) : (
                                            <UserPlus size={16} className="text-gray-300" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                        <p className="text-gray-400 text-xs mt-4">
                            People you add will be joined to the group immediately. Others can join later using the invite link.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-teal-600 text-white font-bold py-4 px-4 rounded-xl hover:bg-teal-700 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-teal-100"
                    >
                        {loading ? 'Creating...' : <><Save size={20} /> Create Group</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateGroup;
