import React from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn, getCurrentUser } from '../utils/auth';

function Home() {
    const navigate = useNavigate();
    const loggedIn = isLoggedIn();
    const user = getCurrentUser();

    const getDashboard = () => {
        if (!user) return '/login';
        if (user.role === 'MENTOR') return '/mentor-dashboard';
        if (user.role === 'COLLEGE') return '/college-dashboard';
        return '/user-dashboard';
    };

    return (
        <div className="text-white">

            {/* Hero */}
            <div className="flex flex-col items-center justify-center text-center px-6 py-28 max-w-6xl mx-auto">
                <span className="bg-indigo-500/20 text-indigo-400 px-4 py-1 rounded-full text-sm mb-6 border border-indigo-500/30">
                    🚀 India's #1 Developer Mentorship Platform
                </span>
                <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                    Learn from{' '}
                    <span className="text-indigo-400">Expert</span>
                    <br />Developers
                </h1>
                <p className="text-slate-400 text-xl max-w-2xl mb-10 leading-relaxed">
                    Book 1-on-1 sessions with experienced developers.
                    Get guidance on Java, React, DSA, System Design & more.
                </p>
                <div className="flex gap-4 flex-wrap justify-center">
                    <button
                        onClick={() => navigate('/mentors')}
                        className="px-8 py-4 bg-indigo-600 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition">
                        Find a Mentor →
                    </button>
                    {loggedIn ? (
                        <button
                            onClick={() => navigate(getDashboard())}
                            className="px-8 py-4 border border-slate-600 rounded-xl text-lg font-semibold hover:border-indigo-500 transition">
                            Go to Dashboard
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/register')}
                            className="px-8 py-4 border border-slate-600 rounded-xl text-lg font-semibold hover:border-indigo-500 transition">
                            Become a Mentor
                        </button>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto mb-24 px-6">
                {[
                    { number: '500+', label: 'Expert Mentors' },
                    { number: '10K+', label: 'Sessions Completed' },
                    { number: '4.9★', label: 'Average Rating' },
                ].map((stat, i) => (
                    <div key={i}
                        className="bg-slate-800/50 rounded-2xl p-6 text-center border border-slate-700">
                        <div className="text-3xl font-bold text-indigo-400 mb-2">
                            {stat.number}
                        </div>
                        <div className="text-slate-400">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* How it works */}
            <div className="max-w-5xl mx-auto px-6 mb-24">
                <h2 className="text-3xl font-bold text-center mb-4">
                    How it Works
                </h2>
                <p className="text-slate-400 text-center mb-12">
                    3 simple steps to start learning
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            step: '01',
                            title: 'Find a Mentor',
                            desc: 'Browse expert developers by skill, price & rating',
                            icon: '🔍'
                        },
                        {
                            step: '02',
                            title: 'Book & Pay',
                            desc: 'Pick a time slot and pay securely via Razorpay',
                            icon: '💳'
                        },
                        {
                            step: '03',
                            title: 'Start Learning',
                            desc: 'Join 1-on-1 video call and get personalized guidance',
                            icon: '🎥'
                        },
                    ].map((item, i) => (
                        <div key={i}
                            className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 text-center">
                            <div className="text-4xl mb-4">{item.icon}</div>
                            <div className="text-indigo-400 text-4xl font-bold mb-3">
                                {item.step}
                            </div>
                            <h3 className="text-xl font-semibold mb-3">
                                {item.title}
                            </h3>
                            <p className="text-slate-400">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* For Colleges */}
            <div className="max-w-5xl mx-auto px-6 mb-24">
                <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-2xl p-10 border border-indigo-500/30 text-center">
                    <div className="text-4xl mb-4">🏫</div>
                    <h2 className="text-3xl font-bold mb-4">
                        Are you a College or Institute?
                    </h2>
                    <p className="text-slate-400 mb-6 max-w-xl mx-auto">
                        Get bulk mentorship sessions for your students.
                        Live seminars, Q&A sessions, placement preparation
                        — all in one platform.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => navigate('/register')}
                            className="px-6 py-3 bg-indigo-600 rounded-xl hover:bg-indigo-700 transition font-semibold">
                            Register College
                        </button>
                        <button
                            onClick={() => navigate('/contact')}
                            className="px-6 py-3 border border-slate-600 rounded-xl hover:border-indigo-500 transition">
                            Contact Us
                        </button>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="text-center px-6 pb-24">
                <h2 className="text-3xl font-bold mb-4">
                    Ready to accelerate your career?
                </h2>
                <p className="text-slate-400 mb-8">
                    Join thousands of developers learning with expert mentors
                </p>
                <button
                    onClick={() => navigate(loggedIn ? '/mentors' : '/register')}
                    className="px-10 py-4 bg-indigo-600 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition">
                    {loggedIn ? 'Find a Mentor Now' : 'Get Started Free'}
                </button>
            </div>
        </div>
    );
}

export default Home;