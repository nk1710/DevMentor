import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    deleteCollege,
    deleteMentor,
    deleteUser,
    getAllBookings,
    getAllCollegeSessions,
    getAllColleges,
    getAllMentors,
    getAllUsers,
    updateBookingStatus,
    updateCollegeSessionStatus
} from '../services/api';
import { logout } from '../utils/auth';

const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users' },
    { id: 'mentors', label: 'Mentors' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'colleges', label: 'Colleges' },
    { id: 'sessions', label: 'College Sessions' }
];

function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [users, setUsers] = useState([]);
    const [mentors, setMentors] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [colleges, setColleges] = useState([]);
    const [sessions, setSessions] = useState([]);

    const loadData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const [userRes, mentorRes, bookingRes, collegeRes, sessionRes] =
                await Promise.all([
                    getAllUsers(),
                    getAllMentors(),
                    getAllBookings(),
                    getAllColleges(),
                    getAllCollegeSessions()
                ]);

            setUsers(userRes.data || []);
            setMentors(mentorRes.data || []);
            setBookings(bookingRes.data || []);
            setColleges(collegeRes.data || []);
            setSessions(sessionRes.data || []);
        } catch (err) {
            console.error(err);
            setError('Admin data load nahi ho paya. Token/role ya backend check karo.');
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const runAction = async (action, message = 'Action complete') => {
        try {
            await action();
            alert(message);
            loadData();
        } catch (err) {
            console.error(err);
            alert('Action failed');
        }
    };

    const stats = [
        { label: 'Users', value: users.length },
        { label: 'Mentors', value: mentors.length },
        { label: 'Bookings', value: bookings.length },
        { label: 'Colleges', value: colleges.length },
        { label: 'College Sessions', value: sessions.length }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
                <p className="text-white text-xl">Loading admin panel...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex">
            <aside className="w-64 bg-slate-900 border-r border-slate-800 fixed h-full flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <div
                        onClick={() => navigate('/')}
                        className="text-xl font-bold text-indigo-400 cursor-pointer">
                        Dev<span className="text-white">Mentor</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Admin Control</p>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full text-left px-4 py-3 rounded-xl text-sm transition ${
                                activeTab === tab.id
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}>
                            {tab.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 text-sm">
                        Logout
                    </button>
                </div>
            </aside>

            <main className="ml-64 flex-1 p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                        <p className="text-slate-400 mt-1">
                            Manage platform users, mentors, bookings and college sessions.
                        </p>
                    </div>
                    <button
                        onClick={loadData}
                        className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm hover:bg-slate-700">
                        Refresh
                    </button>
                </div>

                {error && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl p-4">
                        {error}
                    </div>
                )}

                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {stats.map(stat => (
                            <div
                                key={stat.label}
                                className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                                <div className="text-3xl font-bold text-indigo-400">
                                    {stat.value}
                                </div>
                                <div className="text-slate-400 text-sm mt-1">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'users' && (
                    <DataTable
                        emptyText="No users found"
                        rows={users}
                        columns={['Name', 'Email', 'Role', 'Actions']}
                        renderRow={user => (
                            <tr key={user.id} className="border-t border-slate-800">
                                <Td>{user.name}</Td>
                                <Td>{user.email}</Td>
                                <Td>{user.role}</Td>
                                <Td>
                                    <DangerButton
                                        onClick={() => runAction(
                                            () => deleteUser(user.id),
                                            'User deleted'
                                        )}>
                                        Delete
                                    </DangerButton>
                                </Td>
                            </tr>
                        )}
                    />
                )}

                {activeTab === 'mentors' && (
                    <DataTable
                        emptyText="No mentors found"
                        rows={mentors}
                        columns={['Name', 'Email', 'Skills', 'Actions']}
                        renderRow={mentor => (
                            <tr key={mentor.id} className="border-t border-slate-800">
                                <Td>{mentor.name}</Td>
                                <Td>{mentor.email}</Td>
                                <Td>{mentor.skills}</Td>
                                <Td>
                                    <DangerButton
                                        onClick={() => runAction(
                                            () => deleteMentor(mentor.id),
                                            'Mentor deleted'
                                        )}>
                                        Delete
                                    </DangerButton>
                                </Td>
                            </tr>
                        )}
                    />
                )}

                {activeTab === 'bookings' && (
                    <DataTable
                        emptyText="No bookings found"
                        rows={bookings}
                        columns={['User', 'Mentor', 'Slot', 'Status', 'Actions']}
                        renderRow={booking => (
                            <tr key={booking.id} className="border-t border-slate-800">
                                <Td>{booking.user?.name || 'User'}</Td>
                                <Td>{booking.mentor?.name || 'Mentor'}</Td>
                                <Td>
                                    {booking.slot
                                        ? `${booking.slot.date} ${booking.slot.startTime || ''}`
                                        : 'N/A'}
                                </Td>
                                <Td><StatusPill status={booking.status} /></Td>
                                <Td>
                                    <div className="flex gap-2">
                                        <ActionButton
                                            onClick={() => runAction(
                                                () => updateBookingStatus(booking.id, 'CONFIRMED'),
                                                'Booking confirmed'
                                            )}>
                                            Confirm
                                        </ActionButton>
                                        <DangerButton
                                            onClick={() => runAction(
                                                () => updateBookingStatus(booking.id, 'CANCELLED'),
                                                'Booking cancelled'
                                            )}>
                                            Cancel
                                        </DangerButton>
                                    </div>
                                </Td>
                            </tr>
                        )}
                    />
                )}

                {activeTab === 'colleges' && (
                    <DataTable
                        emptyText="No colleges found"
                        rows={colleges}
                        columns={['Name', 'Email', 'Plan', 'Status', 'Actions']}
                        renderRow={college => (
                            <tr key={college.id} className="border-t border-slate-800">
                                <Td>{college.name}</Td>
                                <Td>{college.email}</Td>
                                <Td>{college.plan || 'BASIC'}</Td>
                                <Td>{college.isActive ? 'Active' : 'Inactive'}</Td>
                                <Td>
                                    <DangerButton
                                        onClick={() => runAction(
                                            () => deleteCollege(college.id),
                                            'College deleted'
                                        )}>
                                        Delete
                                    </DangerButton>
                                </Td>
                            </tr>
                        )}
                    />
                )}

                {activeTab === 'sessions' && (
                    <DataTable
                        emptyText="No college sessions found"
                        rows={sessions}
                        columns={['College', 'Mentor', 'Topic', 'Date', 'Status', 'Actions']}
                        renderRow={session => (
                            <tr key={session.id} className="border-t border-slate-800">
                                <Td>{session.college?.name || 'College'}</Td>
                                <Td>{session.mentor?.name || 'Mentor'}</Td>
                                <Td>{session.topic}</Td>
                                <Td>{session.scheduledDate}</Td>
                                <Td><StatusPill status={session.status} /></Td>
                                <Td>
                                    <div className="flex gap-2">
                                        <ActionButton
                                            onClick={() => runAction(
                                                () => updateCollegeSessionStatus(session.id, 'CONFIRMED'),
                                                'Session confirmed'
                                            )}>
                                            Confirm
                                        </ActionButton>
                                        <ActionButton
                                            onClick={() => runAction(
                                                () => updateCollegeSessionStatus(session.id, 'COMPLETED'),
                                                'Session completed'
                                            )}>
                                            Complete
                                        </ActionButton>
                                    </div>
                                </Td>
                            </tr>
                        )}
                    />
                )}
            </main>
        </div>
    );
}

function DataTable({ columns, rows, renderRow, emptyText }) {
    return (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
            {rows.length === 0 ? (
                <div className="p-8 text-center text-slate-400">{emptyText}</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-800/80 text-slate-300">
                            <tr>
                                {columns.map(column => (
                                    <th key={column} className="text-left px-4 py-3 font-medium">
                                        {column}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>{rows.map(renderRow)}</tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function Td({ children }) {
    return <td className="px-4 py-3 text-slate-300 align-top">{children}</td>;
}

function StatusPill({ status }) {
    const color = status === 'CONFIRMED'
        ? 'bg-green-500/15 text-green-300'
        : status === 'CANCELLED'
        ? 'bg-red-500/15 text-red-300'
        : status === 'COMPLETED'
        ? 'bg-blue-500/15 text-blue-300'
        : 'bg-yellow-500/15 text-yellow-300';

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>
            {status || 'PENDING'}
        </span>
    );
}

function ActionButton({ children, onClick }) {
    return (
        <button
            onClick={onClick}
            className="px-3 py-1.5 bg-indigo-600 rounded-lg text-xs hover:bg-indigo-700">
            {children}
        </button>
    );
}

function DangerButton({ children, onClick }) {
    return (
        <button
            onClick={onClick}
            className="px-3 py-1.5 bg-red-600/80 rounded-lg text-xs hover:bg-red-600">
            {children}
        </button>
    );
}

export default AdminDashboard;
