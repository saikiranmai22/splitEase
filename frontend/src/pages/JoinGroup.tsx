import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const JoinGroup: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [joining, setJoining] = useState(false);

    useEffect(() => {
        const join = async () => {
            if (loading) return; // Wait for auth to load

            if (!user) {
                console.log('User not logged in, saving token and redirecting to login');
                localStorage.setItem('joinToken', token || '');
                navigate('/login');
                return;
            }

            if (joining) return;
            setJoining(true);

            try {
                console.log('Attempting to join group with token:', token);
                await api.post('/groups/join', {
                    inviteToken: token,
                    userId: user.id
                });
                console.log('Successfully joined group');
                navigate('/');
            } catch (err: any) {
                console.error('Failed to join group:', err);
                setError(err.response?.data?.error || 'Failed to join group. The link might be invalid or expired.');
            } finally {
                setJoining(false);
            }
        };
        join();
    }, [token, user, loading, navigate]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
                <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Oops!</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Joining group...</p>
            </div>
        </div>
    );
};

export default JoinGroup;
