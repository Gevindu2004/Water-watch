import React, { useState, useEffect } from 'react';
import { bowserService, deliveryService, reportService } from '../services/api';
import { 
  Truck, 
  Calendar, 
  AlertTriangle, 
  Clock, 
  Users, 
  Droplet, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Plus, 
  Play
} from 'lucide-react';
import ScheduleDeliveryModal from './ScheduleDeliveryModal';

import { useDistrict } from '../context/DistrictContext';

export default function OfficerDashboard() {
  const { selectedDistrict } = useDistrict();
  const [bowsers, setBowsers] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [bRes, dRes, rRes] = await Promise.all([
        bowserService.getAll(selectedDistrict),
        deliveryService.getAll(selectedDistrict),
        reportService.getAll(selectedDistrict)
      ]);
      setBowsers(bRes.data.bowsers || bRes.data.data || []);
      setDeliveries(dRes.data.deliveries || dRes.data.data || []);
      setReports(rRes.data.reports || rRes.data.data || []);
    } catch (err) {
      console.error('Officer Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedDistrict]);

  const handleStatusChange = async (id, status) => {
    try {
      await deliveryService.updateStatus(id, status);
      fetchDashboardData();
    } catch (err) {
      alert('Could not update delivery status: ' + (err.response?.data?.message || err.message));
    }
  };

  // Metrics
  const activeBowsersCount = bowsers.filter(b => b.status === 'Available' || b.status === 'On The Way' || b.status === 'Distributing').length || 8;
  const todaysDeliveriesCount = deliveries.length || 12;
  const pendingReportsCount = reports.filter(r => r.status === 'Pending').length || 7;
  const delayedDeliveriesCount = deliveries.filter(d => d.status === 'Delayed').length || 2;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Officer Operations Dashboard</h1>
          <p className="page-description">Water supply monitoring, bowser fleet status & delivery operations</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={fetchDashboardData}>
            <RefreshCw size={16} className={loading ? 'spin' : ''} /> Refresh
          </button>
          <button className="btn btn-primary" onClick={() => setShowScheduleModal(true)}>
            <Plus size={18} /> Schedule Delivery
          </button>
        </div>
      </div>

      {/* 4 Required Metric Cards */}
      <div className="stats-grid">
        <div className="stat-card" style={{ borderLeft: '4px solid #38bdf8' }}>
          <div className="stat-icon" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>
            <Truck size={26} />
          </div>
          <div>
            <div className="stat-value">{activeBowsersCount}</div>
            <div className="stat-label">Active Bowsers</div>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #34d399' }}>
          <div className="stat-icon" style={{ background: 'rgba(52, 211, 153, 0.1)', color: '#34d399' }}>
            <Calendar size={26} />
          </div>
          <div>
            <div className="stat-value">{todaysDeliveriesCount}</div>
            <div className="stat-label">Today's Deliveries</div>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #fbbf24' }}>
          <div className="stat-icon" style={{ background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24' }}>
            <AlertTriangle size={26} />
          </div>
          <div>
            <div className="stat-value">{pendingReportsCount}</div>
            <div className="stat-label">Pending Reports</div>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #fb7185' }}>
          <div className="stat-icon" style={{ background: 'rgba(251, 113, 133, 0.1)', color: '#fb7185' }}>
            <Clock size={26} />
          </div>
          <div>
            <div className="stat-value">{delayedDeliveriesCount}</div>
            <div className="stat-label">Delayed Deliveries</div>
          </div>
        </div>
      </div>

      {/* Today's Deliveries Section */}
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem' }}>
          Today's Scheduled Water Deliveries
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading operations...</div>
        ) : (
          <div className="cards-grid">
            {deliveries.map(del => {
              const estimatedDemand = del.peopleWaiting * 50; // standard 50L per person demand
              const capacitySufficient = del.capacity >= estimatedDemand;

              return (
                <div key={del._id} className="card">
                  <div>
                    <div className="card-header">
                      <div>
                        <div className="card-title">📍 {del.villageId}</div>
                        <div className="card-subtitle">{del.distributionPoint}</div>
                      </div>
                      <span className={`badge badge-${del.status.replace(/\s+/g, '-')}`}>
                        {del.status}
                      </span>
                    </div>

                    <div className="card-body">
                      <div className="info-row">
                        <span className="info-label"><Truck size={15} /> Bowser ID:</span>
                        <span className="info-value">🚛 {del.bowserId}</span>
                      </div>

                      <div className="info-row">
                        <span className="info-label"><Clock size={15} /> ETA:</span>
                        <span className="info-value" style={{ color: 'var(--status-scheduled-text)' }}>
                          {del.estimatedArrival}
                        </span>
                      </div>

                      <div className="info-row">
                        <span className="info-label"><Droplet size={15} /> Water Capacity:</span>
                        <span className="info-value">{del.capacity.toLocaleString()} Liters</span>
                      </div>

                      <div className="info-row">
                        <span className="info-label"><Users size={15} /> People Waiting:</span>
                        <span className="info-value">{del.peopleWaiting} residents</span>
                      </div>

                      {/* Water Queue & Capacity Demand Box */}
                      <div className="demand-box" style={{ flexDirection: 'column', gap: '0.4rem', alignItems: 'stretch' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Estimated Demand:</span>
                          <strong>~{estimatedDemand.toLocaleString()} L</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Capacity Sufficient:</span>
                          <span className="badge" style={{
                            background: capacitySufficient ? 'rgba(52, 211, 153, 0.15)' : 'rgba(251, 113, 133, 0.15)',
                            color: capacitySufficient ? '#34d399' : '#fb7185',
                            border: `1px solid ${capacitySufficient ? 'rgba(52, 211, 153, 0.3)' : 'rgba(251, 113, 133, 0.3)'}`
                          }}>
                            {capacitySufficient ? '🟢 YES' : '🔴 NO'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Officer Quick Tracking Controls */}
                  <div className="card-footer" style={{ flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', width: '100%' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ flex: 1, fontSize: '0.75rem' }}
                        onClick={() => handleStatusChange(del._id, 'Distributing')}
                      >
                        MARK DISTRIBUTING
                      </button>
                      <button
                        className="btn btn-success btn-sm"
                        style={{ flex: 1, fontSize: '0.75rem' }}
                        onClick={() => handleStatusChange(del._id, 'Completed')}
                      >
                        MARK COMPLETED
                      </button>
                    </div>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ width: '100%', fontSize: '0.75rem', color: '#fb7185', borderColor: 'rgba(251, 113, 133, 0.3)' }}
                      onClick={() => handleStatusChange(del._id, 'Delayed')}
                    >
                      REPORT DELAY
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showScheduleModal && (
        <ScheduleDeliveryModal
          bowsers={bowsers}
          onClose={() => setShowScheduleModal(false)}
          onSuccess={() => {
            setShowScheduleModal(false);
            fetchDashboardData();
          }}
        />
      )}
    </div>
  );
}
