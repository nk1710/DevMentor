import React from 'react';
import { useNavigate } from 'react-router-dom';

function AboutUs() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">

      {/* <nav className="flex justify-between items-center px-10 py-5 border-b border-slate-800">
        <div onClick={() => navigate('/')}
          className="text-2xl font-bold text-indigo-400 cursor-pointer">
          Dev<span className="text-white">Mentor</span>
        </div>
        <button onClick={() => navigate('/')}
          className="text-slate-400 hover:text-white transition">
          ← Back to Home
        </button>
      </nav> */}

      {/* Hero */}
      <div className="text-center py-20 px-6">
        <h1 className="text-5xl font-bold mb-4">About DevMentor</h1>
        <p className="text-slate-400 text-xl max-w-2xl mx-auto">
          We're on a mission to make quality tech mentorship accessible
          to every developer in India
        </p>
      </div>

      {/* Mission */}
      <div className="max-w-5xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: '🎯',
              title: 'Our Mission',
              desc: 'To connect aspiring developers with experienced mentors for personalized 1-on-1 guidance that accelerates career growth.'
            },
            {
              icon: '👁️',
              title: 'Our Vision',
              desc: 'A world where every developer, regardless of background, has access to world-class mentorship and guidance.'
            },
            {
              icon: '💎',
              title: 'Our Values',
              desc: 'Quality, transparency, and accessibility. We believe in building genuine connections between mentors and learners.'
            },
          ].map((item, i) => (
            <div key={i}
              className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 text-center">
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-slate-800/30 py-16 mb-20">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: '500+', label: 'Expert Mentors' },
            { number: '10,000+', label: 'Sessions Completed' },
            { number: '50+', label: 'Skills Covered' },
            { number: '4.9★', label: 'Average Rating' },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-3xl font-bold text-indigo-400 mb-2">
                {stat.number}
              </div>
              <div className="text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Story */}
      <div className="max-w-3xl mx-auto px-6 mb-20">
        <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
        <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
          <p className="text-slate-300 leading-relaxed mb-4">
            DevMentor was founded in 2026 with a simple observation —
            talented developers were struggling not because they lacked
            potential, but because they lacked proper guidance.
          </p>
          <p className="text-slate-300 leading-relaxed mb-4">
            We built a platform where experienced developers can share
            their knowledge and students can get personalized, actionable
            guidance for their specific problems.
          </p>
          <p className="text-slate-300 leading-relaxed">
            Today, DevMentor is India's fastest growing developer
            mentorship platform, connecting thousands of developers
            with expert mentors across Java, React, DSA, System Design,
            and more.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-16 px-6">
        <h2 className="text-3xl font-bold mb-4">
          Ready to accelerate your career?
        </h2>
        <p className="text-slate-400 mb-8">
          Join thousands of developers learning with expert mentors
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/mentors')}
            className="px-8 py-4 bg-indigo-600 rounded-xl font-semibold hover:bg-indigo-700 transition">
            Find a Mentor
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-4 border border-slate-600 rounded-xl font-semibold hover:border-indigo-500 transition">
            Become a Mentor
          </button>
        </div>
      </div>

      <footer className="border-t border-slate-800 py-8 text-center text-slate-500">
        © 2026 DevMentor. All rights reserved.
      </footer>
    </div>
  );
}

export default AboutUs;