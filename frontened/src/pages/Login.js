import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, loginMentor, loginCollege } from '../services/api';
import { saveAuth } from '../utils/auth';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('USER');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please enter both email and password!');
            return;
        }
        setLoading(true);
        setError('');

        const cleanEmail = email.trim().toLowerCase();

        try {
            let res;
            let loggedInRole = role;

            try {
                if (role === 'MENTOR') {
                    res = await loginMentor({ email: cleanEmail, password });
                } else if (role === 'COLLEGE') {
                    res = await loginCollege({ email: cleanEmail, password });
                } else {
                    res = await loginUser({ email: cleanEmail, password });
                }
            } catch (initialErr) {
                // If 401 Unauthorized, automatically try other roles in case the user registered with a different role
                if (initialErr.response?.status === 401) {
                    if (role === 'USER') {
                        try {
                            res = await loginMentor({ email: cleanEmail, password });
                            loggedInRole = 'MENTOR';
                        } catch (mErr) {
                            try {
                                res = await loginCollege({ email: cleanEmail, password });
                                loggedInRole = 'COLLEGE';
                            } catch (cErr) {
                                throw initialErr;
                            }
                        }
                    } else if (role === 'MENTOR') {
                        try {
                            res = await loginUser({ email: cleanEmail, password });
                            loggedInRole = 'USER';
                        } catch (uErr) {
                            throw initialErr;
                        }
                    } else {
                        throw initialErr;
                    }
                } else {
                    throw initialErr;
                }
            }

            if (res?.data && res.data.token) {
                saveAuth(res.data);
                const finalRole = res.data.role || loggedInRole;
                if (finalRole === 'MENTOR') {
                    navigate('/mentor-dashboard');
                } else if (finalRole === 'COLLEGE') {
                    navigate('/college-dashboard');
                } else if (finalRole === 'ADMIN') {
                    navigate('/admin');
                } else {
                    navigate('/user-dashboard');
                }
            }
        } catch (err) {
            console.error('Login error:', err.response?.data);
            const serverMsg = err.response?.data?.message || (typeof err.response?.data === 'string' ? err.response?.data : null);
            if (err.response?.status === 401) {
                setError('Invalid email or password. Please verify your credentials or select the correct role (Student / Mentor).');
            } else {
                setError('Login failed: ' + (serverMsg || err.message));
            }
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center py-12 px-4">
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 w-full max-w-md">

                <div className="text-center mb-8">
                    <div className="text-3xl font-bold text-indigo-400 mb-2">
                        Dev<span className="text-white">Mentor</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                        Welcome Back 👋
                    </h2>
                    <p className="text-slate-400 mt-1">Login to your account</p>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">
                        ❌ {error}
                    </div>
                )}

                {/* Role Select */}
                <div className="mb-4">
                    <label className="text-slate-400 text-sm mb-2 block">
                        Login as
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        <button
                            type="button"
                            onClick={() => setRole('USER')}
                            className={`py-3 rounded-xl font-medium transition ${
                                role === 'USER'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-900 text-slate-400 border border-slate-700'
                            }`}>
                            👤 Student
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('MENTOR')}
                            className={`py-3 rounded-xl font-medium transition ${
                                role === 'MENTOR'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-900 text-slate-400 border border-slate-700'
                            }`}>
                            🧑‍💻 Mentor
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('COLLEGE')}
                            className={`py-3 rounded-xl font-medium transition ${
                                role === 'COLLEGE'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-900 text-slate-400 border border-slate-700'
                            }`}>
                            🏫 College
                        </button>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="text-slate-400 text-sm mb-2 block">
                        Email
                    </label>
                    <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                </div>

                <div className="mb-6">
                    <label className="text-slate-400 text-sm mb-2 block">
                        Password
                    </label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                </div>

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full py-4 bg-indigo-600 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition disabled:opacity-50">
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                <p className="text-center text-slate-400 text-sm mt-6">
                    Don't have an account?{' '}
                    <span
                        onClick={() => navigate('/register')}
                        className="text-indigo-400 cursor-pointer hover:underline">
                        Register here
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Login;
