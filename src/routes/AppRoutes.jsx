import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import GlobalLoading from '../components/common/GlobalLoading';

// Lazy load pages for performance
const HomePage = lazy(() => import('../pages/HomePage'));
const LoginPage = lazy(() => import('../features/auth/Login'));
const RegisterPage = lazy(() => import('../features/auth/Register'));
const ApplyPage = lazy(() => import('../features/career/ApplyPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const SearchPage = lazy(() => import('../pages/SearchPage'));
const SurveyPage = lazy(() => import('../pages/SurveyPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
const ForceResetPage = lazy(() => import('../features/auth/ForceReset'));

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuthStore();

  // Handle case where user is forced to reset password on first login
  if (isAuthenticated && user?.firstLogin && user?.role !== 'member') {
    return (
      <Suspense fallback={<GlobalLoading open={true} text="Restoring session..." />}>
        <Routes>
          <Route path="*" element={<ForceResetPage />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<GlobalLoading open={true} text="Loading page..." />}>
      <Routes>
        {}
        <Route 
          path="/" 
          element={isAuthenticated ? <DashboardPage /> : <HomePage />} 
        />
        
        {}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />} 
        />
        <Route path="/apply" element={<ApplyPage />} />
        
        {}
        <Route 
          path="/search" 
          element={isAuthenticated ? <SearchPage /> : <HomePage />} 
        />
        <Route 
          path="/survey" 
          element={isAuthenticated ? <SurveyPage /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/profile" 
          element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" replace />} 
        />

        {}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
