import React, { useEffect, useState } from 'react';
import { getAllMentors, searchMentorBySkill } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../utils/auth';

function MentorList() {
  const [mentors, setMentors] = useState([]);
  const [skill, setSkill] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAllMentors().then(res => {
      setMentors(res.data);
      setLoading(false);
    });
  }, []);

  const handleSearch = async () => {
    if (!skill.trim()) {
      getAllMentors().then(res => setMentors(res.data));
      return;
    }
    const res = await searchMentorBySkill(skill);
    setMentors(res.data);
  };

  const handleViewProfile = (mentorId) => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    navigate(`/mentor/${mentorId}`);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <p className="text-white text-xl">Loading mentors...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">

      {/* Navbar */}
      {/* <nav className="flex justify-between items-center px-10 py-5 border-b border-slate-800">
        <div onClick={() => navigate('/')}
          className="text-2xl font-bold text-indigo-400 cursor-pointer">
          Dev<span className="text-white">Mentor</span>
        </div>
        <div className="flex gap-4">
          {isLoggedIn() ? (
            <button
              onClick={() => navigate('/user-dashboard')}
              className="px-4 py-2 bg-indigo-600 rounded-xl hover:bg-indigo-700 transition">
              Dashboard
            </button>
          ) : (
            <>
              <button onClick={() => navigate('/login')}
                className="text-slate-300 hover:text-white transition">
                Login
              </button>
              <button onClick={() => navigate('/register')}
                className="px-4 py-2 bg-indigo-600 rounded-xl hover:bg-indigo-700 transition">
                Register
              </button>
            </>
          )}
        </div>
      </nav> */}

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Find a Mentor 🔍</h1>
        <p className="text-slate-400 mb-8">
          Connect with expert developers for 1-on-1 sessions
        </p>

        {/* Search */}
        <div className="flex gap-4 mb-10">
          <input
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            placeholder="Search by skill (Java, React, DSA...)"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-indigo-600 rounded-xl hover:bg-indigo-700 transition font-semibold">
            Search
          </button>
          <button
            onClick={() => {
              setSkill('');
              getAllMentors().then(res => setMentors(res.data));
            }}
            className="px-6 py-3 border border-slate-700 rounded-xl hover:border-indigo-500 transition">
            Reset
          </button>
        </div>

        {/* Mentor Cards */}
        {mentors.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-slate-400 text-lg">No mentors found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map(mentor => (
              <div key={mentor.id}
                className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 hover:border-indigo-500 transition cursor-pointer"
                onClick={() => handleViewProfile(mentor.id)}>

                {/* Avatar */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-indigo-600 flex items-center justify-center text-2xl font-bold flex-shrink-0">
                    {mentor.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{mentor.name}</h3>
                    {mentor.designation && (
                      <p className="text-indigo-400 text-sm">
                        {mentor.designation}
                      </p>
                    )}
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {mentor.skills?.split(',').slice(0, 3).map((skill, i) => (
                    <span key={i}
                      className="bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-full text-xs">
                      {skill.trim()}
                    </span>
                  ))}
                </div>

                {/* Info */}
                <div className="space-y-1 mb-4">
                  {mentor.experience && (
                    <p className="text-slate-400 text-sm">
                      💼 {mentor.experience}
                    </p>
                  )}
                  <p className="text-slate-400 text-sm">
                    ⭐ {mentor.rating || 0} rating
                  </p>
                </div>

                {/* Price + Button */}
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-indigo-400 font-bold text-lg">
                      ₹{mentor.pricePerHour}
                    </span>
                    <span className="text-slate-500 text-sm">/hr</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewProfile(mentor.id);
                    }}
                    className="px-4 py-2 bg-indigo-600 rounded-xl hover:bg-indigo-700 transition text-sm font-semibold">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MentorList;
