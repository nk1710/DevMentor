import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAdmin, isLoggedIn } from '../utils/auth';

function ProtectedRoute({ children, adminOnly = false }) {
    // Login nahi hai
    if (!isLoggedIn()) {
        return <Navigate to="/login" replace />;
    }

    // Admin only route
    if (adminOnly && !isAdmin()) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;
