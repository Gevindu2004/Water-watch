import React from 'react';
import { X, Bot, CheckCircle2, ShieldCheck, Cpu, AlertTriangle } from 'lucide-react';

export default function AiReasonModal({ isOpen, onClose, recommendation }) {
  if (!isOpen || !recommendation) return null;

  const {
    village = 'Siripura',
    priorityScore = 91,
    priority = 'CRITICAL',
    breakdown = {},
    explanation = '',
    aiMeta = {},
    capacity = 5000,
    recommendedBowser = 'WB-102'
  } = recommendation;

  const isFallback = aiMeta?.isFallback;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #2B3E68',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#0D1527'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              padding: '0.35rem',
              borderRadius: '8px',
              background: 'rgba(56, 189, 248, 0.15)'
            }}>
              <Bot size={20} color="#38BDF8" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F8FAFC' }}>
                Decision Explainability & AI Rationale
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Transparent 100-Point Rule Formula + Operational AI Briefing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ color: 'var(--text-muted)', padding: '0.4rem', borderRadius: '6px' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {/* Transparency Alert */}
          <div style={{
            background: 'rgba(2, 132, 199, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '10px',
            padding: '0.85rem 1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.65rem'
          }}>
            <ShieldCheck size={20} color="#38BDF8" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.8rem', color: '#BAE6FD', lineHeight: 1.4 }}>
              <strong>Transparent Architecture Guardrail: </strong>
              The AI model does NOT decide the raw score. Our backend rule-based engine scored{' '}
              <strong>{village} at {priorityScore}/100</strong> first. The AI layer strictly explains the operational factors to decision-makers.
            </div>
          </div>

          {/* Section 1: Rule-Based Breakdown Table */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-secondary)',
              marginBottom: '0.75rem'
            }}>
              1. Deterministic Scoring Breakdown (Max 100 Points)
            </div>

            <div style={{
              background: '#0B1120',
              border: '1px solid #24355A',
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: '#141E34', color: 'var(--text-secondary)', textAlign: 'left' }}>
                    <th style={{ padding: '0.65rem 0.85rem' }}>Indicator Factor</th>
                    <th style={{ padding: '0.65rem 0.85rem' }}>Observed Metric</th>
                    <th style={{ padding: '0.65rem 0.85rem' }}>Weight Logic</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>Score Awarded</th>
                  </tr>
                </thead>
                <tbody>
                  {breakdown && Object.entries(breakdown).map(([key, item], idx) => (
                    <tr
                      key={key}
                      style={{
                        borderTop: '1px solid #1B2844',
                        background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'
                      }}
                    >
                      <td style={{ padding: '0.65rem 0.85rem', fontWeight: 600, color: '#F1F5F9' }}>
                        {item.label}
                      </td>
                      <td style={{ padding: '0.65rem 0.85rem', color: '#94A3B8' }}>
                        <span className="data-pill">{item.value}</span>
                      </td>
                      <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        {item.formula}
                      </td>
                      <td style={{ padding: '0.65rem 0.85rem', textAlign: 'right', fontWeight: 700, color: '#38BDF8' }}>
                        {item.points} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>/ {item.max}</span>
                      </td>
                    </tr>
                  ))}
                  <tr style={{ borderTop: '2px solid #2B3E68', background: '#111B30' }}>
                    <td colSpan={3} style={{ padding: '0.75rem 0.85rem', fontWeight: 800, color: '#F8FAFC' }}>
                      TOTAL PRIORITY SCORE
                    </td>
                    <td style={{ padding: '0.75rem 0.85rem', textAlign: 'right', fontWeight: 900, fontSize: '1.05rem', color: '#EF4444' }}>
                      {priorityScore} / 100 ({priority})
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: AI Operational Narrative */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.75rem'
            }}>
              <div style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--text-secondary)'
              }}>
                2. AI Executive Briefing Narrative
              </div>
              <span style={{
                fontSize: '0.72rem',
                color: isFallback ? '#F59E0B' : '#10B981',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}>
                <Cpu size={12} />
                {isFallback ? 'Fallback Engine Active' : `Powered by ${aiMeta.model || 'Gemini AI'}`}
              </span>
            </div>

            <div style={{
              background: '#0B1120',
              border: '1px solid #24355A',
              borderRadius: '10px',
              padding: '1.25rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              color: '#CBD5E1',
              whiteSpace: 'pre-line',
              lineHeight: 1.6
            }}>
              {explanation}
            </div>

            {isFallback && aiMeta.fallbackReason && (
              <div style={{
                marginTop: '0.65rem',
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <AlertTriangle size={13} color="#F59E0B" />
                <span>Notice: {aiMeta.fallbackReason}</span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
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
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
