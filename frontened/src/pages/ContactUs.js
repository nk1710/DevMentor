import React, { useState } from 'react';

function ContactUs() {
  const [form, setForm] = useState({
    name: '', email: '', subject: '', message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) {
      alert('Sab fields bharo!');
      return;
    }
    // Future me email API lagayenge
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">

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

      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-2 text-center">Contact Us</h1>
        <p className="text-slate-400 text-center mb-12">
          We'd love to hear from you!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Contact Info */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            {[
              {
                icon: '📧',
                title: 'Email',
                value: 'support@devmentor.in',
                sub: 'We reply within 24 hours'
              },
              {
                icon: '📍',
                title: 'Location',
                value: 'New Delhi, India',
                sub: 'Mon-Fri, 9am-6pm IST'
              },
              {
                icon: '💬',
                title: 'Live Chat',
                value: 'Available on platform',
                sub: 'For registered users'
              },
              {
                icon: '🐙',
                title: 'GitHub',
                value: 'github.com/devmentor',
                sub: 'Open source contributions'
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-indigo-400">{item.value}</p>
                  <p className="text-slate-500 text-sm">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          {submitted ? (
            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                <p className="text-slate-400">
                  We'll get back to you within 24 hours
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 px-6 py-3 bg-indigo-600 rounded-xl hover:bg-indigo-700 transition">
                  Send Another
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 space-y-4">
              <h2 className="text-2xl font-bold mb-2">Send a Message</h2>

              <div>
                <label className="text-slate-400 text-sm mb-2 block">
                  Your Name
                </label>
                <input
                  placeholder="Nikhil Singh"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-400 text-sm mb-2 block">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-400 text-sm mb-2 block">
                  Subject
                </label>
                <select
                  value={form.subject}
                  onChange={e => setForm({...form, subject: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500">
                  <option value="">Select subject</option>
                  <option>Technical Support</option>
                  <option>Payment Issue</option>
                  <option>Mentor Application</option>
                  <option>Report a Problem</option>
                  <option>General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 text-sm mb-2 block">
                  Message
                </label>
                <textarea
                  rows={5}
                  placeholder="Apna message yahan likhein..."
                  value={form.message}
                  onChange={e => setForm({...form, message: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-4 bg-indigo-600 rounded-xl font-semibold hover:bg-indigo-700 transition">
                Send Message 📨
              </button>
            </div>
          )}
        </div>
      </div>

      <footer className="border-t border-slate-800 py-8 text-center text-slate-500">
        © 2026 DevMentor. All rights reserved.
      </footer>
    </div>
  );
}

export default ContactUs;
