import React from 'react';
import { X, MapPin, Edit3, ShieldAlert, History } from 'lucide-react';
import HistoryChart from './HistoryChart';
import { getStatusColor, generateAsciiBar, formatTime } from '../utils/statusUtils';

export default function TankDetailModal({ tank, onClose, onOpenUpdateModal }) {
  if (!tank) return null;

  const st = getStatusColor(tank.status);
  const asciiBar = generateAsciiBar(tank.percentage);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
                {tank.name}
              </h2>
              <span className={`status-badge ${tank.status.toLowerCase()}`}>
                {st.icon} {tank.status}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#94a3b8', marginTop: '2px' }}>
              <MapPin size={14} color="#38bdf8" />
              <span>{tank.location}</span>
              <span style={{ margin: '0 4px' }}>•</span>
              <span>Updated: {formatTime(tank.lastUpdated)}</span>
            </div>
          </div>

          <button onClick={onClose} className="btn-secondary" style={{ padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Stats Summary Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Storage Percentage</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: st.text }}>{tank.percentage}%</div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Current Storage</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>{tank.currentLevel} MCM</div>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Capacity: {tank.capacity} MCM</span>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Configured Thresholds</span>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '6px' }}>
              <div>🟢 Normal: ≥ {tank.thresholds?.normal || 70}%</div>
              <div>🔵 Low: ≥ {tank.thresholds?.low || 40}%</div>
              <div>🟠 Warning: ≥ {tank.thresholds?.warning || 20}%</div>
              <div>🔴 Critical: &lt; {tank.thresholds?.warning || 20}%</div>
            </div>
          </div>
        </div>

        {/* ASCII Visualizer Box */}
        <div className="ascii-level-box" style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>ASCII STORAGE GAUGE</div>
          <div style={{ fontSize: '1.4rem', color: st.text, fontWeight: 700, letterSpacing: '4px' }}>
            {asciiBar}
          </div>
        </div>

        {/* 7-Day History Recharts Component */}
        <div style={{ marginBottom: '20px' }}>
          <HistoryChart history={tank.history} tankName={tank.name} />
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenUpdateModal(tank);
            }}
            className="btn-primary"
          >
            <Edit3 size={16} /> Update Tank Water Level
          </button>
        </div>
      </div>
    </div>
  );
}
