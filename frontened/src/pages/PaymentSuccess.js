import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserBookings } from '../services/api';

function PaymentSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (state?.bookingId) {
      setBooking({
        bookingId: state.bookingId,
        paymentId: state.paymentId,
        amount: state.amount,
        mentor: state.mentor,
        slot: state.slot
      });
      return;
    }
    getUserBookings().then(res => {
      const latest = (res.data || [])[0];
      if (latest) {
        setBooking({
          bookingId: latest.id,
          paymentId: latest.paymentId,
          amount: latest.amountPaid,
          mentor: latest.mentor,
          slot: latest.slot
        });
      }
    }).catch(() => {});
  }, [state]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
      <div className="bg-slate-800/50 rounded-2xl p-12 border border-slate-700 text-center max-w-md">

        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold mb-3">Booking Confirmed!</h1>
        <p className="text-slate-400 mb-8">
          Your session has been booked successfully
        </p>

        {booking ? (
          <div className="bg-slate-900 rounded-xl p-6 mb-8 text-left space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Mentor</span>
              <span className="font-medium">{booking.mentor?.name || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Date</span>
              <span className="font-medium">{booking.slot?.date || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Time</span>
              <span className="font-medium">
                {booking.slot?.startTime} - {booking.slot?.endTime}
              </span>
            </div>
            {booking.paymentId && (
              <div className="flex justify-between">
                <span className="text-slate-400">Payment ID</span>
                <span className="font-medium text-green-400 text-xs">
                  {booking.paymentId}
                </span>
              </div>
            )}
            {booking.bookingId && (
              <div className="flex justify-between">
                <span className="text-slate-400">Booking ID</span>
                <span className="font-medium text-indigo-400 text-xs">
                  #{booking.bookingId}
                </span>
              </div>
            )}
            {booking.amount && (
              <div className="flex justify-between">
                <span className="text-slate-400">Amount Paid</span>
                <span className="font-medium">₹{(booking.amount / 100).toFixed(2)}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-slate-900 rounded-xl p-6 mb-8 text-center">
            <p className="text-slate-400">Payment completed successfully</p>
          </div>
        )}

        <button
          onClick={() => navigate('/user-dashboard')}
          className="w-full py-4 bg-indigo-600 rounded-xl font-semibold hover:bg-indigo-700 transition">
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

export default PaymentSuccess;
