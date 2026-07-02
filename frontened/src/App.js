import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MentorList from './pages/MentorList';
import MentorProfile from './pages/MentorProfile';
import MentorDashboard from './pages/MentorDashboard';
import UserDashboard from './pages/UserDashboard';
import EditProfile from './pages/EditProfile';
import AdminDashboard from './pages/AdminDashboard';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import VideoCall from './pages/VideoCall';
import CollegeDashboard from './pages/CollegeDashboard';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import RefundPolicy from './pages/RefundPolicy';

const NO_NAVBAR_ROUTES = ['/call/', '/admin'];

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#080B1A] flex flex-col items-center justify-center text-white p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-slate-400 mb-6 text-center max-w-md">
            An unexpected error occurred. Please refresh the page or try again.
          </p>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.href = '/'; }}
            className="px-6 py-3 bg-indigo-600 rounded-xl hover:bg-indigo-700 transition font-semibold"
          >
            Go Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#080B1A] flex flex-col items-center justify-center text-white p-8">
      <div className="text-8xl mb-4 font-bold text-indigo-400">404</div>
      <h1 className="text-2xl font-bold mb-2">Page not found</h1>
      <p className="text-slate-400 mb-6">The page you are looking for does not exist.</p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-3 bg-indigo-600 rounded-xl hover:bg-indigo-700 transition font-semibold"
      >
        Go Home
      </button>
    </div>
  );
}

function AppContent() {
    const location = window.location.pathname;
    const hideLayout = NO_NAVBAR_ROUTES.some(
        r => location.startsWith(r)
    );

    return (
        <div className="min-h-screen bg-[#080B1A] flex flex-col">
            {!hideLayout && <Navbar />}

            <main className="flex-1">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/mentors" element={<MentorList />} />
                    <Route path="/mentor/:id" element={<MentorProfile />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                    <Route path="/refund-policy" element={<RefundPolicy />} />

                    <Route path="/user-dashboard" element={
                        <ProtectedRoute><UserDashboard /></ProtectedRoute>
                    } />
                    <Route path="/mentor-dashboard" element={
                        <ProtectedRoute><MentorDashboard /></ProtectedRoute>
                    } />
                    <Route path="/college-dashboard" element={
                        <ProtectedRoute><CollegeDashboard /></ProtectedRoute>
                    } />
                    <Route path="/edit-profile" element={
                        <ProtectedRoute><EditProfile /></ProtectedRoute>
                    } />
                    <Route path="/payment/:slotId/:mentorId" element={
                        <ProtectedRoute><Payment /></ProtectedRoute>
                    } />
                    <Route path="/payment-success" element={
                        <ProtectedRoute><PaymentSuccess /></ProtectedRoute>
                    } />
                    <Route path="/call/:roomId" element={
                        <ProtectedRoute><VideoCall /></ProtectedRoute>
                    } />
                    <Route path="/admin" element={
                        <ProtectedRoute adminOnly={true}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>

            {!hideLayout && <Footer />}
        </div>
    );
}

function App() {
    return (
        <Router>
            <ErrorBoundary>
                <AppContent />
            </ErrorBoundary>
        </Router>
    );
}

export default App;
