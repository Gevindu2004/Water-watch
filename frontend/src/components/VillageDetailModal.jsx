import React from 'react';
import { X, MapPin, Gauge, Droplets, Calendar, Users, AlertCircle, Shield } from 'lucide-react';

export default function VillageDetailModal({ village, isOpen, onClose }) {
  if (!isOpen || !village) return null;

  const tankPercent = village.tank?.waterLevelPercentage ?? 50;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #2B3E68',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#0D1527'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <MapPin size={22} color="#EF4444" />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F8FAFC' }}>
                  {village.villageName}
                </h3>
                <span className="badge badge-blue">{village.villageId}</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {village.division} Division, Polonnaruwa District
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {/* Priority Score Header Banner */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#0B1120',
            border: '1px solid #24355A',
            borderRadius: '10px',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Priority Status
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: village.priorityColor }}>
                {village.priorityBadge} (Rank #{village.rank})
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Total Score
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#F8FAFC' }}>
                {village.priorityScore} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 100</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '0.75rem',
            marginBottom: '1.5rem'
          }}>
            <div className="panel" style={{ padding: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                <Calendar size={13} />
                DAYS DRY
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F8FAFC', marginTop: '0.2rem' }}>
                {village.daysWithoutWater} days
              </div>
            </div>

            <div className="panel" style={{ padding: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                <Users size={13} />
                AFFECTED
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F8FAFC', marginTop: '0.2rem' }}>
                {village.affectedPeople} people
              </div>
            </div>

            <div className="panel" style={{ padding: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                <Gauge size={13} />
                TANK LEVEL
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: tankPercent <= 20 ? '#EF4444' : '#38BDF8', marginTop: '0.2rem' }}>
                {tankPercent}%
              </div>
            </div>

            <div className="panel" style={{ padding: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                <Droplets size={13} />
                LAST DELIVERY
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F8FAFC', marginTop: '0.2rem' }}>
                {village.daysSinceLastDelivery} days ago
              </div>
            </div>
          </div>

          {/* Integration Sources: Member 1 & Member 3 Data */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
              Cross-Member Data Telemetry
            </div>

            <div style={{
              background: '#0B1120',
              border: '1px solid #24355A',
              borderRadius: '10px',
              padding: '1rem'
            }}>
              {/* Member 1 info */}
              <div style={{ marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid #1E293B' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38BDF8', marginBottom: '0.25rem' }}>
                  Member 1 — Shortage Report & Alternative Sources
                </div>
                <div style={{ fontSize: '0.82rem', color: '#CBD5E1' }}>
                  <strong>Alternative Source Status: </strong>
                  <span className={`badge ${village.alternativeWaterSource === 'none' ? 'badge-critical' : 'badge-warning'}`}>
                    {village.alternativeWaterSource.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {village.alternativeSourceDetails || 'No additional notes provided in report.'}
                </div>
              </div>

              {/* Member 3 info */}
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38BDF8', marginBottom: '0.25rem' }}>
                  Member 3 — Reservoir & Tank Telemetry
                </div>
                <div style={{ fontSize: '0.82rem', color: '#CBD5E1' }}>
                  <strong>Tank Name: </strong>{village.tank?.tankName || 'N/A'} ({village.tank?.tankId})
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Capacity: {village.tank?.capacityLiters?.toLocaleString()} L • Current Level: {village.tank?.waterLevelPercentage}%
                </div>
              </div>
            </div>
          </div>

          {/* Scoring Factors Breakdown Table */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
              Detailed Scoring Formula Calculation
            </div>
            <div style={{ background: '#0B1120', border: '1px solid #24355A', borderRadius: '10px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <tbody>
                  {village.breakdown && Object.entries(village.breakdown).map(([k, item]) => (
                    <tr key={k} style={{ borderBottom: '1px solid #1B2844' }}>
                      <td style={{ padding: '0.5rem 0.75rem', color: '#E2E8F0' }}>{item.label}</td>
                      <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-muted)' }}>{item.formula}</td>
                      <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', fontWeight: 700, color: '#38BDF8' }}>
                        +{item.points} pts
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid #2B3E68',
          display: 'flex',
          justifyContent: 'flex-end',
          background: '#0D1527'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '8px',
              background: '#1E293B',
              color: '#F8FAFC',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
