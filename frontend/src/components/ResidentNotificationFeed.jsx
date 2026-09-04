import React from 'react';
import { Radio, Bell, CheckCircle2, Clock, Smartphone, RefreshCw } from 'lucide-react';

export default function ResidentNotificationFeed({ notifications = [], onRefresh }) {
  return (
    <div className="panel" style={{ height: '100%' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            padding: '0.35rem',
            borderRadius: '8px',
            background: 'rgba(56, 189, 248, 0.15)'
          }}>
            <Smartphone size={18} color="#38BDF8" />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#F8FAFC' }}>
              Resident Broadcast Alert Feed
            </h3>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              Simulated Outbound Mobile App & SMS Notifications
            </p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          style={{ color: 'var(--text-muted)', padding: '0.3rem', borderRadius: '6px' }}
          title="Refresh notification stream"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {notifications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
          No resident notifications dispatched yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '420px', overflowY: 'auto' }}>
          {notifications.map((n, idx) => (
            <div
              key={n._id || idx}
              style={{
                background: '#0B1120',
                border: '1px solid #1E293B',
                borderLeft: '3px solid #38BDF8',
                borderRadius: '8px',
                padding: '0.85rem 1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38BDF8' }}>
                  {n.title}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {n.sentAt ? new Date(n.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                </span>
              </div>

              <div style={{ fontSize: '0.8rem', color: '#E2E8F0', lineHeight: 1.4, marginBottom: '0.4rem' }}>
                {n.message}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                <span>📍 {n.villageName}</span>
                <span>📡 {n.channel}</span>
                {n.eta && <span>⏰ ETA: {n.eta}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
