import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    getMentorBookings,
    addSlot,
    getMentorCollegeSessions,
    confirmCollegeSession,
    completeCollegeSession
} from '../services/api';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../utils/auth';

function MentorDashboard() {
    const [bookings, setBookings] = useState([]);
    const [collegeSessions, setCollegeSessions] = useState([]);
    const [slot, setSlot] = useState({
        date: '', startTime: '', endTime: ''
    });
    const [adding, setAdding] = useState(false);
    const [activeTab, setActiveTab] = useState('bookings');
    const navigate = useNavigate();
    const mentor = useMemo(() => getCurrentUser(), []);

    // ✅ Sab ek saath useEffect me
    const loadData = useCallback(async () => {
        if (!mentor) {
            navigate('/login');
            return;
        }
        try {
            // Individual bookings
            getMentorBookings(mentor.id)
                .then(res => setBookings(res.data || []))
                .catch(() => setBookings([]));

            // College sessions
            getMentorCollegeSessions(mentor.id)
                .then(res => setCollegeSessions(res.data || []))
                .catch(() => setCollegeSessions([]));
        } catch (err) {
            console.error(err);
        }
    }, [mentor, navigate]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleAddSlot = async () => {
        if (!slot.date || !slot.startTime || !slot.endTime) {
            alert('Sab fields bharo!');
            return;
        }
        setAdding(true);
        try {
            await addSlot(mentor.id, slot);
            alert('Slot added! ✅');
            setSlot({ date: '', startTime: '', endTime: '' });
        } catch (err) {
            console.error('Error:', err.response?.data);
            alert('Slot add failed: ' + err.response?.status);
        }
        setAdding(false);
    };

    const handleConfirmSession = async (sessionId) => {
        try {
            await confirmCollegeSession(sessionId);
            alert('Session confirmed! ✅');
            loadData();
        } catch (err) {
            alert('Failed!');
        }
    };

    const handleCompleteSession = async (sessionId) => {
        try {
            await completeCollegeSession(sessionId);
            alert('Session marked complete! ✅');
            loadData();
        } catch (err) {
            alert('Failed!');
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white">

            {/* Navbar */}
            <nav className="flex justify-between items-center px-10 py-5 border-b border-slate-800">
                <div onClick={() => navigate('/')}
                    className="text-2xl font-bold text-indigo-400 cursor-pointer">
                    Dev<span className="text-white">Mentor</span>
                </div>
                <div className="flex gap-4 items-center">
                    <button
                        onClick={() => navigate('/edit-profile')}
                        className="text-slate-300 hover:text-white transition">
                        ✏️ Edit Profile
                    </button>
                    <button
                        onClick={logout}
                        className="text-slate-400 hover:text-white transition">
                        Logout
                    </button>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-12">

                {/* Welcome */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-1">
                        Mentor Dashboard 🧑‍💻
                    </h1>
                    <p className="text-slate-400">
                        Welcome back, {mentor?.name} 👋
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-10">
                    {[
                        {
                            label: 'Individual Sessions',
                            value: bookings.length,
                            icon: '📅',
                            color: 'text-indigo-400'
                        },
                        {
                            label: 'Confirmed',
                            value: bookings.filter(
                                b => b.status === 'CONFIRMED'
                            ).length,
                            icon: '✅',
                            color: 'text-green-400'
                        },
                        {
                            label: 'College Sessions',
                            value: collegeSessions.length,
                            icon: '🏫',
                            color: 'text-yellow-400'
                        },
                        {
                            label: 'Earnings (Demo)',
                            value: `₹${bookings.length * 500}`,
                            icon: '💰',
                            color: 'text-green-400'
                        },
                    ].map((stat, i) => (
                        <div key={i}
                            className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 text-center">
                            <div className="text-3xl mb-2">{stat.icon}</div>
                            <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                                {stat.value}
                            </div>
                            <div className="text-slate-400 text-sm">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Slot */}
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 mb-8">
                    <h2 className="text-xl font-semibold mb-4">
                        ➕ Add New Slot
                    </h2>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="text-slate-400 text-sm mb-2 block">
                                Date
                            </label>
                            <input
                                type="date"
                                value={slot.date}
                                onChange={e => setSlot({
                                    ...slot, date: e.target.value
                                })}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="text-slate-400 text-sm mb-2 block">
                                Start Time
                            </label>
                            <input
                                type="time"
                                value={slot.startTime}
                                onChange={e => setSlot({
                                    ...slot, startTime: e.target.value
                                })}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="text-slate-400 text-sm mb-2 block">
                                End Time
                            </label>
                            <input
                                type="time"
                                value={slot.endTime}
                                onChange={e => setSlot({
                                    ...slot, endTime: e.target.value
                                })}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleAddSlot}
                        disabled={adding}
                        className="px-6 py-3 bg-indigo-600 rounded-xl hover:bg-indigo-700 transition font-semibold disabled:opacity-50">
                        {adding ? 'Adding...' : 'Add Slot ➕'}
                    </button>
                </div>

                {/* Tab Buttons */}
                <div className="flex gap-3 mb-6">
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`px-5 py-3 rounded-xl text-sm font-medium transition ${
                            activeTab === 'bookings'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}>
                        👤 Individual Bookings ({bookings.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('college')}
                        className={`px-5 py-3 rounded-xl text-sm font-medium transition ${
                            activeTab === 'college'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}>
                        🏫 College Sessions ({collegeSessions.length})
                    </button>
                </div>

                {/* ─── Individual Bookings ─── */}
                {activeTab === 'bookings' && (
                    <div className="space-y-4">
                        {bookings.length === 0 ? (
                            <div className="bg-slate-800/50 rounded-2xl p-12 border border-slate-700 text-center">
                                <div className="text-5xl mb-4">📭</div>
                                <p className="text-slate-400">
                                    No individual bookings yet
                                </p>
                            </div>
                        ) : (
                            bookings.map(b => (
                                <div key={b.id}
                                    className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-lg">
                                                👤 {b.user?.name}
                                            </h3>
                                            <p className="text-slate-400 text-sm mt-1">
                                                📅 {b.slot?.date} | ⏰ {b.slot?.startTime} - {b.slot?.endTime}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            b.status === 'CONFIRMED'
                                                ? 'bg-green-500/20 text-green-400'
                                                : b.status === 'CANCELLED'
                                                ? 'bg-red-500/20 text-red-400'
                                                : 'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                            {b.status}
                                        </span>
                                    </div>

                                    {b.status === 'CONFIRMED' && b.roomId && (
                                        <button
                                            onClick={() => navigate(`/call/${b.roomId}`)}
                                            className="mt-4 w-full py-3 bg-green-600 rounded-xl hover:bg-green-700 transition font-semibold">
                                            🎥 Start Session
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* ─── College Sessions ─── */}
                {activeTab === 'college' && (
                    <div className="space-y-4">
                        {collegeSessions.length === 0 ? (
                            <div className="bg-slate-800/50 rounded-2xl p-12 border border-slate-700 text-center">
                                <div className="text-5xl mb-4">🏫</div>
                                <p className="text-slate-400">
                                    No college sessions yet
                                </p>
                                <p className="text-slate-500 text-sm mt-2">
                                    Jab koi college session book karega
                                    — yahan dikhega
                                </p>
                            </div>
                        ) : (
                            collegeSessions.map(s => (
                                <div key={s.id}
                                    className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">

                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg">
                                                🏫 {s.college?.name}
                                            </h3>
                                            <p className="text-indigo-400 font-medium mt-1">
                                                📚 {s.topic}
                                            </p>
                                            <p className="text-slate-400 text-sm mt-1">
                                                📅 {s.scheduledDate} | ⏰ {s.scheduledTime}
                                            </p>
                                            <p className="text-slate-400 text-sm">
                                                👥 Max {s.maxStudents} students | 📺 {s.sessionType}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                                            s.status === 'CONFIRMED'
                                                ? 'bg-green-500/20 text-green-400'
                                                : s.status === 'COMPLETED'
                                                ? 'bg-blue-500/20 text-blue-400'
                                                : 'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                            {s.status}
                                        </span>
                                    </div>

                                    {/* Questions from college */}
                                    {s.questions ? (
                                        <div className="bg-slate-900 rounded-xl p-4 mb-4 border border-indigo-500/30">
                                            <p className="text-indigo-400 text-sm font-medium mb-2">
                                                ❓ Questions from College:
                                            </p>
                                            <p className="text-slate-300 text-sm whitespace-pre-line">
                                                {s.questions}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="bg-slate-900/50 rounded-xl p-3 mb-4 border border-slate-700">
                                            <p className="text-slate-500 text-sm">
                                                ❓ College ne abhi questions upload nahi kiye
                                            </p>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        {s.status === 'PENDING' && (
                                            <button
                                                onClick={() => handleConfirmSession(s.id)}
                                                className="flex-1 py-3 bg-green-600 rounded-xl hover:bg-green-700 transition font-semibold text-sm">
                                                ✅ Confirm Session
                                            </button>
                                        )}

                                        {s.status === 'CONFIRMED' && s.roomId && (
                                            <>
                                                <button
                                                    onClick={() => navigate(`/call/${s.roomId}`)}
                                                    className="flex-1 py-3 bg-green-600 rounded-xl hover:bg-green-700 transition font-semibold text-sm">
                                                    🎥 Start Live Session
                                                </button>
                                                <button
                                                    onClick={() => handleCompleteSession(s.id)}
                                                    className="px-5 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition font-semibold text-sm">
                                                    ✔ Complete
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MentorDashboard;
