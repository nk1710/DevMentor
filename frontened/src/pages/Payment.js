import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMentorById, getAvailableSlots, createBooking } from '../services/api';
import { getCurrentUser } from '../utils/auth';

function Payment() {
  const { slotId, mentorId } = useParams();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [mentor, setMentor] = useState(null);
  const [slot, setSlot] = useState(null);
  const [paying, setPaying] = useState(false);
  const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY_ID;

  useEffect(() => {
    getMentorById(mentorId).then(res => setMentor(res.data));
    getAvailableSlots(mentorId).then(res => {
      const found = res.data.find(s => s.id === parseInt(slotId));
      setSlot(found);
    });
  }, [mentorId, slotId]);

  const loadRazorpay = () => {
    return new Promise(resolve => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setPaying(true);
    const loaded = await loadRazorpay();

    if (!loaded) {
      alert('Payment gateway failed to load');
      setPaying(false);
      return;
    }

    if (!razorpayKey) {
      alert('Payment key is not configured.');
      setPaying(false);
      return;
    }

    // Amount calculate karo
    const amount = mentor.pricePerHour * 100; // Razorpay paise me leta hai

    const options = {
      key: razorpayKey,
      amount: amount,
      currency: 'INR',
      name: 'DevMentor',
      description: `Session with ${mentor.name}`,
      handler: async function (response) {
        // Payment successful
        await createBooking(user.id, mentorId, slotId);
        navigate('/payment-success', {
          state: {
            paymentId: response.razorpay_payment_id,
            mentor: mentor,
            slot: slot
          }
        });
      },
      prefill: {
        name: user?.name,
        email: user?.email,
      },
      theme: {
        color: '#6366f1'
      }
    };

    const razor = new window.Razorpay(options);
    razor.open();
    setPaying(false);
  };

  if (!mentor || !slot) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 border-b border-slate-800">
        <div className="text-2xl font-bold text-indigo-400">
          Dev<span className="text-white">Mentor</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Complete Booking 💳
        </h1>

        {/* Order Summary */}
        <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 mb-6">
          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-700">
            <div className="w-14 h-14 rounded-xl bg-indigo-600 flex items-center justify-center text-2xl font-bold">
              {mentor.name?.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-lg">{mentor.name}</p>
              <p className="text-slate-400 text-sm">{mentor.skills}</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-slate-300">
              <span>📅 Date</span>
              <span className="font-medium">{slot.date}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>⏰ Time</span>
              <span className="font-medium">
                {slot.startTime} - {slot.endTime}
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>💼 Experience</span>
              <span className="font-medium">{mentor.experience}</span>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">Total Amount</span>
              <span className="text-2xl font-bold text-indigo-400">
                ₹{mentor.pricePerHour}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={paying}
          className="w-full py-5 bg-indigo-600 rounded-2xl text-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50">
          {paying ? 'Processing...' : `Pay ₹${mentor.pricePerHour} & Book`}
        </button>

        <p className="text-center text-slate-500 text-sm mt-4">
          🔒 Secure payment powered by Razorpay
        </p>
      </div>
    </div>
  );
}

export default Payment;
