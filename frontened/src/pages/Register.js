import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, registerMentor, registerCollege } from '../services/api';

function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    role: 'USER', skills: '', experience: '',
    pricePerHour: '', phone: '', city: '',
    address: '', contactPerson: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      if (form.role === 'MENTOR') {
        await registerMentor({
          name: form.name,
          email: form.email,
          password: form.password,
          skills: form.skills,
          experience: form.experience,
          pricePerHour: parseFloat(form.pricePerHour),
          rating: 0
        });
      } else if (form.role === 'COLLEGE') {
        await registerCollege({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          city: form.city,
          address: form.address,
          contactPerson: form.contactPerson
        });
      } else {
        await registerUser({
          name: form.name,
          email: form.email,
          password: form.password,
          role: 'USER'
        });
      }
      alert('Registered successfully! ✅');
      navigate('/login');
    } catch (err) {
      alert('Registration failed. Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center py-10">
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 w-full max-w-md">

        <div className="text-center mb-8">
          <div className="text-3xl font-bold text-indigo-400 mb-2">
            Dev<span className="text-white">Mentor</span>
          </div>
          <h2 className="text-2xl font-bold text-white">
            Register 🚀
          </h2>
        </div>

        {/* Role Select */}
        <div className="mb-4">
          <label className="text-slate-400 text-sm mb-2 block">
            Register as
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setForm({...form, role: 'USER'})}
              className={`py-3 rounded-xl font-medium transition text-sm ${
                form.role === 'USER'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 text-slate-400 border border-slate-700'
              }`}>
              👤 Student
            </button>
            <button
              onClick={() => setForm({...form, role: 'MENTOR'})}
              className={`py-3 rounded-xl font-medium transition text-sm ${
                form.role === 'MENTOR'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 text-slate-400 border border-slate-700'
              }`}>
              🧑‍💻 Mentor
            </button>
            <button
              onClick={() => setForm({...form, role: 'COLLEGE'})}
              className={`py-3 rounded-xl font-medium transition text-sm ${
                form.role === 'COLLEGE'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 text-slate-400 border border-slate-700'
              }`}>
              🏫 College
            </button>
          </div>
        </div>

        {/* Common Fields */}
        <div className="space-y-3 mb-4">
          <input
            name="name"
            placeholder={
              form.role === 'COLLEGE'
                ? 'College Name (e.g. IIT Delhi)'
                : 'Full Name'
            }
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Mentor Fields */}
        {form.role === 'MENTOR' && (
          <div className="space-y-3 mb-4">
            <input
              name="skills"
              placeholder="Skills (Java, React, DSA)"
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <input
              name="experience"
              placeholder="Experience (e.g. 3 years)"
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <input
              name="pricePerHour"
              placeholder="Price per hour (₹)"
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}

        {/* College Fields */}
        {form.role === 'COLLEGE' && (
          <div className="space-y-3 mb-4">
            <input
              name="contactPerson"
              placeholder="Contact Person Name (TPO)"
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <input
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <input
              name="city"
              placeholder="City (e.g. Delhi)"
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <input
              name="address"
              placeholder="College Address"
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}

        <button
          onClick={handleRegister}
          className="w-full py-4 bg-indigo-600 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition">
          Register ✅
        </button>

        <p className="text-center text-slate-400 mt-4">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            className="text-indigo-400 cursor-pointer hover:underline">
            Login karo
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;