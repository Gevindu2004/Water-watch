import React from 'react';
import { AlertOctagon, AlertTriangle, Truck, Users } from 'lucide-react';

export default function SummaryCards({ summary, bowsersCount, availableBowsersCount }) {
  const cards = [
    {
      label: 'Critical Areas',
      value: summary?.criticalAreas ?? 2,
      subtext: 'Immediate bowser dispatch required',
      icon: AlertOctagon,
      badgeColor: '#EF4444',
      badgeBg: 'rgba(239, 68, 68, 0.15)',
      borderColor: 'rgba(239, 68, 68, 0.35)',
      indicator: '🚨 Critical'
    },
    {
      label: 'Warning Areas',
      value: summary?.warningAreas ?? 3,
      subtext: 'High shortage priority (within shift)',
      icon: AlertTriangle,
      badgeColor: '#F59E0B',
      badgeBg: 'rgba(245, 158, 11, 0.15)',
      borderColor: 'rgba(245, 158, 11, 0.35)',
      indicator: '🟠 Warning'
    },
    {
      label: 'Available Bowsers',
      value: `${availableBowsersCount ?? 2} / ${bowsersCount ?? 3}`,
      subtext: 'Ready for emergency deployment',
      icon: Truck,
      badgeColor: '#38BDF8',
      badgeBg: 'rgba(56, 189, 248, 0.15)',
      borderColor: 'rgba(56, 189, 248, 0.35)',
      indicator: '🚛 Fleet Ready'
    },
    {
      label: 'People Affected',
      value: (summary?.totalPeopleAffected ?? 610).toLocaleString(),
      subtext: 'Across 5 monitored Grama Niladhari divisions',
      icon: Users,
      badgeColor: '#A78BFA',
      badgeBg: 'rgba(167, 139, 250, 0.15)',
      borderColor: 'rgba(167, 139, 250, 0.35)',
      indicator: '👥 Population'
    }
  ];

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.85rem'
      }}>
        <h2 style={{
          fontSize: '0.85rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--text-secondary)'
        }}>
          Smart Water Operations Overview
        </h2>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Polonnaruwa District Emergency Grid
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem'
      }}>
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className="panel"
              style={{
                borderLeft: `4px solid ${c.badgeColor}`,
                background: 'var(--bg-card)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {c.label}
                </span>
                <div style={{
                  padding: '0.4rem',
                  borderRadius: '8px',
                  background: c.badgeBg
                }}>
                  <Icon size={18} color={c.badgeColor} />
                </div>
              </div>

              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#F8FAFC', lineHeight: 1.1, marginBottom: '0.35rem' }}>
                {c.value}
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {c.subtext}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
