import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function PaymentSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
      <div className="bg-slate-800/50 rounded-2xl p-12 border border-slate-700 text-center max-w-md">

        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold mb-3">Booking Confirmed!</h1>
        <p className="text-slate-400 mb-8">
          Your session has been booked successfully
        </p>

        {state && (
          <div className="bg-slate-900 rounded-xl p-6 mb-8 text-left space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Mentor</span>
              <span className="font-medium">{state.mentor?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Date</span>
              <span className="font-medium">{state.slot?.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Time</span>
              <span className="font-medium">
                {state.slot?.startTime} - {state.slot?.endTime}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Payment ID</span>
              <span className="font-medium text-green-400 text-xs">
                {state.paymentId}
              </span>
            </div>
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