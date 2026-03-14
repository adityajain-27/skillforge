import React from 'react';

/**
 * AUTH BYPASS MODE — all dashboard routes are accessible without login.
 * TODO: Remove the bypass and restore the real auth check when the backend is connected:
 *
 *   import { Navigate } from 'react-router-dom';
 *   import { useAuth } from '../context/AuthContext';
 *   const { user, loading } = useAuth();
 *   if (loading) return <Spinner />;
 *   if (!user) return <Navigate to="/login" replace />;
 */
const ProtectedRoute = ({ children }) => children;

export default ProtectedRoute;
