import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMentorById, getAvailableSlots, createOrder, verifyPayment } from '../services/api';
import { getCurrentUser } from '../utils/auth';

function Payment() {
  const { slotId, mentorId } = useParams();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [mentor, setMentor] = useState(null);
  const [slot, setSlot] = useState(null);
  const [slotNotFound, setSlotNotFound] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getMentorById(mentorId).then(res => setMentor(res.data)).catch(() => setError('Failed to load mentor'));
    getAvailableSlots(mentorId).then(res => {
      const found = (res.data || []).find(s => String(s.id) === String(slotId));
      if (found) {
        setSlot(found);
      } else {
        setSlotNotFound(true);
      }
    }).catch(() => setError('Failed to load slot information'));
  }, [mentorId, slotId]);
   const loadRazorpay = () => {
    return new Promise(resolve => {
      if (window.Razorpay) { resolve(true); return; }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setPaying(true);
    setError('');

    const loaded = await loadRazorpay();
    if (!loaded) {
      setError('Payment gateway failed to load. Please try again.');
      setPaying(false);
      return;
    }

    try {
      const orderRes = await createOrder(mentorId, slotId);
      const order = orderRes.data;

      if (!order.orderId || !order.keyId) {
        setError('Invalid order response from server');
        setPaying(false);
        return;
      }

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: 'DevMentor',
        description: `Session with ${mentor.name}`,
        handler: async function (response) {
          try {
            const verifyRes = await verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature,
              mentorId,
              slotId
            );
            navigate('/payment-success', {
              state: {
                paymentId: response.razorpay_payment_id,
                bookingId: verifyRes.data.bookingId,
                amount: verifyRes.data.amount,
                mentor: mentor,
                slot: slot
              }
            });
          } catch (err) {
            const msg = err.response?.data || err.message || 'Unknown error';
            setError('Payment failed: ' + msg);
            setPaying(false);
          }
        },
        modal: {
          ondismiss: function() {
            setPaying(false);
          }
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
      razor.on('payment.failed', function (response) {
        setError('Payment failed: ' + (response.error.description || 'Unknown error'));
        setPaying(false);
      });
      razor.open();
    } catch (err) {
      setError(err.response?.data || 'Failed to create payment order');
      setPaying(false);
    }
  };

  if (slotNotFound) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">😔</div>
        <h2 className="text-white text-2xl font-bold mb-2">Slot No Longer Available</h2>
        <p className="text-slate-400 mb-6">This slot has already been booked or is no longer available.</p>
        <button onClick={() => navigate(`/mentor/${mentorId}`)}
          className="px-6 py-3 bg-indigo-600 rounded-xl hover:bg-indigo-700 transition font-semibold">
          View Other Slots
        </button>
      </div>
    </div>
  );

  if (!mentor || !slot) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>
  );

  const baseAmount = parseFloat(mentor.pricePerHour) || 0;
  const gstAmount = Math.round(baseAmount * 0.18 * 100) / 100;
  const totalAmount = baseAmount + gstAmount;

  if (baseAmount <= 0) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-white text-2xl font-bold mb-2">Price Not Set</h2>
        <p className="text-slate-400 mb-6">This mentor hasn't set their session price yet.</p>
        <button onClick={() => navigate(-1)}
          className="px-6 py-3 bg-indigo-600 rounded-xl hover:bg-indigo-700 transition font-semibold">
          Go Back
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">

      <nav className="flex justify-between items-center px-10 py-5 border-b border-slate-800">
        <div className="text-2xl font-bold text-indigo-400">
          Dev<span className="text-white">Mentor</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Complete Booking
        </h1>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

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
              <span>Date</span>
              <span className="font-medium">{slot.date}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Time</span>
              <span className="font-medium">{slot.startTime} - {slot.endTime}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Experience</span>
              <span className="font-medium">{mentor.experience}</span>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-4 space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>Session Fee</span>
              <span>₹{baseAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>GST (18%)</span>
              <span>₹{gstAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-700">
              <span className="text-xl font-bold">Total</span>
              <span className="text-2xl font-bold text-indigo-400">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={paying}
          className="w-full py-5 bg-indigo-600 rounded-2xl text-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50">
          {paying ? 'Processing...' : `Pay ₹${totalAmount.toFixed(2)} & Book`}
        </button>

        <p className="text-center text-slate-500 text-sm mt-4">
          Secure payment powered by Razorpay
        </p>
      </div>
    </div>
  );
}

export default Payment;
