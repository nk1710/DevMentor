import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';
import api, { uploadFile } from '../services/api';

function EditProfile() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const isMentorRole = user?.role === 'MENTOR';

  const [form, setForm] = useState({
    bio: '', location: '', phone: '',
    linkedinUrl: '', githubUrl: '',
    skills: '', designation: '',
    pricePerHour: '', pricePerMinute: '',
    experience: ''
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    // Load existing data
    const url = isMentorRole
      ? `/mentors/${user.id}`
      : `/users/${user.id}`;

    api.get(url).then(res => {
      const d = res.data;
      setForm({
        bio: d.bio || '',
        location: d.location || '',
        phone: d.phone || '',
        linkedinUrl: d.linkedinUrl || '',
        githubUrl: d.githubUrl || '',
        skills: d.skills || '',
        designation: d.designation || '',
        pricePerHour: d.pricePerHour || '',
        pricePerMinute: d.pricePerMinute || '',
        experience: d.experience || ''
      });
    });
  }, [isMentorRole, navigate, user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return null;
    const formData = new FormData();
    formData.append('file', resumeFile);
    formData.append('type', 'resume');
    const res = await uploadFile(formData);
    return res.data.url;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let resumeUrl = null;
      if (resumeFile) {
        resumeUrl = await handleResumeUpload();
      }

      const payload = { ...form };
      if (resumeUrl) payload.resumeUrl = resumeUrl;

      const url = isMentorRole
        ? `/mentors/profile/${user.id}`
        : `/users/profile/${user.id}`;

      await api.put(url, payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Save failed. Try again.');
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 border-b border-slate-800">
        <div onClick={() => navigate('/')}
          className="text-2xl font-bold text-indigo-400 cursor-pointer">
          Dev<span className="text-white">Mentor</span>
        </div>
        <button
          onClick={() => navigate(isMentorRole ? '/mentor-dashboard' : '/user-dashboard')}
          className="text-slate-300 hover:text-white">
          ← Back to Dashboard
        </button>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Edit Profile ✏️</h1>
        <p className="text-slate-400 mb-8">
          Your profile is visible to everyone on the platform
        </p>

        <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 space-y-6">

          {/* Basic Info */}
          <div>
            <label className="text-slate-400 text-sm mb-2 block">Bio</label>
            <textarea
              name="bio" value={form.bio} onChange={handleChange}
              placeholder="Tell others about yourself..."
              rows={4}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-sm mb-2 block">Location</label>
              <input
                name="location" value={form.location} onChange={handleChange}
                placeholder="Delhi, India"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-slate-400 text-sm mb-2 block">Phone</label>
              <input
                name="phone" value={form.phone} onChange={handleChange}
                placeholder="+91 9999999999"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 text-sm mb-2 block">Skills</label>
            <input
              name="skills" value={form.skills} onChange={handleChange}
              placeholder="Java, React, DSA, System Design"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Mentor Only Fields */}
          {isMentorRole && (
            <>
              <div>
                <label className="text-slate-400 text-sm mb-2 block">
                  Designation
                </label>
                <input
                  name="designation" value={form.designation}
                  onChange={handleChange}
                  placeholder="Senior Developer at Google"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-400 text-sm mb-2 block">
                  Experience
                </label>
                <input
                  name="experience" value={form.experience}
                  onChange={handleChange}
                  placeholder="3 years"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm mb-2 block">
                    Price per Hour (₹)
                  </label>
                  <input
                    name="pricePerHour" value={form.pricePerHour}
                    onChange={handleChange} placeholder="500"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-sm mb-2 block">
                    Price per Minute (₹)
                  </label>
                  <input
                    name="pricePerMinute" value={form.pricePerMinute}
                    onChange={handleChange} placeholder="10"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </>
          )}

          {/* Social Links */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-sm mb-2 block">
                LinkedIn URL
              </label>
              <input
                name="linkedinUrl" value={form.linkedinUrl}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-slate-400 text-sm mb-2 block">
                GitHub URL
              </label>
              <input
                name="githubUrl" value={form.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Resume Upload */}
          <div>
            <label className="text-slate-400 text-sm mb-2 block">
              Upload Resume (PDF)
            </label>
            <input
              type="file" accept=".pdf"
              onChange={(e) => setResumeFile(e.target.files[0])}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
            />
            <p className="text-slate-500 text-xs mt-1">
              PDF only, max 5MB
            </p>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-4 bg-indigo-600 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition disabled:opacity-50">
            {saving ? 'Saving...' : saved ? '✅ Saved!' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
