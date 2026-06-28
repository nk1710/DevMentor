import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

// Video Call aur Admin me footer/navbar nahi chahiye
const NO_NAVBAR_ROUTES = ['/call/', '/admin'];

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
                    {/* Public */}
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

                    {/* Protected */}
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

                    {/* Admin */}
                    <Route path="/admin" element={
                        <ProtectedRoute adminOnly={true}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                </Routes>
            </main>

            {!hideLayout && <Footer />}
        </div>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;