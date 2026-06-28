import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser, logout, isLoggedIn } from '../utils/auth';

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = getCurrentUser();
    const loggedIn = isLoggedIn();

    const getDashboardLink = () => {
        if (!user) return '/login';
        if (user.role === 'MENTOR') return '/mentor-dashboard';
        if (user.role === 'COLLEGE') return '/college-dashboard';
        if (user.role === 'ADMIN') return '/admin';
        return '/user-dashboard';
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 bg-[#080B1A]/95 backdrop-blur-md border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                {/* Logo */}
                <div
                    onClick={() => navigate('/')}
                    className="text-2xl font-bold text-indigo-400 cursor-pointer flex items-center gap-2">
                    Dev<span className="text-white">Mentor</span>
                    <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full font-normal">
                        Beta
                    </span>
                </div>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    <span
                        onClick={() => navigate('/mentors')}
                        className={`cursor-pointer text-sm transition ${
                            isActive('/mentors')
                                ? 'text-indigo-400'
                                : 'text-slate-400 hover:text-white'
                        }`}>
                        Find Mentors
                    </span>
                    <span
                        onClick={() => navigate('/about')}
                        className={`cursor-pointer text-sm transition ${
                            isActive('/about')
                                ? 'text-indigo-400'
                                : 'text-slate-400 hover:text-white'
                        }`}>
                        About Us
                    </span>
                    <span
                        onClick={() => navigate('/contact')}
                        className={`cursor-pointer text-sm transition ${
                            isActive('/contact')
                                ? 'text-indigo-400'
                                : 'text-slate-400 hover:text-white'
                        }`}>
                        Contact
                    </span>
                    <span
                        onClick={() => navigate('/college-dashboard')}
                        className={`cursor-pointer text-sm transition ${
                            isActive('/college-dashboard')
                                ? 'text-indigo-400'
                                : 'text-slate-400 hover:text-white'
                        }`}>
                        For Colleges 🏫
                    </span>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-3">
                    {loggedIn ? (
                        <>
                            {/* User Info */}
                            <div className="hidden md:flex items-center gap-3">
                                <div className="text-right">
                                    <p className="text-white text-sm font-medium">
                                        {user?.name}
                                    </p>
                                    <p className="text-slate-500 text-xs">
                                        {user?.role}
                                    </p>
                                </div>
                                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-sm font-bold">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                            </div>

                            <button
                                onClick={() => navigate(getDashboardLink())}
                                className="px-4 py-2 bg-indigo-600 rounded-xl text-sm font-medium hover:bg-indigo-700 transition text-white">
                                Dashboard
                            </button>

                            <button
                                onClick={logout}
                                className="px-4 py-2 border border-slate-700 rounded-xl text-sm text-slate-400 hover:text-white hover:border-slate-500 transition">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate('/login')}
                                className="px-4 py-2 border border-slate-700 rounded-xl text-sm text-slate-300 hover:text-white hover:border-indigo-500 transition">
                                Login
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="px-4 py-2 bg-indigo-600 rounded-xl text-sm font-medium hover:bg-indigo-700 transition text-white">
                                Get Started
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
