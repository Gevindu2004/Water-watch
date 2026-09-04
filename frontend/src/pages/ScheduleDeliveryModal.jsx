import React, { useState } from 'react';
import { deliveryService } from '../services/api';
import { Calendar, Truck, MapPin, Clock, Users, Droplet } from 'lucide-react';

export default function ScheduleDeliveryModal({ bowsers, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    bowserId: bowsers.length > 0 ? bowsers[0].bowserId : 'WB-102',
    villageId: 'Siripura',
    distributionPoint: 'Siripura Temple Junction',
    scheduledDate: new Date().toISOString().split('T')[0],
    estimatedArrival: '2:00 PM',
    capacity: bowsers.length > 0 ? bowsers[0].capacity : 5000,
    peopleWaiting: 86
  });

  const [submitting, setSubmitting] = useState(false);

  const handleBowserChange = (selectedBowserId) => {
    const selected = bowsers.find(b => b.bowserId === selectedBowserId);
    setFormData(prev => ({
      ...prev,
      bowserId: selectedBowserId,
      capacity: selected ? selected.capacity : prev.capacity
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await deliveryService.create(formData);
      onSuccess();
    } catch (err) {
      alert('Failed to schedule delivery: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const villagesList = ['Siripura', 'Bakamuna', 'Welikanda', 'Medirigiriya', 'Hingurakgoda'];

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <h3>Schedule Water Delivery</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Dispatch bowser tanker to drought affected village
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Select Bowser */}
          <div className="form-group">
            <label className="form-label">Select Bowser Tanker</label>
            <select
              className="form-select"
              required
              value={formData.bowserId}
              onChange={(e) => handleBowserChange(e.target.value)}
            >
              {bowsers.length === 0 ? (
                <option value="WB-102">WB-102 (5,000 L - Sarath Kumara)</option>
              ) : (
                bowsers.map(b => (
                  <option key={b._id || b.bowserId} value={b.bowserId}>
                    🚛 {b.bowserId} ({b.capacity.toLocaleString()} L) - Driver: {b.driverName} [{b.status}]
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Select Village */}
          <div className="form-group">
            <label className="form-label">Destination Village</label>
            <select
              className="form-select"
              required
              value={formData.villageId}
              onChange={(e) => setFormData({ ...formData, villageId: e.target.value })}
            >
              {villagesList.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* Distribution Point */}
          <div className="form-group">
            <label className="form-label">Distribution Point Location</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. Siripura Temple Junction / School Grounds"
              value={formData.distributionPoint}
              onChange={(e) => setFormData({ ...formData, distributionPoint: e.target.value })}
            />
          </div>

          {/* Date & Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Scheduled Date</label>
              <input
                type="date"
                className="form-input"
                required
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Estimated Arrival (ETA)</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="2:00 PM"
                value={formData.estimatedArrival}
                onChange={(e) => setFormData({ ...formData, estimatedArrival: e.target.value })}
              />
            </div>
          </div>

          {/* Capacity & Initial Queue */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Water Capacity (Liters)</label>
              <input
                type="number"
                className="form-input"
                required
                min="500"
                step="500"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Initial People Waiting</label>
              <input
                type="number"
                className="form-input"
                min="0"
                value={formData.peopleWaiting}
                onChange={(e) => setFormData({ ...formData, peopleWaiting: Number(e.target.value) })}
              />
            </div>
          </div>

          {/* Ratio preview */}
          {formData.peopleWaiting > 0 && (
            <div className="demand-box" style={{ marginBottom: '1.2rem' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Calculated Ratio:</span>
              </div>
              <div style={{ textAlign: 'right', fontWeight: '700', color: 'var(--primary-cyan)' }}>
                ~{Math.round(formData.capacity / formData.peopleWaiting)} Liters / person
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Scheduling...' : 'Confirm Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
