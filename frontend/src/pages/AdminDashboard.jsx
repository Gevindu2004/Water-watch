import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { adminService, tankService, reportService } from '../services/api';
import { 
  Server, 
  Layers, 
  AlertTriangle, 
  Truck, 
  CheckCircle2, 
  Users, 
  Activity,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  RefreshCw,
  Cpu
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalTanks: 4,
    criticalTanks: 1,
    activeShortages: 8,
    activeBowsers: 6,
    todayDeliveries: 12,
    criticalVillages: 2
  });
  const [criticalTanks, setCriticalTanks] = useState([]);
  const [criticalVillagesList, setCriticalVillagesList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await adminService.getDashboard();
      if (res.data) {
        setStats(res.data.stats || stats);
        setCriticalTanks(res.data.criticalTanks || []);
        setCriticalVillagesList(res.data.criticalVillages || []);
      }
    } catch (err) {
      console.warn("Using fallback demo dashboard data:", err);
      // Fallback fallback data if API returns mock
      setStats({
        totalTanks: 4,
        criticalTanks: 1,
        activeShortages: 8,
        activeBowsers: 6,
        todayDeliveries: 12,
        criticalVillages: 2
      });
      setCriticalTanks([
        { id: 'tnk-1', villageId: 'v-siripura', name: 'Siripura Central Storage', levelPercentage: 18, status: 'CRITICAL', capacity: 50000, currentVolume: 9000 }
      ]);
      setCriticalVillagesList([
        { villageId: 'v-siripura', name: 'Siripura', priorityScore: 91, status: 'CRITICAL', daysWithoutWater: 4, population: 4200 },
        { villageId: 'v-medirigiriya', name: 'Medirigiriya Block B', priorityScore: 78, status: 'HIGH', daysWithoutWater: 3, population: 6100 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div style={{ padding: '2rem 2rem 4rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Top Banner Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ 
              background: 'rgba(139, 92, 246, 0.2)', 
              color: '#c084fc', 
              border: '1px solid rgba(139, 92, 246, 0.4)',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              System Monitoring Mode
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              Polonnaruwa Regional Command
            </span>
          </div>
          <h1 className="gradient-text" style={{ fontSize: '2.25rem', fontWeight: '800', marginTop: '0.5rem', marginBottom: '0.25rem' }}>
            ADMIN CONTROL CENTER
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Real-time tank levels, active bowser dispatches, drought alerts & system analytics.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={fetchDashboardData}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh Data
          </button>
          <NavLink to="/admin/smart-priority" className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(135deg, #00f2fe, #4facfe)' }}>
            <Cpu size={16} />
            AI Priority Engine
          </NavLink>
        </div>
      </div>

      {/* 6 Key Stat Cards Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', 
        gap: '1.25rem', 
        marginBottom: '2rem' 
      }}>
        {/* Metric 1: Total Tanks */}
        <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600' }}>
            <span>Total Tanks</span>
            <Layers size={18} color="#3b82f6" />
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: '800', color: '#f8fafc', margin: '0.5rem 0' }}>
            {stats.totalTanks}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Monitored reservoirs</div>
        </div>

        {/* Metric 2: Critical Tanks */}
        <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600' }}>
            <span>Critical Tanks</span>
            <AlertTriangle size={18} color="#ef4444" />
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: '800', color: '#f87171', margin: '0.5rem 0' }}>
            {stats.criticalTanks}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: '600' }}>Below 20% capacity</div>
        </div>

        {/* Metric 3: Active Shortages */}
        <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600' }}>
            <span>Active Shortages</span>
            <TrendingDown size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: '800', color: '#fbbf24', margin: '0.5rem 0' }}>
            {stats.activeShortages}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Unfulfilled resident requests</div>
        </div>

        {/* Metric 4: Active Bowsers */}
        <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #06b6d4' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600' }}>
            <span>Active Bowsers</span>
            <Truck size={18} color="#06b6d4" />
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: '800', color: '#22d3ee', margin: '0.5rem 0' }}>
            {stats.activeBowsers}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>In field operation</div>
        </div>

        {/* Metric 5: Today's Deliveries */}
        <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600' }}>
            <span>Today's Deliveries</span>
            <CheckCircle2 size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: '800', color: '#34d399', margin: '0.5rem 0' }}>
            {stats.todayDeliveries}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#34d399' }}>Dispatched & Completed</div>
        </div>

        {/* Metric 6: Critical Villages */}
        <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #ec4899' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600' }}>
            <span>Critical Villages</span>
            <Users size={18} color="#ec4899" />
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: '800', color: '#f472b6', margin: '0.5rem 0' }}>
            {stats.criticalVillages}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#f472b6', fontWeight: '600' }}>Require Immediate Action</div>
        </div>
      </div>

      {/* Main Grid Content: Alert Section & Critical Villages */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Critical Tanks Alert Box */}
        <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={20} color="#ef4444" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc', margin: 0 }}>
                Critical Tank Water Levels
              </h3>
            </div>
            <NavLink to="/admin/tanks" className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }}>
              Manage Tanks <ArrowRight size={14} />
            </NavLink>
          </div>

          {criticalTanks.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
              <ShieldCheck size={36} color="#10b981" style={{ margin: '0 auto 0.5rem auto' }} />
              <p>All monitored tanks are currently operating above 20% threshold.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {criticalTanks.map((tank) => (
                <div 
                  key={tank.id || tank._id}
                  style={{ 
                    background: 'rgba(239, 68, 68, 0.1)', 
                    borderRadius: '0.5rem', 
                    padding: '1rem', 
                    border: '1px solid rgba(239, 68, 68, 0.3)' 
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: '700', color: '#f8fafc' }}>{tank.name}</span>
                    <span className="badge badge-critical">
                      {tank.levelPercentage}% CRITICAL
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', margin: '0.5rem 0' }}>
                    <div style={{ width: `${tank.levelPercentage}%`, background: '#ef4444', height: '100%', borderRadius: '4px' }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8' }}>
                    <span>Current Volume: {tank.currentVolume?.toLocaleString() || 9000} L</span>
                    <span>Total Capacity: {tank.capacity?.toLocaleString() || 50000} L</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Critical Villages Table */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={20} color="#ec4899" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc', margin: 0 }}>
                High-Urgency Critical Villages
              </h3>
            </div>
            <NavLink to="/admin/analytics" className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }}>
              View Analytics <ArrowRight size={14} />
            </NavLink>
          </div>

          <div className="table-responsive">
            <table className="table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>VILLAGE</th>
                  <th>POPULATION</th>
                  <th>NO WATER</th>
                  <th>PRIORITY SCORE</th>
                </tr>
              </thead>
              <tbody>
                {criticalVillagesList.map((village, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: '700', color: '#f8fafc' }}>{village.name}</td>
                    <td>{village.population?.toLocaleString()} residents</td>
                    <td style={{ color: '#f87171', fontWeight: '600' }}>{village.daysWithoutWater} days</td>
                    <td>
                      <span className={`badge ${village.priorityScore >= 85 ? 'badge-critical' : 'badge-high'}`}>
                        {village.priorityScore} / 100
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Admin Quick Action Navigation Hub */}
      <div className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1))' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc', marginBottom: '1rem' }}>
          Admin Quick Actions & Navigation
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <NavLink to="/admin/tanks" className="btn btn-secondary" style={{ display: 'flex', justifyContent: 'flex-start', gap: '0.75rem', padding: '0.85rem 1rem' }}>
            <Layers size={18} color="#3b82f6" />
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>Tank Management</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Update capacity & thresholds</div>
            </div>
          </NavLink>

          <NavLink to="/admin/users" className="btn btn-secondary" style={{ display: 'flex', justifyContent: 'flex-start', gap: '0.75rem', padding: '0.85rem 1rem' }}>
            <Users size={18} color="#10b981" />
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>User Management</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Manage admin & officer roles</div>
            </div>
          </NavLink>

          <NavLink to="/admin/analytics" className="btn btn-secondary" style={{ display: 'flex', justifyContent: 'flex-start', gap: '0.75rem', padding: '0.85rem 1rem' }}>
            <Activity size={18} color="#ec4899" />
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>System Analytics</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Recharts history & charts</div>
            </div>
          </NavLink>

          <NavLink to="/admin/smart-priority" className="btn btn-secondary" style={{ display: 'flex', justifyContent: 'flex-start', gap: '0.75rem', padding: '0.85rem 1rem' }}>
            <Cpu size={18} color="#00f2fe" />
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>AI Priority Dispatch</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Member 4 dispatch matrix</div>
            </div>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
