import React from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Droplet, 
  ShieldAlert, 
  Layers, 
  Users, 
  BarChart3, 
  LogOut, 
  Cpu,
  AlertTriangle,
  Server
} from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      {/* Admin Control Center Header */}
      <nav className="navbar" style={{ borderBottom: '1px solid #8b5cf6' }}>
        <div className="nav-content">
          <NavLink to="/admin/dashboard" className="brand-logo">
            <div className="brand-icon-wrapper" style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}>
              <ShieldAlert size={22} color="#ffffff" />
            </div>
            <div>
              <div className="brand-title">WATERWATCH</div>
              <div className="brand-subtitle" style={{ color: '#c084fc', fontWeight: '700' }}>
                ADMIN CONTROL CENTER
              </div>
            </div>
          </NavLink>

          <ul className="nav-links">
            <li>
              <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Server size={16} />
                <span>Control Center</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/tanks" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Layers size={16} />
                <span>Tanks</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/users" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Users size={16} />
                <span>Users</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/analytics" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <BarChart3 size={16} />
                <span>Analytics</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/smart-priority" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Cpu size={16} color="#00f2fe" />
                <span style={{ color: '#00f2fe', fontWeight: '700' }}>AI Priority</span>
              </NavLink>
            </li>
          </ul>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#f8fafc' }}>
                {user?.name || 'Administrator'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: '700' }}>
                ROLE: ADMINISTRATOR
              </div>
            </div>

            <button 
              className="btn btn-secondary btn-sm" 
              onClick={handleLogout}
              style={{ color: '#fb7185', borderColor: 'rgba(251, 113, 133, 0.3)' }}
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
}
