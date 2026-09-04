import React from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Droplet, 
  LayoutDashboard, 
  Truck, 
  Calendar, 
  AlertTriangle, 
  Bell, 
  LogOut, 
  ShieldCheck,
  User
} from 'lucide-react';

export default function OfficerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      {/* Officer Portal Header */}
      <nav className="navbar" style={{ borderBottom: '1px solid #3b82f6' }}>
        <div className="nav-content">
          <NavLink to="/officer/dashboard" className="brand-logo">
            <div className="brand-icon-wrapper" style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)' }}>
              <Droplet size={22} color="#ffffff" />
            </div>
            <div>
              <div className="brand-title">WATERWATCH</div>
              <div className="brand-subtitle" style={{ color: '#60a5fa', fontWeight: '600' }}>
                Officer Operations Portal
              </div>
            </div>
          </NavLink>

          <ul className="nav-links">
            <li>
              <NavLink to="/officer/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/officer/bowsers" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Truck size={16} />
                <span>Bowsers</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/officer/deliveries" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Calendar size={16} />
                <span>Deliveries</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/officer/reports" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <AlertTriangle size={16} />
                <span>Shortage Reports</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/resident-preview" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <User size={16} />
                <span>Resident View</span>
              </NavLink>
            </li>
          </ul>

          {/* User Profile & Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <ShieldCheck size={14} color="#34d399" />
                {user?.name || 'Water Board Officer'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#60a5fa', fontWeight: '600' }}>
                Role: OFFICER ({user?.email || 'officer@test.com'})
              </div>
            </div>

            <button 
              className="btn btn-secondary btn-sm" 
              onClick={handleLogout}
              title="Logout from Officer Portal"
              style={{ color: '#fb7185', borderColor: 'rgba(251, 113, 133, 0.3)' }}
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Officer Page Content */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
}
