import React, { useState } from 'react';
import { X, Send, Truck, CheckCircle, Clock, ShieldCheck, Radio } from 'lucide-react';

export default function DispatchApprovalModal({
  isOpen,
  onClose,
  recommendation,
  availableBowsers = [],
  onConfirmDispatch
}) {
  if (!isOpen || !recommendation) return null;

  const [selectedBowserId, setSelectedBowserId] = useState(recommendation.recommendedBowser || 'WB-102');
  const [officerName, setOfficerName] = useState('Regional Water Authority Officer');
  const [targetEta, setTargetEta] = useState(recommendation.bowserDetails?.estimatedArrivalTime || '2:15 PM');
  const [submitting, setSubmitting] = useState(false);

  const activeBowser = availableBowsers.find(b => b.bowserId === selectedBowserId) || recommendation.bowserDetails;

  const handleDispatch = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onConfirmDispatch({
        villageId: recommendation.villageId,
        villageName: recommendation.village,
        bowserId: selectedBowserId,
        capacity: activeBowser?.capacityLiters || recommendation.capacity,
        approvedBy: officerName,
        targetEta
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
        {/* Header */}
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
              <ShieldCheck size={20} color="#38BDF8" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#F8FAFC' }}>
                Official Decision Approval & Dispatch Authorization
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Authorize water bowser deployment and trigger automated resident notifications
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleDispatch} style={{ padding: '1.5rem' }}>
          {/* Target Summary */}
          <div style={{
            background: '#0B1120',
            border: '1px solid #24355A',
            borderRadius: '10px',
            padding: '1rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Target Destination
                </span>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#F8FAFC' }}>
                  {recommendation.village}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-critical">
                  🔴 {recommendation.priority} ({recommendation.priorityScore}/100)
                </span>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  ~{recommendation.breakdown?.affectedPeople?.value || 120} residents in critical deficit
                </div>
              </div>
            </div>
          </div>

          {/* Bowser Selection */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Confirm Assigned Water Bowser:
            </label>
            <select
              value={selectedBowserId}
              onChange={e => setSelectedBowserId(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: '#0B1120',
                border: '1px solid #2B3E68',
                color: '#F8FAFC',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            >
              {availableBowsers && availableBowsers.length > 0 ? (
                availableBowsers.map(b => (
                  <option key={b.bowserId} value={b.bowserId}>
                    {b.bowserId} • {b.capacityLiters.toLocaleString()} L • Location: {b.currentLocation} ({b.status.toUpperCase()})
                  </option>
                ))
              ) : (
                <option value="WB-102">WB-102 • 5,000 L • Polonnaruwa Central Depot (RECOMMENDED)</option>
              )}
            </select>
          </div>

          {/* Dispatch Parameters: Driver, ETA, Officer */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1.25rem'
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Target ETA:
              </label>
              <input
                type="text"
                value={targetEta}
                onChange={e => setTargetEta(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  background: '#0B1120',
                  border: '1px solid #2B3E68',
                  color: '#F8FAFC',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Authorizing Officer:
              </label>
              <input
                type="text"
                value={officerName}
                onChange={e => setOfficerName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  background: '#0B1120',
                  border: '1px solid #2B3E68',
                  color: '#F8FAFC',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          </div>

          {/* Simulated Resident Broadcast Preview */}
          <div style={{
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px dashed rgba(56, 189, 248, 0.35)',
            borderRadius: '10px',
            padding: '0.85rem 1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: '#38BDF8', marginBottom: '0.3rem' }}>
              <Radio size={14} />
              Simulated Outbound Resident Broadcast (SMS & App Push)
            </div>
            <div style={{ fontSize: '0.78rem', color: '#CBD5E1', fontStyle: 'italic' }}>
              "Water Bowser {selectedBowserId} ({(activeBowser?.capacityLiters || 5000).toLocaleString()} L) has been officially approved and is now en route to {recommendation.village}. Estimated arrival time is {targetEta}. Please assemble at designated community distribution points with clean containers."
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                background: '#1E293B',
                color: '#E2E8F0',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.5rem',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                border: '1px solid #38BDF8',
                color: '#FFFFFF',
                fontSize: '0.88rem',
                fontWeight: 800,
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
              }}
            >
              <Send size={16} />
              {submitting ? 'Authorizing Dispatch...' : 'Authorize & Broadcast Dispatch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
