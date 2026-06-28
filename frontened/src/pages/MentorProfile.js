import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMentorById, getAvailableSlots } from '../services/api';
import { isLoggedIn } from '../utils/auth';

function MentorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState(null);
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    getMentorById(id).then(res => setMentor(res.data));
    getAvailableSlots(id).then(res => setSlots(res.data));
  }, [id]);

  const handleBookNow = (slotId) => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    navigate(`/payment/${slotId}/${id}`);
  };

  if (!mentor) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 border-b border-slate-800">
        <div onClick={() => navigate('/')}
          className="text-2xl font-bold text-indigo-400 cursor-pointer">
          Dev<span className="text-white">Mentor</span>
        </div>
        <button onClick={() => navigate('/mentors')}
          className="text-slate-300 hover:text-white">
          ← Back to Mentors
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Profile Header */}
        <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">

            {/* Avatar */}
            <div className="w-28 h-28 rounded-2xl bg-indigo-600 flex items-center justify-center text-4xl font-bold flex-shrink-0">
              {mentor.name?.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-1">{mentor.name}</h1>
              {mentor.designation && (
                <p className="text-indigo-400 text-lg mb-2">{mentor.designation}</p>
              )}
              {mentor.location && (
                <p className="text-slate-400 mb-3">📍 {mentor.location}</p>
              )}
              {mentor.bio && (
                <p className="text-slate-300 leading-relaxed mb-4">{mentor.bio}</p>
              )}

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {mentor.skills?.split(',').map((skill, i) => (
                  <span key={i}
                    className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-sm">
                    {skill.trim()}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex gap-4">
                {mentor.linkedinUrl && (
                  <a href={mentor.linkedinUrl} target="_blank" rel="noreferrer"
                    className="text-blue-400 hover:underline text-sm">
                    🔗 LinkedIn
                  </a>
                )}
                {mentor.githubUrl && (
                  <a href={mentor.githubUrl} target="_blank" rel="noreferrer"
                    className="text-slate-400 hover:underline text-sm">
                    🐙 GitHub
                  </a>
                )}
                {mentor.resumeUrl && (
                  <a href={mentor.resumeUrl} target="_blank" rel="noreferrer"
                    className="text-green-400 hover:underline text-sm">
                    📄 Resume
                  </a>
                )}
              </div>
            </div>

            {/* Price Card */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700 min-w-[200px]">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-indigo-400">
                  ₹{mentor.pricePerHour}
                </div>
                <div className="text-slate-400 text-sm">per hour</div>
                {mentor.pricePerMinute && (
                  <>
                    <div className="text-xl font-bold text-green-400 mt-2">
                      ₹{mentor.pricePerMinute}
                    </div>
                    <div className="text-slate-400 text-sm">per minute</div>
                  </>
                )}
              </div>
              <div className="text-center mb-4">
                <span className="text-yellow-400 text-lg">⭐ {mentor.rating}</span>
              </div>
              <div className="text-center text-slate-400 text-sm">
                💼 {mentor.experience} experience
              </div>
            </div>
          </div>
        </div>

        {/* Available Slots */}
        <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
          <h2 className="text-2xl font-bold mb-6">📅 Available Slots</h2>

          {slots.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">No slots available right now</p>
              <p className="text-slate-500 text-sm mt-2">Check back later!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {slots.map(slot => (
                <div key={slot.id}
                  className="bg-slate-900 rounded-xl p-5 border border-slate-700 flex justify-between items-center">
                  <div>
                    <p className="text-white font-semibold">📅 {slot.date}</p>
                    <p className="text-slate-400 text-sm mt-1">
                      ⏰ {slot.startTime} - {slot.endTime}
                    </p>
                  </div>
                  <button
                    onClick={() => handleBookNow(slot.id)}
                    className="px-5 py-2 bg-indigo-600 rounded-xl hover:bg-indigo-700 transition font-semibold">
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MentorProfile;