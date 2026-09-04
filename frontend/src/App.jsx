import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DistrictProvider } from './context/DistrictContext';
import OfficerRegisterPage from './pages/OfficerRegisterPage';
import LandingPage from './pages/LandingPage';
import OfficerLayout from './components/OfficerLayout';
import AdminLayout from './components/AdminLayout';
import OfficerLoginPage from './pages/OfficerLoginPage';
import OfficerDashboard from './pages/OfficerDashboard';
import BowsersManagement from './pages/BowsersManagement';
import DeliveriesDashboard from './pages/DeliveriesDashboard';
import ShortageReportsPage from './pages/ShortageReportsPage';
import ResidentQueueView from './pages/ResidentQueueView';
import ApiDocsPage from './pages/ApiDocsPage';

// Member 3 & Member 4 Pages
import AdminDashboard from './pages/AdminDashboard';
import TankManagementPage from './pages/TankManagementPage';
import UserManagementPage from './pages/UserManagementPage';
import SystemAnalyticsPage from './pages/SystemAnalyticsPage';
import SmartPriorityDashboard from './pages/SmartPriorityDashboard';
import OfficerRegistrationPage from './pages/OfficerRegistrationPage';

import './App.css';

function ProtectedOfficerRoute({ children }) {
  const auth = useAuth();
  if (!auth || !auth.user || !auth.isOfficer) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function ProtectedAdminRoute({ children }) {
  const auth = useAuth();
  if (!auth || !auth.user || !auth.isAdmin) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Public Login & Registration Routes */}
      <Route path="/login" element={<OfficerLoginPage />} />
      <Route path="/register" element={<OfficerRegisterPage />} />
      <Route path="/officer/register" element={<OfficerRegisterPage />} />

      {/* Protected Officer Portal Routes (Member 2) */}
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
        <Route path="smart-priority" element={<SmartPriorityDashboard />} />
        <Route path="register-officer" element={<OfficerRegisterPage />} />
      </Route>

      {/* Protected Admin Control Center Routes (Member 3 & Member 4) */}
      <Route path="/admin" element={
        <ProtectedAdminRoute>
          <AdminLayout />
        </ProtectedAdminRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="tanks" element={<TankManagementPage />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="analytics" element={<SystemAnalyticsPage />} />
        <Route path="smart-priority" element={<SmartPriorityDashboard />} />
      </Route>

      {/* Direct Smart Priority Route */}
      <Route path="/smart-priority" element={
        <ProtectedOfficerRoute>
          <SmartPriorityDashboard />
        </ProtectedOfficerRoute>
      } />

      {/* Legacy & Direct Integration Routes */}
      <Route path="/bowsers" element={<Navigate to="/officer/bowsers" replace />} />
      <Route path="/deliveries" element={<Navigate to="/officer/deliveries" replace />} />
      <Route path="/reports" element={<Navigate to="/officer/reports" replace />} />
      <Route path="/resident-preview" element={<ResidentQueueView />} />

      {/* Catch-all redirect to Landing Page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <DistrictProvider>
        <Router>
          <AppRoutes />
        </Router>
      </DistrictProvider>
    </AuthProvider>
  );
}

export default App;
