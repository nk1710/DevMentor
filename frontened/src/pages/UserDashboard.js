import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getUserBookings } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../utils/auth';

function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = useMemo(() => getCurrentUser(), []);

  const loadBookings = useCallback(async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await getUserBookings(user.id);
      setBookings(res.data || []);
    } catch (err) {
      console.error('Bookings load error:', err);
    }
    setLoading(false);
  }, [navigate, user]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <p className="text-white text-xl">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Welcome & Actions */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">My Dashboard 📊</h1>
            <p className="text-slate-400">Welcome back, {user?.name} 👋</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/edit-profile')}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:text-white transition text-sm">
              ✏️ Edit Profile
            </button>
            <button
              onClick={() => navigate('/mentors')}
              className="px-4 py-2 bg-indigo-600 rounded-xl hover:bg-indigo-700 transition text-sm font-medium">
              Find Mentor
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600/20 border border-red-500/30 text-red-400 hover:text-red-300 rounded-xl transition text-sm">
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total Bookings', value: bookings.length, icon: '📅' },
            {
              label: 'Confirmed',
              value: bookings.filter(b => b.status === 'CONFIRMED').length,
              icon: '✅'
            },
            {
              label: 'Completed',
              value: bookings.filter(b => b.status === 'COMPLETED').length,
              icon: '🎓'
            },
          ].map((stat, i) => (
            <div key={i}
              className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-indigo-400 mb-1">
                {stat.value}
              </div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Bookings */}
        <h2 className="text-xl font-semibold mb-4">My Sessions</h2>

        {bookings.length === 0 ? (
          <div className="bg-slate-800/50 rounded-2xl p-12 border border-slate-700 text-center">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-slate-400 text-lg mb-4">No bookings yet</p>
            <button
              onClick={() => navigate('/mentors')}
              className="px-6 py-3 bg-indigo-600 rounded-xl hover:bg-indigo-700 transition">
              Find a Mentor
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(b => (
              <div key={b.id}
                className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">

                <div className="flex justify-between items-start">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-xl font-bold flex-shrink-0">
                      {b.mentor?.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {b.mentor?.name || 'Mentor'}
                      </h3>
                      <p className="text-slate-400 text-sm">
                        {b.mentor?.skills || ''}
                      </p>
                      {/* Slot details */}
                      {b.slot ? (
                        <p className="text-slate-500 text-sm mt-1">
                          📅 {b.slot.date} | ⏰ {b.slot.startTime} - {b.slot.endTime}
                        </p>
                      ) : (
                        <p className="text-red-400 text-sm mt-1">
                          Slot info unavailable
                        </p>
                      )}
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                    b.status === 'CONFIRMED'
                      ? 'bg-green-500/20 text-green-400'
                      : b.status === 'CANCELLED'
                      ? 'bg-red-500/20 text-red-400'
                      : b.status === 'COMPLETED'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {b.status}
                  </span>
                </div>

                {/* Join Call Button */}
                {b.status === 'CONFIRMED' && b.roomId && (
                  <button
                    onClick={() => navigate(`/call/${b.roomId}`)}
                    className="mt-4 w-full py-3 bg-green-600 rounded-xl hover:bg-green-700 transition font-semibold flex items-center justify-center gap-2">
                    🎥 Join Video Call
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
