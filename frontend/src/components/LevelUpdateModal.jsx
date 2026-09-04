import React, { useState } from 'react';
import { X, Save, AlertCircle, RefreshCw } from 'lucide-react';
import { getStatusColor } from '../utils/statusUtils';

export default function LevelUpdateModal({ tank, onClose, onSave }) {
  const [percentage, setPercentage] = useState(tank.percentage);
  const [loading, setLoading] = useState(false);

  if (!tank) return null;

  const computedLevel = Number(((percentage / 100) * tank.capacity).toFixed(2));

  // Determine status based on tank thresholds
  const norm = tank.thresholds?.normal ?? 70;
  const low = tank.thresholds?.low ?? 40;
  const warn = tank.thresholds?.warning ?? 20;

  let computedStatus = 'CRITICAL';
  if (percentage >= norm) computedStatus = 'NORMAL';
  else if (percentage >= low) computedStatus = 'LOW';
  else if (percentage >= warn) computedStatus = 'WARNING';

  const st = getStatusColor(computedStatus);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(tank._id, { percentage: Number(percentage) });
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to update tank level');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
              Official Water Level Updater
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              {tank.name} ({tank.location})
            </span>
          </div>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Preset Buttons for Quick Hackathon Demo */}
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              Quick Demo Presets:
            </span>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setPercentage(18)}
                className="btn-secondary"
                style={{ fontSize: '0.75rem', padding: '4px 10px', color: '#ef4444', borderColor: '#ef4444' }}
              >
                18% (CRITICAL)
              </button>
              <button
                type="button"
                onClick={() => setPercentage(25)}
                className="btn-secondary"
                style={{ fontSize: '0.75rem', padding: '4px 10px', color: '#f59e0b', borderColor: '#f59e0b' }}
              >
                25% (WARNING)
              </button>
              <button
                type="button"
                onClick={() => setPercentage(55)}
                className="btn-secondary"
                style={{ fontSize: '0.75rem', padding: '4px 10px', color: '#3b82f6', borderColor: '#3b82f6' }}
              >
                55% (LOW)
              </button>
              <button
                type="button"
                onClick={() => setPercentage(78)}
                className="btn-secondary"
                style={{ fontSize: '0.75rem', padding: '4px 10px', color: '#10b981', borderColor: '#10b981' }}
              >
                78% (NORMAL)
              </button>
            </div>
          </div>

          {/* Level Slider Input */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>Water Storage Level (%)</label>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: st.text }}>
                {percentage}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={percentage}
              onChange={(e) => setPercentage(Number(e.target.value))}
              style={{
                width: '100%',
                height: '10px',
                borderRadius: '5px',
                outline: 'none',
                accentColor: st.text,
                cursor: 'pointer'
              }}
            />
          </div>

          {/* Computed Stats Card */}
          <div style={{
            padding: '16px',
            background: 'rgba(15, 23, 42, 0.7)',
            borderRadius: '12px',
            border: `1px solid ${st.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Calculated Water Volume</div>
              <strong style={{ fontSize: '1.2rem', color: '#ffffff' }}>{computedLevel} MCM</strong>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Total Capacity: {tank.capacity} MCM</div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Predicted Status</div>
              <span className={`status-badge ${computedStatus.toLowerCase()}`}>
                {st.icon} {computedStatus}
              </span>
            </div>
          </div>

          {/* API Info */}
          <div style={{ fontSize: '0.75rem', color: '#64748b', background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '8px' }}>
            Sends request: <code>PATCH /api/tanks/{tank._id}/level</code> with <code>{`{ percentage: ${percentage} }`}</code>
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <RefreshCw size={16} className="spin-anim" /> : <Save size={16} />} Save & Update Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
