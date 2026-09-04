import React from 'react';
import { Droplets, Bot, RefreshCw, Activity, ShieldCheck } from 'lucide-react';

export default function Header({ aiHealth, onResetDemo, refreshing }) {
  const isFallback = aiHealth?.aiService?.includes('fallback_mode');

  return (
    <header style={{
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      paddingBottom: '1.5rem',
      marginBottom: '2rem',
      borderBottom: '1px solid var(--border-color)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
        }}>
          <Droplets size={26} color="#FFFFFF" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#F8FAFC' }}>
              WaterWatch <span style={{ color: '#38BDF8' }}>Polonnaruwa</span>
            </h1>
            <span className="badge badge-blue">Member 4 Intelligence</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Smart Water Priority & Next-Bowser Recommendation Engine • AI Decision Support
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        {/* AI Engine Status Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 0.8rem',
          borderRadius: '8px',
          background: isFallback ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.12)',
          border: `1px solid ${isFallback ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
          fontSize: '0.8rem'
        }}>
          <Bot size={16} color={isFallback ? '#F59E0B' : '#10B981'} />
          <div>
            <div style={{ fontWeight: 600, color: isFallback ? '#FCD34D' : '#86EFAC' }}>
              {isFallback ? 'Deterministic Fallback Active' : 'Gemini AI Online'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {aiHealth?.model || 'Rule Template v1'}
            </div>
          </div>
        </div>

        {/* Demo Scenario Reset */}
        <button
          onClick={onResetDemo}
          disabled={refreshing}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.55rem 1rem',
            borderRadius: '8px',
            background: '#1A294B',
            color: '#E2E8F0',
            border: '1px solid #2B3E68',
            fontSize: '0.82rem',
            fontWeight: 600,
            transition: 'all 0.2s',
            opacity: refreshing ? 0.7 : 1
          }}
          title="Reset data to official Siripura / Bakamuna / Welikanda hackathon demo scenario"
        >
          <RefreshCw size={15} className={refreshing ? 'critical-pulse' : ''} />
          Reset Demo Scenario
        </button>
      </div>
    </header>
  );
}
