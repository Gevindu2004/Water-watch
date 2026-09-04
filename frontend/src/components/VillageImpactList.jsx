import React from 'react';
import { Home, Users, AlertCircle, Shield } from 'lucide-react';
import { getStatusColor } from '../utils/statusUtils';

export default function VillageImpactList({ tanks = [] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Home size={22} color="#38bdf8" />
            Community Impact & Nearby Villages Map
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
            Predefined village vulnerability mappings tied to tank storage levels
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px'
      }}>
        {tanks.map((tank) => {
          const st = getStatusColor(tank.status);

          return (
            <div key={tank._id} className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                  {tank.name}
                </h3>
                <span className={`status-badge ${tank.status.toLowerCase()}`}>
                  {st.icon} {tank.status} ({tank.percentage}%)
                </span>
              </div>

              <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '14px' }}>
                Nearby Dependent Villages & Risk Status:
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {tank.nearbyVillages && tank.nearbyVillages.length > 0 ? (
                  tank.nearbyVillages.map((village, idx) => {
                    const isCritical = village.riskLevel === 'CRITICAL';
                    const isWarning = village.riskLevel === 'WARNING';
                    const isLow = village.riskLevel === 'LOW';

                    return (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          background: isCritical
                            ? 'rgba(239, 68, 68, 0.12)'
                            : isWarning
                            ? 'rgba(245, 158, 11, 0.12)'
                            : 'rgba(15, 23, 42, 0.6)',
                          border: `1px solid ${
                            isCritical ? 'rgba(239, 68, 68, 0.4)' : isWarning ? 'rgba(245, 158, 11, 0.4)' : 'rgba(255, 255, 255, 0.08)'
                          }`,
                          borderRadius: '10px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '1.1rem' }}>
                            {isCritical ? '🔴' : isWarning ? '🟠' : isLow ? '🟡' : '🟢'}
                          </span>
                          <div>
                            <strong style={{ fontSize: '0.9rem', color: '#f8fafc' }}>{village.name}</strong>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                              Distance: {village.distanceKm || 'N/A'} km
                            </div>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#3b82f6',
                            color: '#ffffff'
                          }}>
                            {village.riskLevel || 'NORMAL'} RISK
                          </span>
                          {village.population && (
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                              Pop: {village.population.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>No nearby villages linked.</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
