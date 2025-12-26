import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet } from 'lucide-react';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 text-teal-600">
                    <Wallet size={28} className="fill-teal-600" />
                    <span className="text-2xl font-black tracking-tight text-gray-800">
                        Split <span className="text-teal-600">Ease</span>
                    </span>
                </Link>

                {user && (
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold text-sm">
                                {user.name.charAt(0)}
                            </div>
                            <span className="hidden sm:block font-medium text-gray-700">{user.name}</span>
                        </div>
                        <button
                            onClick={logout}
                            className="text-sm font-medium text-gray-500 hover:text-red-600 transition"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
