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

    // Load all data in useEffect
    const loadData = useCallback(async () => {
        if (!mentor || mentor.role !== 'MENTOR') {
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
        if (!mentor || mentor.role !== 'MENTOR') {
            alert('Please login as a Mentor first!');
            navigate('/login');
            return;
        }
        if (!slot.date || !slot.startTime || !slot.endTime) {
            alert('Please fill in all fields!');
            return;
        }
        setAdding(true);
        try {
            await addSlot(mentor.id, slot);
            alert('Slot added! ✅');
            setSlot({ date: '', startTime: '', endTime: '' });
            loadData();
        } catch (err) {
            console.error('Error:', err.response?.data);
            if (err.response?.status === 404) {
                alert('Mentor not found in database. Please log out and log back in as Mentor.');
            } else {
                alert('Slot add failed: ' + (err.response?.data || err.response?.status));
            }
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
            alert('Session completed! 🎓');
            loadData();
        } catch (err) {
            alert('Failed!');
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white">
            <div className="max-w-4xl mx-auto px-6 py-10">

                {/* Welcome */}
                <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-1">
                            Mentor Dashboard 🧑‍💻
                        </h1>
                        <p className="text-slate-400">
                            Welcome back, {mentor?.name} 👋
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/edit-profile')}
                            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:text-white transition text-sm">
                            ✏️ Edit Profile
                        </button>
                        <button
                            onClick={logout}
                            className="px-4 py-2 bg-red-600/20 border border-red-500/30 text-red-400 hover:text-red-300 rounded-xl transition text-sm">
                            Logout
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
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
                            color: 'text-purple-400'
                        },
                        {
                            label: 'Completed',
                            value: [
                                ...bookings.filter(b => b.status === 'COMPLETED'),
                                ...collegeSessions.filter(s => s.status === 'COMPLETED')
                            ].length,
                            icon: '🎓',
                            color: 'text-yellow-400'
                        },
                    ].map((stat, i) => (
                        <div key={i}
                            className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700 text-center">
                            <div className="text-2xl mb-2">{stat.icon}</div>
                            <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                                {stat.value}
                            </div>
                            <div className="text-slate-400 text-xs">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-3 mb-6 border-b border-slate-800 pb-4">
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`px-5 py-2.5 rounded-xl font-medium text-sm transition ${
                            activeTab === 'bookings'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}>
                        📅 Individual Sessions ({bookings.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('colleges')}
                        className={`px-5 py-2.5 rounded-xl font-medium text-sm transition ${
                            activeTab === 'colleges'
                                ? 'bg-purple-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}>
                        🏫 College Sessions ({collegeSessions.length})
                    </button>
                </div>

                {/* Individual Sessions Tab */}
                {activeTab === 'bookings' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Add Slot */}
                        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                            <h2 className="text-lg font-semibold mb-4">
                                Add Available Slot ⏰
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-slate-400 text-xs mb-1 block">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={slot.date}
                                        onChange={e => setSlot({ ...slot, date: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-slate-400 text-xs mb-1 block">
                                            Start Time
                                        </label>
                                        <input
                                            type="time"
                                            value={slot.startTime}
                                            onChange={e => setSlot({ ...slot, startTime: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-slate-400 text-xs mb-1 block">
                                            End Time
                                        </label>
                                        <input
                                            type="time"
                                            value={slot.endTime}
                                            onChange={e => setSlot({ ...slot, endTime: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleAddSlot}
                                    disabled={adding}
                                    className="w-full py-3 bg-indigo-600 rounded-xl hover:bg-indigo-700 transition font-semibold text-sm disabled:opacity-50">
                                    {adding ? 'Adding...' : '+ Add Slot'}
                                </button>
                            </div>
                        </div>

                        {/* Bookings List */}
                        <div>
                            <h2 className="text-lg font-semibold mb-4">
                                Booked Sessions 📋
                            </h2>
                            {bookings.length === 0 ? (
                                <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 text-center text-slate-400 text-sm">
                                    No bookings yet
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {bookings.map(b => (
                                        <div key={b.id}
                                            className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="font-semibold text-sm">
                                                        {b.user?.name || 'User'}
                                                    </p>
                                                    <p className="text-slate-400 text-xs">
                                                        {b.user?.email}
                                                    </p>
                                                </div>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                    b.status === 'CONFIRMED'
                                                        ? 'bg-green-500/20 text-green-400'
                                                        : 'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                    {b.status}
                                                </span>
                                            </div>
                                            {b.slot && (
                                                <p className="text-slate-400 text-xs mb-3">
                                                    📅 {b.slot.date} | ⏰ {b.slot.startTime} - {b.slot.endTime}
                                                </p>
                                            )}
                                            {b.status === 'CONFIRMED' && b.roomId && (
                                                <button
                                                    onClick={() => navigate(`/call/${b.roomId}`)}
                                                    className="w-full py-2 bg-green-600 rounded-xl hover:bg-green-700 transition font-semibold text-xs flex items-center justify-center gap-1">
                                                    🎥 Join Video Call
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* College Sessions Tab */}
                {activeTab === 'colleges' && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">
                            College Sessions 🏫
                        </h2>
                        {collegeSessions.length === 0 ? (
                            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 text-center text-slate-400 text-sm">
                                No college sessions requested yet
                            </div>
                        ) : (
                            collegeSessions.map(s => (
                                <div key={s.id}
                                    className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-base mb-1">
                                                {s.topic}
                                            </h3>
                                            <p className="text-purple-400 text-sm">
                                                🏫 {s.college?.name}
                                                {s.college?.city ? `, ${s.college.city}` : ''}
                                            </p>
                                            <p className="text-slate-400 text-xs mt-1">
                                                📅 {s.scheduledDate} at {s.scheduledTime}
                                                | 👥 {s.maxStudents} Students
                                                | 📹 {s.sessionType}
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

                                    {/* Questions */}
                                    {s.questions ? (
                                        <div className="bg-slate-900/50 rounded-xl p-3 mb-4 border border-slate-700">
                                            <p className="text-xs text-slate-400 font-semibold mb-1">
                                                ❓ Questions submitted by students:
                                            </p>
                                            <p className="text-slate-300 text-sm whitespace-pre-line">
                                                {s.questions}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="bg-slate-900/50 rounded-xl p-3 mb-4 border border-slate-700">
                                            <p className="text-slate-500 text-sm">
                                                ❓ College has not uploaded questions yet
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
