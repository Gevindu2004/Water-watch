import React from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDistrict } from '../context/DistrictContext';
import { 
  Droplet, 
  LayoutDashboard, 
  Truck, 
  Calendar, 
  AlertTriangle, 
  LogOut, 
  ShieldCheck,
  User,
  MapPin
} from 'lucide-react';

export default function OfficerLayout() {
  const { user, logout } = useAuth();
  const { selectedDistrict, setSelectedDistrict, DRY_ZONE_DISTRICTS } = useDistrict();
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
                Dry Zone Relief Network
              </div>
            </div>
          </NavLink>

          {/* District Selector Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(30, 41, 59, 0.8)', padding: '0.35rem 0.75rem', borderRadius: '9999px', border: '1px solid rgba(59, 130, 246, 0.4)' }}>
            <MapPin size={15} color="#60a5fa" />
            <select 
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#60a5fa', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', outline: 'none' }}
            >
              {DRY_ZONE_DISTRICTS.map(d => (
                <option key={d.id} value={d.id} style={{ background: '#0f172a', color: '#f8fafc' }}>
                  {d.name} {d.id !== 'All' ? `(${d.region})` : ''}
                </option>
              ))}
            </select>
          </div>

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
                OFFICER • {selectedDistrict}
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
