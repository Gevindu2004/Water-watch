import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import VillageSelection from './pages/VillageSelection';
import VillageDashboard from './pages/VillageDashboard';
import ReportShortage from './pages/ReportShortage';
import ReportHistory from './pages/ReportHistory';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Public Views */}
        <Route path="/" element={<VillageSelection />} />
        <Route path="/village/:id" element={<VillageDashboard />} />
        <Route path="/reports/:id" element={<ReportHistory />} />
        
        {/* Protected Routes */}
        <Route path="/report-shortage/:id" element={<ProtectedRoute><ReportShortage /></ProtectedRoute>} />
      </Routes>
    </>
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
