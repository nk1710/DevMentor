import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../utils/auth';
import {
    getCollegeById,
    getCollegeSessions,
    getAllMentors,
    bookCollegeSession,
    addCollegeSessionQuestions
} from '../services/api';

function CollegeDashboard() {
    const navigate = useNavigate();
    const user = useMemo(() => getCurrentUser(), []);

    const [college, setCollege] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [mentors, setMentors] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);

    const [bookForm, setBookForm] = useState({
        mentorId: '',
        topic: '',
        scheduledDate: '',
        scheduledTime: '',
        sessionType: 'LIVE',
        maxStudents: 50
    });

    const [questionsForm, setQuestionsForm] = useState({
        sessionId: '',
        questions: ''
    });

    const loadData = useCallback(async () => {
        if (!user || user.role !== 'COLLEGE') {
            navigate('/login');
            return;
        }
        setLoading(true);
        try {
            const [c, s, m] = await Promise.all([
                getCollegeById(user.id),
                getCollegeSessions(user.id),
                getAllMentors()
            ]);
            setCollege(c.data);
            setSessions(s.data);
            setMentors(m.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    }, [navigate, user]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleBookSession = async () => {
        if (!bookForm.mentorId || !bookForm.topic
            || !bookForm.scheduledDate) {
            alert('Sab fields bharo!');
            return;
        }
        try {
            await bookCollegeSession(
                user.id,
                bookForm.mentorId,
                {
                    topic: bookForm.topic,
                    scheduledDate: bookForm.scheduledDate,
                    scheduledTime: bookForm.scheduledTime,
                    sessionType: bookForm.sessionType,
                    maxStudents: parseInt(bookForm.maxStudents)
                }
            );
            alert('Session booked! ✅');
            loadData();
            setActiveTab('sessions');
        } catch (err) {
            alert('Booking failed!');
        }
    };

    const handleAddQuestions = async () => {
        if (!questionsForm.sessionId
            || !questionsForm.questions) {
            alert('Session select karo aur questions likho!');
            return;
        }
        try {
            await addCollegeSessionQuestions(
                questionsForm.sessionId,
                questionsForm.questions
            );
            alert('Questions added! ✅');
            loadData();
        } catch (err) {
            alert('Failed!');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
            <p className="text-white text-xl">Loading...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex">

            {/* Sidebar */}
            <div className="w-60 bg-slate-900 border-r border-slate-800 flex flex-col fixed h-full">
                <div className="p-6 border-b border-slate-800">
                    <div className="text-xl font-bold text-indigo-400">
                        Dev<span className="text-white">Mentor</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                        College Portal
                    </div>
                    <div className="text-xs text-green-400 mt-1 truncate">
                        {college?.name}
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {[
                        { id: 'overview', icon: '📊', label: 'Overview' },
                        { id: 'book', icon: '📅', label: 'Book Session' },
                        { id: 'sessions', icon: '🎥', label: `Sessions (${sessions.length})` },
                        { id: 'questions', icon: '❓', label: 'Upload Questions' },
                        { id: 'plans', icon: '💎', label: 'Plans' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition text-sm ${
                                activeTab === tab.id
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-slate-400 hover:bg-slate-800'
                            }`}>
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button onClick={logout}
                        className="w-full py-2 text-red-400 hover:text-red-300 text-sm text-left px-4">
                        🚪 Logout
                    </button>
                </div>
            </div>

            {/* Main */}
            <div className="ml-60 flex-1 p-8">

                {/* Overview */}
                {activeTab === 'overview' && (
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            Overview 📊
                        </h1>
                        <p className="text-slate-400 mb-8">
                            Welcome, {college?.name} 👋
                        </p>

                        <div className="grid grid-cols-4 gap-4 mb-8">
                            {[
                                { label: 'Plan', value: college?.plan || 'BASIC', icon: '💎', color: 'text-indigo-400' },
                                { label: 'Sessions', value: sessions.length, icon: '🎥', color: 'text-green-400' },
                                { label: 'Valid Until', value: college?.subscriptionExpiry || 'N/A', icon: '📅', color: 'text-yellow-400' },
                                { label: 'Status', value: college?.isActive ? 'Active' : 'Inactive', icon: '✅', color: 'text-green-400' },
                            ].map((stat, i) => (
                                <div key={i}
                                    className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700">
                                    <div className="text-2xl mb-2">{stat.icon}</div>
                                    <div className={`text-xl font-bold ${stat.color} mb-1`}>
                                        {stat.value}
                                    </div>
                                    <div className="text-slate-400 text-sm">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recent Sessions */}
                        <h2 className="text-xl font-semibold mb-4">
                            Recent Sessions
                        </h2>
                        {sessions.length === 0 ? (
                            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 text-center">
                                <p className="text-slate-400">
                                    No sessions yet
                                </p>
                                <button
                                    onClick={() => setActiveTab('book')}
                                    className="mt-4 px-6 py-2 bg-indigo-600 rounded-xl hover:bg-indigo-700 transition text-sm">
                                    Book First Session
                                </button>
                            </div>
                        ) : (
                            sessions.slice(0, 3).map(s => (
                                <div key={s.id}
                                    className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 mb-3 flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">
                                            {s.topic}
                                        </p>
                                        <p className="text-slate-400 text-sm">
                                            {s.scheduledDate} | {s.mentor?.name}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        s.status === 'CONFIRMED'
                                            ? 'bg-green-500/20 text-green-400'
                                            : s.status === 'COMPLETED'
                                            ? 'bg-blue-500/20 text-blue-400'
                                            : 'bg-yellow-500/20 text-yellow-400'
                                    }`}>
                                        {s.status}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Book Session */}
                {activeTab === 'book' && (
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            Book a Session 📅
                        </h1>
                        <p className="text-slate-400 mb-8">
                            Schedule a live session for your students
                        </p>

                        <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 max-w-2xl space-y-4">

                            <div>
                                <label className="text-slate-400 text-sm mb-2 block">
                                    Select Mentor
                                </label>
                                <select
                                    value={bookForm.mentorId}
                                    onChange={e => setBookForm({...bookForm, mentorId: e.target.value})}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500">
                                    <option value="">-- Select Mentor --</option>
                                    {mentors.map(m => (
                                        <option key={m.id} value={m.id}>
                                            {m.name} — {m.skills}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-slate-400 text-sm mb-2 block">
                                    Session Topic
                                </label>
                                <input
                                    placeholder="e.g. Java Spring Boot Basics"
                                    value={bookForm.topic}
                                    onChange={e => setBookForm({...bookForm, topic: e.target.value})}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-slate-400 text-sm mb-2 block">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={bookForm.scheduledDate}
                                        onChange={e => setBookForm({...bookForm, scheduledDate: e.target.value})}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-slate-400 text-sm mb-2 block">
                                        Time
                                    </label>
                                    <input
                                        type="time"
                                        value={bookForm.scheduledTime}
                                        onChange={e => setBookForm({...bookForm, scheduledTime: e.target.value})}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-slate-400 text-sm mb-2 block">
                                        Session Type
                                    </label>
                                    <select
                                        value={bookForm.sessionType}
                                        onChange={e => setBookForm({...bookForm, sessionType: e.target.value})}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500">
                                        <option value="LIVE">🔴 Live Seminar</option>
                                        <option value="RECORDED">📹 Pre-recorded Q&A</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-slate-400 text-sm mb-2 block">
                                        Max Students
                                    </label>
                                    <input
                                        type="number"
                                        value={bookForm.maxStudents}
                                        onChange={e => setBookForm({...bookForm, maxStudents: e.target.value})}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleBookSession}
                                className="w-full py-4 bg-indigo-600 rounded-xl font-semibold hover:bg-indigo-700 transition">
                                Book Session 📅
                            </button>
                        </div>
                    </div>
                )}

                {/* Sessions List */}
                {activeTab === 'sessions' && (
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            My Sessions 🎥
                        </h1>
                        <p className="text-slate-400 mb-8">
                            All booked sessions
                        </p>

                        {sessions.length === 0 ? (
                            <div className="bg-slate-800/50 rounded-2xl p-12 border border-slate-700 text-center">
                                <p className="text-slate-400 mb-4">
                                    No sessions booked yet
                                </p>
                                <button
                                    onClick={() => setActiveTab('book')}
                                    className="px-6 py-3 bg-indigo-600 rounded-xl hover:bg-indigo-700 transition">
                                    Book Session
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {sessions.map(s => (
                                    <div key={s.id}
                                        className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-bold text-lg">
                                                    {s.topic}
                                                </h3>
                                                <p className="text-slate-400 text-sm mt-1">
                                                    👨‍💻 {s.mentor?.name} — {s.mentor?.skills}
                                                </p>
                                                <p className="text-slate-400 text-sm">
                                                    📅 {s.scheduledDate} | ⏰ {s.scheduledTime}
                                                </p>
                                                <p className="text-slate-400 text-sm">
                                                    👥 Max {s.maxStudents} students | {s.sessionType}
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                s.status === 'CONFIRMED'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : s.status === 'COMPLETED'
                                                    ? 'bg-blue-500/20 text-blue-400'
                                                    : 'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                                {s.status}
                                            </span>
                                        </div>

                                        {s.questions && (
                                            <div className="bg-slate-900 rounded-xl p-4 mb-4">
                                                <p className="text-slate-400 text-sm font-medium mb-2">
                                                    ❓ Uploaded Questions:
                                                </p>
                                                <p className="text-slate-300 text-sm">
                                                    {s.questions}
                                                </p>
                                            </div>
                                        )}

                                        {s.status === 'CONFIRMED' && s.roomId && (
                                            <button
                                                onClick={() => navigate(`/call/${s.roomId}`)}
                                                className="w-full py-3 bg-green-600 rounded-xl hover:bg-green-700 transition font-semibold">
                                                🎥 Join Live Session
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Upload Questions */}
                {activeTab === 'questions' && (
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            Upload Questions ❓
                        </h1>
                        <p className="text-slate-400 mb-8">
                            Students ke questions mentor ko pehle bhejo
                        </p>

                        <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 max-w-2xl space-y-4">
                            <div>
                                <label className="text-slate-400 text-sm mb-2 block">
                                    Select Session
                                </label>
                                <select
                                    value={questionsForm.sessionId}
                                    onChange={e => setQuestionsForm({...questionsForm, sessionId: e.target.value})}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500">
                                    <option value="">-- Select Session --</option>
                                    {sessions.map(s => (
                                        <option key={s.id} value={s.id}>
                                            {s.topic} — {s.scheduledDate}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-slate-400 text-sm mb-2 block">
                                    Questions (ek line me ek question)
                                </label>
                                <textarea
                                    rows={8}
                                    placeholder={`1. What is Spring Boot?\n2. How does JWT work?\n3. Explain microservices...`}
                                    value={questionsForm.questions}
                                    onChange={e => setQuestionsForm({...questionsForm, questions: e.target.value})}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                                />
                            </div>

                            <button
                                onClick={handleAddQuestions}
                                className="w-full py-4 bg-indigo-600 rounded-xl font-semibold hover:bg-indigo-700 transition">
                                Upload Questions ❓
                            </button>
                        </div>
                    </div>
                )}

                {/* Plans */}
                {activeTab === 'plans' && (
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            Subscription Plans 💎
                        </h1>
                        <p className="text-slate-400 mb-8">
                            Current: <span className="text-indigo-400 font-bold">
                                {college?.plan || 'BASIC'}
                            </span>
                        </p>

                        <div className="grid grid-cols-3 gap-6">
                            {[
                                {
                                    name: 'BASIC',
                                    price: '₹9,999',
                                    period: '/month',
                                    color: 'border-slate-700',
                                    badge: null,
                                    features: [
                                        '2 Live Sessions/month',
                                        'Up to 50 students',
                                        'Session recordings',
                                        'Email support',
                                        'Question upload'
                                    ]
                                },
                                {
                                    name: 'PRO',
                                    price: '₹19,999',
                                    period: '/month',
                                    color: 'border-indigo-500',
                                    badge: 'Most Popular',
                                    features: [
                                        '4 Live Sessions/month',
                                        'Up to 200 students',
                                        'Q&A upload system',
                                        'Priority support',
                                        'Session recordings',
                                        'Mentor selection'
                                    ]
                                },
                                {
                                    name: 'ENTERPRISE',
                                    price: '₹39,999',
                                    period: '/month',
                                    color: 'border-yellow-500',
                                    badge: 'Best Value',
                                    features: [
                                        'Unlimited Sessions',
                                        'Unlimited students',
                                        'Dedicated mentor',
                                        '24/7 support',
                                        'Custom branding',
                                        'Analytics dashboard'
                                    ]
                                }
                            ].map((plan, i) => (
                                <div key={i}
                                    className={`bg-slate-800/50 rounded-2xl p-6 border-2 ${plan.color} relative`}>
                                    {plan.badge && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                                            {plan.badge}
                                        </div>
                                    )}
                                    <h3 className="text-lg font-bold mb-1">
                                        {plan.name}
                                    </h3>
                                    <div className="mb-4">
                                        <span className="text-3xl font-bold text-indigo-400">
                                            {plan.price}
                                        </span>
                                        <span className="text-slate-500 text-sm">
                                            {plan.period}
                                        </span>
                                    </div>
                                    {plan.features.map((f, j) => (
                                        <p key={j}
                                            className="text-slate-300 text-sm mb-2 flex gap-2">
                                            <span className="text-green-400">✅</span>
                                            {f}
                                        </p>
                                    ))}
                                    <button
                                        className="mt-4 w-full py-3 bg-indigo-600 rounded-xl hover:bg-indigo-700 transition font-semibold text-sm">
                                        Contact to Upgrade
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 bg-slate-800/50 rounded-2xl p-6 border border-slate-700 text-center">
                            <p className="text-slate-300 mb-2">
                                Upgrade ke liye contact karo:
                            </p>
                            <p className="text-indigo-400 font-semibold text-lg">
                                colleges@devmentor.in
                            </p>
                            <p className="text-slate-500 text-sm mt-1">
                                +91 6388992862
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CollegeDashboard;
