import React from 'react';
import { PlayCircle, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function DemoBar({ onRunStep18, onRunStep25, onResetDemo }) {
  return (
    <div className="glass-card" style={{
      padding: '14px 20px',
      marginBottom: '24px',
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))',
      border: '1px solid rgba(56, 189, 248, 0.25)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <PlayCircle size={22} color="#38bdf8" />
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.05em' }}>
            HACKATHON DEMO SCENARIO EVALUATOR
          </span>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
            Test dynamic status triggers and live alerts for Minneriya Tank
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <button
          onClick={onRunStep18}
          className="btn-secondary"
          style={{
            fontSize: '0.8rem',
            padding: '6px 12px',
            borderColor: 'rgba(239, 68, 68, 0.4)',
            color: '#f87171',
            background: 'rgba(239, 68, 68, 0.1)'
          }}
        >
          <AlertTriangle size={14} />
          1. Set Minneriya to 18% (CRITICAL)
        </button>

        <button
          onClick={onRunStep25}
          className="btn-secondary"
          style={{
            fontSize: '0.8rem',
            padding: '6px 12px',
            borderColor: 'rgba(245, 158, 11, 0.4)',
            color: '#fbbf24',
            background: 'rgba(245, 158, 11, 0.1)'
          }}
        >
          <ShieldCheck size={14} />
          2. Update Minneriya to 25% (WARNING)
        </button>

        <button
          onClick={onResetDemo}
          className="btn-secondary"
          style={{ fontSize: '0.8rem', padding: '6px 12px' }}
        >
          <RotateCcw size={14} />
          Reset Demo Data
        </button>
      </div>
    </div>
  );
}
