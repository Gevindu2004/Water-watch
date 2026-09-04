import React, { useState, useEffect } from 'react';
import { deliveryService } from '../services/api';
import { Users, Truck, Clock, MapPin, Droplet, CheckCircle2, UserCheck, AlertTriangle } from 'lucide-react';

export default function ResidentQueueView() {
  const [selectedVillage, setSelectedVillage] = useState('Siripura');
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasJoined, setHasJoined] = useState({});

  const fetchVillageDeliveries = async (village) => {
    setLoading(true);
    try {
      const res = await deliveryService.getByVillage(village);
      setDeliveries(res.data.data || []);
    } catch (err) {
      console.error('Error fetching village deliveries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVillageDeliveries(selectedVillage);
  }, [selectedVillage]);

  const handleToggleAttendance = async (deliveryId) => {
    const isJoined = !!hasJoined[deliveryId];
    const action = isJoined ? 'decrement' : 'increment';

    try {
      await deliveryService.updateQueue(deliveryId, { action });
      setHasJoined(prev => ({ ...prev, [deliveryId]: !isJoined }));
      fetchVillageDeliveries(selectedVillage);
    } catch (err) {
      alert('Could not update queue: ' + (err.response?.data?.message || err.message));
    }
  };

  const villages = ['Siripura', 'Bakamuna', 'Welikanda', 'Medirigiriya', 'Hingurakgoda'];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Resident Bowser Delivery Portal</h1>
          <p className="page-description">
            Member 1 Integration Preview — Resident Water Queue & Distribution Schedule
          </p>
        </div>
      </div>

      {/* Village Picker Selector */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '1.25rem',
        marginBottom: '2rem'
      }}>
        <label className="form-label" style={{ marginBottom: '0.6rem' }}>Select Your Village:</label>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {villages.map(v => (
            <button
              key={v}
              className={`btn ${selectedVillage === v ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedVillage(v)}
            >
              📍 {v}
            </button>
          ))}
        </div>
      </div>

      {/* Results for selected village */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Loading live bowser schedule for {selectedVillage}...
        </div>
      ) : deliveries.length === 0 ? (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px dashed var(--border-color)',
          borderRadius: '14px',
          padding: '3rem',
          textAlign: 'center'
        }}>
          <AlertTriangle size={36} color="var(--status-scheduled-text)" style={{ marginBottom: '0.75rem' }} />
          <h3>No Active Bowser Scheduled for {selectedVillage}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.3rem' }}>
            Check back soon or report a water shortage via Component 1.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {deliveries.map(del => {
            const lPerPerson = del.peopleWaiting > 0 
              ? Math.round(del.capacity / del.peopleWaiting) 
              : del.capacity;

            const isAttending = !!hasJoined[del._id];

            return (
              <div key={del._id} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span className={`badge badge-${del.status.replace(/\s+/g, '-')}`}>
                      {del.status}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Date: {del.scheduledDate}
                    </span>
                  </div>

                  <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                    📍 Distribution Point: {del.distributionPoint}
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.95rem' }}>
                    <div className="info-row">
                      <span className="info-label"><Truck size={16} /> Bowser Tanker:</span>
                      <span className="info-value">🚛 {del.bowserId}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label"><Clock size={16} /> Estimated Arrival:</span>
                      <span className="info-value" style={{ color: 'var(--status-scheduled-text)' }}>
                        {del.estimatedArrival}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label"><Droplet size={16} /> Total Water Supply:</span>
                      <span className="info-value">{del.capacity.toLocaleString()} Liters</span>
                    </div>
                  </div>
                </div>

                {/* Queue & Share Box */}
                <div style={{
                  background: 'var(--bg-dark)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Residents in Queue</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fff' }}>
                        {del.peopleWaiting} <span style={{ fontSize: '0.9rem', fontWeight: '400', color: 'var(--text-muted)' }}>people</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Available Water</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--primary-cyan)' }}>
                        ~{lPerPerson} L <span style={{ fontSize: '0.8rem', fontWeight: '400' }}>/ person</span>
                      </div>
                    </div>
                  </div>

                  <button
                    className={`btn ${isAttending ? 'btn-success' : 'btn-primary'}`}
                    style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem' }}
                    onClick={() => handleToggleAttendance(del._id)}
                  >
                    {isAttending ? (
                      <>
                        <UserCheck size={18} /> You Are In Queue! (Click to Leave)
                      </>
                    ) : (
                      <>
                        <Users size={18} /> I Intend to Attend Distribution
                      </>
                    )}
                  </button>
                  
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    API Endpoint: <code>PATCH /api/deliveries/{del._id}/queue</code>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
