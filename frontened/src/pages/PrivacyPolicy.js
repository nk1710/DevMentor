import React from 'react';

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white">

      {/* Navbar */}
      {/* <nav className="flex justify-between items-center px-10 py-5 border-b border-slate-800">
        <div
          className="text-2xl font-bold text-indigo-400 cursor-pointer">
          Dev<span className="text-white">Mentor</span>
        </div>
        <button
          className="text-slate-400 hover:text-white transition">
          ← Back to Home
        </button>
      </nav> */}

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-slate-400 mb-10">Last updated: April 1, 2026</p>

        {[
          {
            title: '1. Information We Collect',
            content: `We collect information you provide directly to us, such as when you create an account, book a session, or contact us for support. This includes:
            • Name, email address, and password
            • Profile information (bio, skills, experience, location)
            • Payment information (processed securely via Razorpay)
            • Resume and documents you upload
            • Communications between users and mentors`
          },
          {
            title: '2. How We Use Your Information',
            content: `We use the information we collect to:
            • Provide, maintain, and improve our services
            • Process transactions and send related information
            • Match students with appropriate mentors
            • Send technical notices and support messages
            • Respond to your comments and questions
            • Monitor and analyze usage patterns`
          },
          {
            title: '3. Information Sharing',
            content: `We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
            • With mentors/students as necessary to facilitate sessions
            • With service providers who assist in our operations
            • If required by law or to protect our rights
            • With your consent`
          },
          {
            title: '4. Data Security',
            content: `We implement appropriate security measures to protect your personal information:
            • All passwords are encrypted using BCrypt
            • Payment data is handled by Razorpay (PCI DSS compliant)
            • We use HTTPS encryption for all data transmission
            • Regular security audits are performed`
          },
          {
            title: '5. Cookies',
            content: `We use cookies and similar tracking technologies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.`
          },
          {
            title: '6. Your Rights',
            content: `You have the right to:
            • Access your personal data
            • Correct inaccurate data
            • Request deletion of your data
            • Object to processing of your data
            • Data portability
            
            To exercise these rights, contact us at privacy@devmentor.in`
          },
          {
            title: '7. Children\'s Privacy',
            content: `Our service is not directed to children under 18. We do not knowingly collect personal information from children under 18. If you become aware that a child has provided us with personal information, please contact us.`
          },
          {
            title: '8. Changes to This Policy',
            content: `We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.`
          },
          {
            title: '9. Contact Us',
            content: `If you have any questions about this Privacy Policy, please contact us:
            • Email: privacy@devmentor.in
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

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-slate-500">
        © 2026 DevMentor. All rights reserved.
      </footer>
    </div>
  );
}

export default PrivacyPolicy;
