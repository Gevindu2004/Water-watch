import React from 'react';
import { AlertOctagon, Bell, ShieldAlert, ArrowRight } from 'lucide-react';

export default function AlertsBanner({ alerts, onSelectTank }) {
  if (!alerts || !alerts.tanks || alerts.tanks.length === 0) {
    return null;
  }

  const criticalTanks = alerts.tanks.filter(t => t.status === 'CRITICAL');
  const warningTanks = alerts.tanks.filter(t => t.status === 'WARNING');

  if (criticalTanks.length === 0 && warningTanks.length === 0) {
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
      {criticalTanks.map((tank) => (
        <div
          key={tank._id}
          className="glass-card"
          style={{
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25), rgba(15, 23, 42, 0.95))',
            border: '2px solid rgba(239, 68, 68, 0.7)',
            boxShadow: '0 0 25px rgba(239, 68, 68, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{
              background: '#ef4444',
              padding: '12px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(239, 68, 68, 0.6)'
            }}>
              <AlertOctagon size={28} color="#ffffff" />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  color: '#f87171',
                  background: 'rgba(239, 68, 68, 0.2)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  textTransform: 'uppercase'
                }}>
                  🚨 CRITICAL WATER ALERT
                </span>
                <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                  GET /api/tanks/alerts
                </span>
              </div>

              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', margin: '4px 0 6px 0' }}>
                {tank.name}
              </h2>

              <p style={{ fontSize: '0.9rem', color: '#fca5a5', margin: 0 }}>
                Current level: <strong style={{ color: '#ffffff', fontSize: '1.05rem' }}>{tank.percentage}%</strong> ({tank.currentLevel} / {tank.capacity} MCM)
                <span style={{ margin: '0 8px', opacity: 0.5 }}>|</span>
                Status: <span className="status-badge critical" style={{ verticalAlign: 'middle' }}>CRITICAL</span>
              </p>

              <div style={{
                marginTop: '10px',
                padding: '8px 12px',
                background: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '8px',
                fontSize: '0.82rem',
                color: '#fef2f2',
                borderLeft: '3px solid #ef4444'
              }}>
                📢 <strong>Directive for Officials:</strong> Officials should monitor nearby communities ({tank.nearbyVillages?.map(v => v.name).join(', ') || 'Siripura, Bakamuna'}). Bowser emergency dispatch advised.
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectTank && onSelectTank(tank)}
            className="btn-danger"
            style={{ padding: '10px 18px', fontSize: '0.85rem' }}
          >
            Manage Tank & Update Level <ArrowRight size={16} />
          </button>
        </div>
      ))}

      {warningTanks.map((tank) => (
        <div
          key={tank._id}
          className="glass-card"
          style={{
            padding: '16px 20px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(15, 23, 42, 0.9))',
            border: '1px solid rgba(245, 158, 11, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Bell size={22} color="#fbbf24" />
            <div>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fbbf24' }}>
                ⚠️ WARNING ALERT: {tank.name} at {tank.percentage}%
              </span>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: 0 }}>
                Reservoir water level below warning threshold (39%). Pre-emptive water distribution advised.
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectTank && onSelectTank(tank)}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', borderColor: 'rgba(245, 158, 11, 0.4)', color: '#fbbf24' }}
          >
            Inspect Tank
          </button>
        </div>
      ))}
    </div>
  );
}
