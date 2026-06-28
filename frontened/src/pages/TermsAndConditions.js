import React from 'react';
import { useNavigate } from 'react-router-dom';

function TermsAndConditions() {
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
        <h1 className="text-4xl font-bold mb-2">Terms & Conditions</h1>
        <p className="text-slate-400 mb-10">Last updated: April 1, 2026</p>

        {[
          {
            title: '1. Acceptance of Terms',
            content: `By accessing and using DevMentor, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.`
          },
          {
            title: '2. Description of Service',
            content: `DevMentor is an online platform that connects students and developers with experienced mentors for 1-on-1 learning sessions. We provide:
            • A marketplace to find and book mentors
            • Video call infrastructure for sessions
            • Payment processing services
            • Profile and session management tools`
          },
          {
            title: '3. User Accounts',
            content: `To use our services, you must:
            • Be at least 18 years of age
            • Register for an account with accurate information
            • Maintain the security of your account credentials
            • Notify us immediately of any unauthorized use
            • Be responsible for all activities under your account`
          },
          {
            title: '4. Mentor Responsibilities',
            content: `Mentors on DevMentor agree to:
            • Provide accurate information about their skills and experience
            • Honor all confirmed bookings
            • Conduct sessions professionally and respectfully
            • Not share confidential information of students
            • Maintain quality standards of teaching
            • Set fair and transparent pricing`
          },
          {
            title: '5. Student Responsibilities',
            content: `Students using DevMentor agree to:
            • Attend booked sessions on time
            • Treat mentors with respect
            • Not record sessions without mentor consent
            • Provide honest reviews and ratings
            • Not share session content without permission`
          },
          {
            title: '6. Payment Terms',
            content: `• All payments are processed securely via Razorpay
            • Session fees are charged at the time of booking
            • Refunds are available if cancelled 24 hours before the session
            • DevMentor charges a platform fee of 10% on each transaction
            • Mentors receive 90% of the session fee
            • Payments are settled within 7 business days`
          },
          {
            title: '7. Cancellation & Refund Policy',
            content: `• Cancellation 24+ hours before: Full refund
            • Cancellation 12-24 hours before: 50% refund
            • Cancellation less than 12 hours: No refund
            • If mentor cancels: Full refund + 10% compensation
            • Technical issues (verified): Full refund`
          },
          {
            title: '8. Code of Conduct',
            content: `Users must not:
            • Harass, abuse, or harm other users
            • Share inappropriate or illegal content
            • Attempt to circumvent the platform for payments
            • Create fake reviews or ratings
            • Impersonate other users or professionals
            • Use the platform for any illegal purpose`
          },
          {
            title: '9. Intellectual Property',
            content: `• All content on DevMentor is protected by copyright
            • Session recordings (if any) are owned by the platform
            • Users retain rights to their uploaded resumes and profiles
            • The DevMentor name and logo are registered trademarks`
          },
          {
            title: '10. Limitation of Liability',
            content: `DevMentor shall not be liable for:
            • Quality of mentoring sessions
            • Technical issues during video calls
            • Loss of data or business interruption
            • Actions of individual mentors or students
            
            Our maximum liability is limited to the amount paid for the specific session in dispute.`
          },
          {
            title: '11. Governing Law',
            content: `These terms shall be governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.`
          },
          {
            title: '12. Contact',
            content: `For any questions regarding these Terms:
            • Email: legal@devmentor.in
            • Address: New Delhi, India`
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

export default TermsAndConditions;