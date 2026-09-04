import React from 'react';
import { NavLink } from 'react-router-dom';
import { Truck, Droplet, Users, Code, Calendar } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-content">
        <NavLink to="/" className="brand-logo">
          <div className="brand-icon-wrapper">
            <Truck size={22} />
          </div>
          <div>
            <div className="brand-title">WaterWatch Polonnaruwa</div>
            <div className="brand-subtitle">Member 2: Bowser & Delivery Operations</div>
          </div>
        </NavLink>

        <ul className="nav-links">
          <li>
            <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Calendar size={16} />
              <span>Deliveries</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/bowsers" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Truck size={16} />
              <span>Bowser Fleet</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/resident-preview" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Users size={16} />
              <span>Resident View</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/api-docs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Code size={16} />
              <span>API Specs</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
