import React from 'react';
import { Database, AlertOctagon, AlertTriangle, Truck, Users, Activity, FileText, ChevronRight } from 'lucide-react';
import { getStatusColor, formatTime } from '../utils/statusUtils';

export default function CommandDashboard({ summary, tanks, onSelectTank }) {
  if (!summary) {
    return <div className="glass-card" style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>Loading Command Center metrics...</div>;
  }

  const {
    tanksMonitored = 4,
    criticalTanks = 1,
    lowTanks = 1,
    activeShortages = 8,
    scheduledDeliveries = 5,
    criticalVillages = [],
    criticalTanksList = [],
    todayDeliveries = [],
    latestShortageReports = []
  } = summary;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Overview Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        {/* Tanks Monitored */}
        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #06b6d4' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Tanks Monitored</span>
            <Database size={20} color="#06b6d4" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginTop: '8px' }}>
            {tanksMonitored}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#38bdf8' }}>Major Polonnaruwa Reservoirs</span>
        </div>

        {/* Critical Tanks */}
        <div className="glass-card" style={{
          padding: '20px',
          borderLeft: '4px solid #ef4444',
          background: criticalTanks > 0 ? 'rgba(239, 68, 68, 0.08)' : undefined
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: '#f87171', fontWeight: 600, textTransform: 'uppercase' }}>Critical Tanks</span>
            <AlertOctagon size={20} color="#ef4444" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ef4444', marginTop: '8px' }}>
            {criticalTanks}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#fca5a5' }}>
            {criticalTanks > 0 ? 'Requires Immediate Action' : 'All Tanks Safe'}
          </span>
        </div>

        {/* Low Tanks */}
        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 600, textTransform: 'uppercase' }}>Low & Warning Tanks</span>
            <AlertTriangle size={20} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24', marginTop: '8px' }}>
            {lowTanks}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#fde68a' }}>Below 70% Capacity</span>
        </div>

        {/* Active Shortages */}
        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #a855f7' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: '#c084fc', fontWeight: 600, textTransform: 'uppercase' }}>Active Shortages</span>
            <Users size={20} color="#a855f7" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginTop: '8px' }}>
            {activeShortages}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#e9d5ff' }}>Resident Reports Logged</span>
        </div>

        {/* Scheduled Deliveries */}
        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600, textTransform: 'uppercase' }}>Scheduled Deliveries</span>
            <Truck size={20} color="#10b981" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginTop: '8px' }}>
            {scheduledDeliveries}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#a7f3d0' }}>Bowser Fleets Assigned</span>
        </div>
      </div>

      {/* Main Content Split Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '20px'
      }}>
        {/* Critical Tanks List Card */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertOctagon size={18} color="#ef4444" />
              Critical & Warning Reservoirs
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Live Status</span>
          </div>

          {criticalTanksList.length === 0 && (
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>No reservoirs currently in critical state.</p>
          )}

          {tanks.filter(t => t.status === 'CRITICAL' || t.status === 'WARNING').map(tank => {
            const st = getStatusColor(tank.status);
            return (
              <div
                key={tank._id}
                onClick={() => onSelectTank && onSelectTank(tank)}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: `1px solid ${st.border}`,
                  borderRadius: '12px',
                  padding: '14px',
                  marginBottom: '12px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{tank.name}</span>
                  <span className={`status-badge ${tank.status.toLowerCase()}`}>
                    {st.icon} {tank.status}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                    Water Level: <strong>{tank.percentage}%</strong> ({tank.currentLevel} / {tank.capacity} MCM)
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{formatTime(tank.lastUpdated)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Critical Villages Impacted */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} color="#f59e0b" />
              Critical Villages at Risk
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Impact Analysis</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {criticalVillages.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>No villages experiencing severe risk.</p>
            ) : (
              criticalVillages.map((v, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  borderRadius: '10px',
                  borderLeft: `4px solid ${v.riskLevel === 'CRITICAL' ? '#ef4444' : '#f59e0b'}`
                }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                      {v.riskLevel === 'CRITICAL' ? '🔴' : '🟠'} {v.name}
                    </span>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
                      Fed by: {v.tankName} ({v.tankStatus})
                    </p>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600 }}>
                    Pop: {v.population ? v.population.toLocaleString() : 'N/A'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bowser Deliveries & Shortage Feed */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={18} color="#10b981" />
              Today's Bowser Deliveries
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#10b981' }}>Member 2 API Sync</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {todayDeliveries.map((del, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                background: 'rgba(15, 23, 42, 0.5)',
                borderRadius: '8px',
                fontSize: '0.85rem'
              }}>
                <div>
                  <strong style={{ color: '#38bdf8' }}>{del.bowserId}</strong> → {del.targetVillage}
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Driver: {del.driverName}</div>
                </div>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  background: del.status === 'IN_TRANSIT' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                  color: del.status === 'IN_TRANSIT' ? '#60a5fa' : '#34d399'
                }}>
                  {del.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
