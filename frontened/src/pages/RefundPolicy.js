import React from 'react';
import { useNavigate } from 'react-router-dom';

function RefundPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">

      <nav className="flex justify-between items-center px-10 py-5 border-b border-slate-800">
        <div onClick={() => navigate('/')}
          className="text-2xl font-bold text-indigo-400 cursor-pointer">
          Dev<span className="text-white">Mentor</span>
        </div>
        <button onClick={() => navigate('/')}
          className="text-slate-400 hover:text-white transition">
          ← Back to Home
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-2">Refund Policy</h1>
        <p className="text-slate-400 mb-10">Last updated: April 1, 2026</p>

        {/* Quick Summary */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { time: '24+ hours before', refund: '100% Refund', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30' },
            { time: '12-24 hours before', refund: '50% Refund', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' },
            { time: 'Less than 12 hours', refund: 'No Refund', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' },
          ].map((item, i) => (
            <div key={i} className={`rounded-2xl p-6 border ${item.bg} text-center`}>
              <div className={`text-2xl font-bold ${item.color} mb-2`}>
                {item.refund}
              </div>
              <div className="text-slate-400 text-sm">{item.time}</div>
            </div>
          ))}
        </div>

        {[
          {
            title: '1. Cancellation by Student',
            content: `If you need to cancel a booked session:
            • 24+ hours before session: Full refund (100%)
            • 12-24 hours before session: Partial refund (50%)
            • Less than 12 hours: No refund
            • No-show without notice: No refund
            
            Refunds are processed within 5-7 business days.`
          },
          {
            title: '2. Cancellation by Mentor',
            content: `If a mentor cancels your session:
            • Full refund (100%) will be issued
            • Additional 10% compensation credit added to your account
            • You will be notified immediately via email
            • Priority rebooking assistance will be provided`
          },
          {
            title: '3. Technical Issues',
            content: `If a session cannot be completed due to technical issues:
            • Verified platform issues: Full refund
            • Internet issues on student side: No refund
            • Internet issues on mentor side: Full refund
            • Partial session completed: Prorated refund`
          },
          {
            title: '4. Quality Concerns',
            content: `If you are unsatisfied with session quality:
            • Report within 24 hours of session
            • Our team will review the complaint
            • Verified quality issues: Full refund or free session
            • We take quality seriously and investigate all reports`
          },
          {
            title: '5. How to Request a Refund',
            content: `To request a refund:
            1. Go to your dashboard
            2. Find the booking in question
            3. Click "Request Refund"
            4. Provide reason for refund
            5. Our team will respond within 48 hours
            
            Or email us at: refunds@devmentor.in`
          },
          {
            title: '6. Refund Processing Time',
            content: `• Credit/Debit Card: 5-7 business days
            • UPI: 1-3 business days
            • Net Banking: 3-5 business days
            • Platform Credits: Instant`
          },
        ].map((section, i) => (
          <div key={i} className="mb-8">
            <h2 className="text-xl font-semibold text-indigo-400 mb-3">
              {section.title}
            </h2>
            <p className="text-slate-300 leading-relaxed whitespace-pre-line">
              {section.content}
            </p>
          </div>
        ))}
      </div>

      <footer className="border-t border-slate-800 py-8 text-center text-slate-500">
        © 2026 DevMentor. All rights reserved.
      </footer>
    </div>
  );
}

export default RefundPolicy;