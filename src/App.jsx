import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import AppRoutes from './routes/AppRoutes';
import DebugPanel from './components/DebugPanel';
import './i18n';

/**
 * Entry point for the PBL Sheba Client Application.
 * This file is intentionally minimal as per the "Mega Modular" architecture.
 * Features and pages are lazy-loaded within AppRoutes.
 */
export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <AppRoutes />
          <DebugPanel />
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
}
