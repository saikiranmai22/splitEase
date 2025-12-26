import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import type { Group, User } from '../types';

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [groups, setGroups] = useState<Group[]>([]);
    const [friends, setFriends] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'groups' | 'friends'>('groups');

    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const [groupsResponse, friendsResponse] = await Promise.all([
                    api.get(`/groups/user/${user.id}`),
                    api.get(`/users/${user.id}/friends`)
                ]);
                setGroups(groupsResponse.data);
                setFriends(friendsResponse.data);
            } catch (err: any) {
                console.error('Error fetching data:', err);
                const backendError = err.response?.data?.error || err.message;
                if (backendError?.includes('User not found')) {
                    setError('Your session has expired or your user account was not found. Please try logging out and logging back in.');
                } else {
                    setError(`Failed to load data: ${backendError}`);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
                <p className="text-gray-500 font-medium">Loading your dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6 text-center">
                <div className="bg-red-50 text-red-600 p-8 rounded-2xl border border-red-100">
                    <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
                    <p className="mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex border-b border-gray-200 mb-8">
                <button
                    onClick={() => setActiveTab('groups')}
                    className={`px-6 py-3 font-bold text-sm transition-colors relative ${activeTab === 'groups' ? 'text-teal-600' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Groups
                    {activeTab === 'groups' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />}
                </button>
                <button
                    onClick={() => setActiveTab('friends')}
                    className={`px-6 py-3 font-bold text-sm transition-colors relative ${activeTab === 'friends' ? 'text-teal-600' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Friends
                    {activeTab === 'friends' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />}
                </button>
            </div>

            {activeTab === 'groups' ? (
                <>
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">My Groups</h1>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    const input = prompt('Enter group invite token or paste the full link:');
                                    if (input) {
                                        let token = input;
                                        if (input.includes('/join/')) {
                                            token = input.split('/join/').pop() || input;
                                        }
                                        window.location.href = `/join/${token}`;
                                    }
                                }}
                                className="bg-white text-teal-600 border border-teal-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-50 transition font-medium"
                            >
                                Join Group
                            </button>
                            <Link
                                to="/groups/new"
                                className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700 transition font-medium"
                            >
                                <Plus size={20} /> Create Group
                            </Link>
                        </div>
                    </div>

                    {groups.length === 0 ? (
                        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
                            <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Users size={40} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">No groups yet</h2>
                            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                                Create a group or join one using an invite link to start splitting expenses with friends.
                            </p>
                            <Link
                                to="/groups/new"
                                className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-teal-700 transition shadow-lg shadow-teal-100"
                            >
                                <Plus size={20} /> Create your first group
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {groups.map((group) => (
                                <Link
                                    key={group.id}
                                    to={`/groups/${group.id}`}
                                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-teal-500 hover:shadow-md transition group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition">
                                                <Users size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800 text-lg">{group.name}</h3>
                                                <p className="text-sm text-gray-400">View details & expenses</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">My Friends</h1>
                    </div>

                    {friends.length === 0 ? (
                        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
                            <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Users size={40} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">No friends yet</h2>
                            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                                Friends will appear here once you share a group with them.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {friends.map((friend) => (
                                <div
                                    key={friend.id}
                                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4"
                                >
                                    <div className="w-12 h-12 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold text-lg">
                                        {friend.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">{friend.name}</h3>
                                        <p className="text-xs text-gray-400">{friend.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Dashboard;
