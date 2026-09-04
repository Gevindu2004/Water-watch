import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import OfficerLayout from './components/OfficerLayout';
import OfficerLoginPage from './pages/OfficerLoginPage';
import OfficerDashboard from './pages/OfficerDashboard';
import BowsersManagement from './pages/BowsersManagement';
import DeliveriesDashboard from './pages/DeliveriesDashboard';
import ShortageReportsPage from './pages/ShortageReportsPage';
import ResidentQueueView from './pages/ResidentQueueView';
import ApiDocsPage from './pages/ApiDocsPage';
import './App.css';

function ProtectedOfficerRoute({ children }) {
  const { user, isOfficer } = useAuth();
  if (!user || !isOfficer) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Login Route */}
      <Route path="/login" element={<OfficerLoginPage />} />

      {/* Protected Officer Portal Routes */}
      <Route path="/officer" element={
        <ProtectedOfficerRoute>
          <OfficerLayout />
        </ProtectedOfficerRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<OfficerDashboard />} />
        <Route path="bowsers" element={<BowsersManagement />} />
        <Route path="deliveries" element={<DeliveriesDashboard />} />
        <Route path="reports" element={<ShortageReportsPage />} />
      </Route>

      {/* Legacy / Direct Shortcuts */}
      <Route path="/bowsers" element={<Navigate to="/officer/bowsers" replace />} />
      <Route path="/deliveries" element={<Navigate to="/officer/deliveries" replace />} />
      <Route path="/reports" element={<Navigate to="/officer/reports" replace />} />
      <Route path="/resident-preview" element={<ResidentQueueView />} />
      <Route path="/api-docs" element={<ApiDocsPage />} />

      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/officer/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/officer/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
