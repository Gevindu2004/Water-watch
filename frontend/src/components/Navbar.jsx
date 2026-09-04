import React from 'react';
import { Droplets, ShieldAlert, RefreshCw, Activity } from 'lucide-react';

export default function Navbar({ onRefresh, isRefreshing, activeTab, setActiveTab }) {
  return (
    <header className="glass-card" style={{ borderRadius: '0 0 20px 20px', padding: '16px 28px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
            padding: '10px',
            borderRadius: '12px',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Droplets size={26} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(90deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              WATERWATCH POLONNARUWA
            </h1>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={13} color="#10b981" />
              Real-time Tank Monitoring & Water Resource Command Dashboard
            </p>
          </div>
        </div>

        {/* Tab Switcher & Refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '4px', borderRadius: '12px', display: 'flex', gap: '4px' }}>
            <button
              onClick={() => setActiveTab('command')}
              className={activeTab === 'command' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '6px 14px', fontSize: '0.85rem' }}
            >
              Command Center
            </button>
            <button
              onClick={() => setActiveTab('tanks')}
              className={activeTab === 'tanks' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '6px 14px', fontSize: '0.85rem' }}
            >
              Tank Grid & History
            </button>
            <button
              onClick={() => setActiveTab('impact')}
              className={activeTab === 'impact' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '6px 14px', fontSize: '0.85rem' }}
            >
              Community Impact
            </button>
          </div>

          <button
            onClick={onRefresh}
            className="btn-secondary"
            disabled={isRefreshing}
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            title="Sync Data"
          >
            <RefreshCw size={15} className={isRefreshing ? 'spin-anim' : ''} />
            Sync
          </button>
        </div>
      </div>
    </header>
  );
}
