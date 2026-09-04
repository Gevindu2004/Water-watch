import React from 'react';
import { MapPin, Truck, Clock, Droplets, Info, Send, ShieldAlert, Sparkles } from 'lucide-react';

export default function NextRecommendationCard({
  recommendation,
  onOpenReason,
  onOpenDispatch,
  loading
}) {
  if (loading) {
    return (
      <div className="panel" style={{ padding: '2.5rem', textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ color: '#38BDF8', fontSize: '1rem', fontWeight: 600 }}>
          Analyzing water shortage reports & calculating optimal bowser allocation...
        </div>
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="panel" style={{ padding: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>No shortage areas currently require emergency bowser dispatch.</p>
      </div>
    );
  }

  const {
    village = 'Siripura',
    priorityScore = 91,
    priority = 'CRITICAL',
    recommendedBowser = 'WB-102',
    capacity = 5000,
    reason = '',
    expectedImpact = '',
    bowserDetails = {},
    tank = {},
    urgencyFactors = []
  } = recommendation;

  const eta = bowserDetails?.estimatedArrivalTime || '2:15 PM';

  return (
    <div
      className="panel critical-pulse"
      style={{
        background: 'linear-gradient(145deg, #131E38 0%, #0F172A 100%)',
        border: '1px solid #3B82F6',
        borderRadius: '16px',
        padding: '1.75rem 2rem',
        marginBottom: '2.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Subtle Accent */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '180px',
        height: '180px',
        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      {/* Card Header Tag */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'rgba(56, 189, 248, 0.18)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            color: '#38BDF8',
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}>
            <Sparkles size={13} />
            AI Decision Support • Next Recommendation
          </span>
          <span className="badge badge-critical">
            🔴 {priority}
          </span>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Rank 1 Priority Target
        </div>
      </div>

      {/* Main Grid: Village, Score, Bowser, Capacity, ETA */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        alignItems: 'center',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
        marginBottom: '1.5rem'
      }}>
        {/* Village Destination */}
        <div>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem' }}>
            Recommended Destination
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={24} color="#EF4444" />
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              {village}
            </span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '1.8rem' }}>
            Medirigiriya Division
          </div>
        </div>

        {/* Priority Score */}
        <div>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem' }}>
            Priority Score
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#EF4444' }}>
              {priorityScore}
            </span>
            <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ 100</span>
          </div>
          {/* Progress Bar */}
          <div style={{ width: '100%', height: '7px', background: '#24355A', borderRadius: '4px', marginTop: '0.25rem', overflow: 'hidden' }}>
            <div style={{ width: `${priorityScore}%`, height: '100%', background: 'linear-gradient(90deg, #F59E0B, #EF4444)', borderRadius: '4px' }} />
          </div>
        </div>

        {/* Recommended Bowser */}
        <div>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem' }}>
            Recommended Bowser
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              padding: '0.35rem',
              borderRadius: '8px',
              background: 'rgba(56, 189, 248, 0.15)'
            }}>
              <Truck size={22} color="#38BDF8" />
            </div>
            <div>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#F8FAFC' }}>
                {recommendedBowser}
              </span>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {bowserDetails?.licensePlate || 'Central Depot'}
              </div>
            </div>
          </div>
        </div>

        {/* Capacity & ETA */}
        <div>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem' }}>
            Capacity & Arrival
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38BDF8' }}>
                {capacity.toLocaleString()} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>L</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Capacity</div>
            </div>
            <div style={{ borderLeft: '1px solid #283C66', paddingLeft: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '1.3rem', fontWeight: 800, color: '#F8FAFC' }}>
                <Clock size={16} color="#F59E0B" />
                {eta}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Estimated ETA</div>
            </div>
          </div>
        </div>
      </div>

      {/* Reason Preview & Urgency Factors */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{ maxWidth: '700px' }}>
          <div style={{ fontSize: '0.9rem', color: '#E2E8F0', marginBottom: '0.5rem', lineHeight: 1.4 }}>
            <strong style={{ color: '#FCA5A5' }}>Decision Reason: </strong>
            {reason}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {urgencyFactors.map((f, i) => (
              <span key={i} className="data-pill" style={{ borderColor: 'rgba(239, 68, 68, 0.35)', color: '#FCA5A5' }}>
                • {f}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons: [ VIEW REASON ] and [ DISPATCH BOWSER ] */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button
            onClick={onOpenReason}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              borderRadius: '10px',
              background: '#1E293B',
              border: '1px solid #3B82F6',
              color: '#38BDF8',
              fontSize: '0.88rem',
              fontWeight: 700,
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
          >
            <Info size={17} />
            VIEW REASON
          </button>

          <button
            onClick={onOpenDispatch}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.4rem',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
              border: '1px solid #38BDF8',
              color: '#FFFFFF',
              fontSize: '0.88rem',
              fontWeight: 800,
              letterSpacing: '0.02em',
              transition: 'all 0.2s',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.45)'
            }}
          >
            <Send size={17} />
            DISPATCH BOWSER
          </button>
        </div>
      </div>
    </div>
  );
}
