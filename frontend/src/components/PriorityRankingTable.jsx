import React from 'react';
import { ChevronRight, Droplet, Users, Calendar, Shield, Gauge } from 'lucide-react';

export default function PriorityRankingTable({ priorities, onSelectVillage, selectedVillageId }) {
  if (!priorities || priorities.length === 0) {
    return (
      <div className="panel" style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>No active shortage reports logged in system.</p>
      </div>
    );
  }

  return (
    <div className="panel" style={{ marginBottom: '2rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#F8FAFC' }}>
            Priority Areas Ranking
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Real-time multi-criteria shortage ranking for Polonnaruwa regional allocation
          </p>
        </div>
        <span className="badge badge-blue">
          {priorities.length} Monitored Sectors
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {priorities.map((village) => {
          const isSelected = selectedVillageId === village.villageId;
          const isRank1 = village.rank === 1;

          let badgeClass = 'badge-low';
          let borderAccent = '#10B981';
          let dot = '🟢';

          if (village.priority === 'CRITICAL') {
            badgeClass = 'badge-critical';
            borderAccent = '#EF4444';
            dot = '🔴';
          } else if (village.priority === 'WARNING') {
            badgeClass = 'badge-warning';
            borderAccent = '#F59E0B';
            dot = '🟠';
          } else if (village.priority === 'MODERATE') {
            badgeClass = 'badge-moderate';
            borderAccent = '#EAB308';
            dot = '🟡';
          }

          const tankPercent = village.tank?.waterLevelPercentage ?? 50;

          return (
            <div
              key={village.villageId}
              onClick={() => onSelectVillage(village.villageId)}
              style={{
                background: isSelected ? '#162444' : '#0F172A',
                border: `1px solid ${isSelected ? '#3B82F6' : '#1E293B'}`,
                borderLeft: `4px solid ${borderAccent}`,
                borderRadius: '10px',
                padding: '1rem 1.25rem',
                display: 'grid',
                gridTemplateColumns: 'auto 1.8fr 1fr 1fr 1fr 1fr auto',
                gap: '1rem',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {/* Rank */}
              <div style={{
                fontSize: '1.1rem',
                fontWeight: 800,
                color: isRank1 ? '#F8FAFC' : 'var(--text-muted)',
                width: '32px'
              }}>
                #{village.rank}
              </div>

              {/* Village & Status */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span>{dot}</span>
                  <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#F8FAFC' }}>
                    {village.villageName}
                  </span>
                  {village.status === 'dispatched' && (
                    <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>
                      Bowser Dispatched
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '1.6rem' }}>
                  {village.division} Division
                </div>
              </div>

              {/* Priority Score */}
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Priority Score
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: borderAccent }}>
                    {village.priorityScore}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ 100</span>
                  <span className={`badge ${badgeClass}`} style={{ marginLeft: '0.4rem', fontSize: '0.65rem' }}>
                    {village.priority}
                  </span>
                </div>
              </div>

              {/* Days Without Water */}
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Days Without Water
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.95rem', fontWeight: 700, color: '#E2E8F0' }}>
                  <Calendar size={14} color="#94A3B8" />
                  {village.daysWithoutWater} {village.daysWithoutWater === 1 ? 'day' : 'days'}
                </div>
              </div>

              {/* People Affected */}
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  People Affected
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.95rem', fontWeight: 700, color: '#E2E8F0' }}>
                  <Users size={14} color="#94A3B8" />
                  {village.affectedPeople} residents
                </div>
              </div>

              {/* Tank Level */}
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Tank Level
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Gauge size={14} color={tankPercent <= 20 ? '#EF4444' : '#38BDF8'} />
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: tankPercent <= 20 ? '#EF4444' : '#38BDF8' }}>
                    {tankPercent}%
                  </span>
                </div>
                <div style={{ width: '80px', height: '4px', background: '#1E293B', borderRadius: '2px', marginTop: '3px' }}>
                  <div style={{
                    width: `${tankPercent}%`,
                    height: '100%',
                    background: tankPercent <= 20 ? '#EF4444' : '#38BDF8',
                    borderRadius: '2px'
                  }} />
                </div>
              </div>

              {/* Arrow */}
              <div style={{ color: 'var(--text-muted)' }}>
                <ChevronRight size={18} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
