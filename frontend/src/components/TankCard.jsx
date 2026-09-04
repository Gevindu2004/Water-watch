import React from 'react';
import { Droplet, Edit3, Settings, TrendingUp, MapPin, Clock } from 'lucide-react';
import { getStatusColor, generateAsciiBar, formatTime } from '../utils/statusUtils';

export default function TankCard({ tank, onOpenUpdateModal, onOpenConfigModal, onSelectTank }) {
  const {
    name,
    location,
    capacity,
    currentLevel,
    percentage,
    status,
    lastUpdated,
    nearbyVillages = []
  } = tank;

  const st = getStatusColor(status);
  const asciiBar = generateAsciiBar(percentage);

  return (
    <div
      className="glass-card"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative top accent glow line */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '4px',
        background: st.text,
        boxShadow: `0 0 12px ${st.text}`
      }} />

      <div>
        {/* Header: Name & Status */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
              <MapPin size={13} color="#38bdf8" />
              <span>{location}</span>
            </div>
          </div>

          <span className={`status-badge ${status.toLowerCase()}`}>
            {st.icon} {status}
          </span>
        </div>

        {/* Big Percentage & Volume display */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '12px' }}>
          <span style={{ fontSize: '2.8rem', fontWeight: 900, color: st.text, fontFamily: 'Outfit, sans-serif' }}>
            {percentage}%
          </span>
          <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
            ({currentLevel} / {capacity} MCM)
          </span>
        </div>

        {/* Visual ASCII Box (Prompt Format Requirement) */}
        <div className="ascii-level-box" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
            <span>ASCII LEVEL VISUALIZER</span>
            <span style={{ color: st.text }}>{percentage}%</span>
          </div>
          <div style={{ fontSize: '1.2rem', color: st.text, fontWeight: 700, letterSpacing: '3px' }}>
            {asciiBar}
          </div>
        </div>

        {/* Animated Liquid Fill Bar */}
        <div style={{ marginBottom: '16px' }}>
          <div className="level-bar-container">
            <div className={`level-bar-fill ${status.toLowerCase()}`} style={{ width: `${percentage}%` }} />
          </div>
        </div>

        {/* Nearby Villages Summary */}
        {nearbyVillages.length > 0 && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '10px',
            padding: '10px 12px',
            marginBottom: '16px'
          }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              Nearby Villages Impact:
            </span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
              {nearbyVillages.map((v, i) => (
                <span key={i} style={{
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.06)',
                  color: v.riskLevel === 'CRITICAL' ? '#f87171' : v.riskLevel === 'WARNING' ? '#fbbf24' : '#cbd5e1'
                }}>
                  {v.riskLevel === 'CRITICAL' ? '🔴' : v.riskLevel === 'WARNING' ? '🟠' : '🟡'} {v.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Meta & Actions */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b', marginBottom: '14px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={13} /> Updated: {formatTime(lastUpdated)}
          </span>
          <span>Thresholds: {tank.thresholds?.warning || 20}% / {tank.thresholds?.low || 40}% / {tank.thresholds?.normal || 70}%</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button
            onClick={() => onOpenUpdateModal(tank)}
            className="btn-primary"
            style={{ padding: '8px 12px', fontSize: '0.8rem', justifyContent: 'center' }}
          >
            <Edit3 size={14} /> Update Level
          </button>

          <button
            onClick={() => onSelectTank(tank)}
            className="btn-secondary"
            style={{ padding: '8px 12px', fontSize: '0.8rem', justifyContent: 'center' }}
          >
            <TrendingUp size={14} /> View History
          </button>
        </div>
      </div>
    </div>
  );
}
