import React, { useState, useEffect } from 'react';
import { deliveryService, bowserService } from '../services/api';
import { 
  Truck, 
  MapPin, 
  Clock, 
  Users, 
  Droplet, 
  Filter, 
  Plus, 
  RefreshCw, 
  CheckCircle, 
  Play, 
  AlertCircle,
  TrendingUp,
  UserPlus
} from 'lucide-react';
import ScheduleDeliveryModal from './ScheduleDeliveryModal';

import { useDistrict } from '../context/DistrictContext';

export default function DeliveriesDashboard() {
  const { selectedDistrict } = useDistrict();
  const [deliveries, setDeliveries] = useState([]);
  const [bowsers, setBowsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  
  // Demo scenario state
  const [demoStep, setDemoStep] = useState(0);
  const [demoStatusMessage, setDemoStatusMessage] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [delRes, bowRes] = await Promise.all([
        deliveryService.getAll(selectedDistrict),
        bowserService.getAll(selectedDistrict)
      ]);
      setDeliveries(delRes.data.deliveries || delRes.data.data || []);
      setBowsers(bowRes.data.bowsers || bowRes.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Could not connect to backend server. Operating with local UI fallback.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedDistrict]);

  const handleStatusChange = async (deliveryId, newStatus) => {
    try {
      await deliveryService.updateStatus(deliveryId, newStatus);
      fetchDashboardData();
    } catch (err) {
      alert('Failed to update delivery status: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleQueueUpdate = async (deliveryId, action) => {
    try {
      await deliveryService.updateQueue(deliveryId, { action });
      fetchDashboardData();
    } catch (err) {
      alert('Failed to update queue: ' + (err.response?.data?.message || err.message));
    }
  };

  // Run official Demo Scenario step-by-step
  const runDemoScenario = async () => {
    try {
      setDemoStatusMessage('Starting Demo Scenario...');
      setDemoStep(1);

      // Step 1: Ensure WB-102 is available
      setDemoStatusMessage('Step 1: Checking available bowser WB-102...');
      let wb102 = bowsers.find(b => b.bowserId === 'WB-102');
      if (!wb102) {
        await bowserService.create({
          bowserId: 'WB-102',
          registrationNumber: 'WP CP-4821',
          capacity: 5000,
          currentLocation: 'Polonnaruwa Depot',
          status: 'Available',
          driverName: 'Sarath Kumara',
          driverContact: '+94 77 123 4567'
        });
      } else {
        await bowserService.updateStatus(wb102._id || 'WB-102', 'Available');
      }
      await fetchDashboardData();

      // Step 2 & 3: Official Schedules WB-102 for Siripura
      setDemoStep(2);
      setDemoStatusMessage('Step 2: Official schedules WB-102 for Siripura at 2:00 PM (5,000L, 86 people waiting)...');
      
      let siripuraDel = deliveries.find(d => d.villageId === 'Siripura' && d.bowserId === 'WB-102');
      if (!siripuraDel) {
        const newDel = await deliveryService.create({
          bowserId: 'WB-102',
          villageId: 'Siripura',
          distributionPoint: 'Siripura Temple Junction',
          scheduledDate: new Date().toISOString().split('T')[0],
          estimatedArrival: '2:00 PM',
          capacity: 5000,
          peopleWaiting: 86
        });
        siripuraDel = newDel.data.data;
      }
      await fetchDashboardData();

      // Step 4: Status changes to On The Way
      setTimeout(async () => {
        setDemoStep(4);
        setDemoStatusMessage('Step 4: Dispatcher updates status to "On The Way"...');
        const currentDeliveries = (await deliveryService.getAll()).data.data;
        const target = currentDeliveries.find(d => d.villageId === 'Siripura');
        if (target) {
          await deliveryService.updateStatus(target._id, 'On The Way');
        }
        await fetchDashboardData();
      }, 1500);

      // Step 5 & 6: Resident queue increases
      setTimeout(async () => {
        setDemoStep(6);
        setDemoStatusMessage('Step 6: Residents register in queue! People waiting increases (86 -> 87)...');
        const currentDeliveries = (await deliveryService.getAll()).data.data;
        const target = currentDeliveries.find(d => d.villageId === 'Siripura');
        if (target) {
          await deliveryService.updateQueue(target._id, { action: 'increment' });
        }
        await fetchDashboardData();
      }, 3500);

      // Step 7: Completed
      setTimeout(async () => {
        setDemoStep(7);
        setDemoStatusMessage('Step 7: Water distributed! Delivery marked as "Completed".');
        const currentDeliveries = (await deliveryService.getAll()).data.data;
        const target = currentDeliveries.find(d => d.villageId === 'Siripura');
        if (target) {
          await deliveryService.updateStatus(target._id, 'Completed');
        }
        await fetchDashboardData();
      }, 5500);

    } catch (err) {
      console.error('Demo error:', err);
      setDemoStatusMessage('Demo scenario error: ' + err.message);
    }
  };

  // Filter deliveries
  const filteredDeliveries = deliveries.filter(d => {
    const matchesFilter = activeFilter === 'All' || d.status === activeFilter;
    const matchesSearch = d.villageId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.bowserId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.distributionPoint?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate Dashboard Summary Metrics
  const activeDeliveriesCount = deliveries.filter(d => d.status === 'Scheduled' || d.status === 'On The Way' || d.status === 'Distributing').length;
  const availableBowsersCount = bowsers.filter(b => b.status === 'Available').length;
  const totalPeopleWaiting = deliveries.reduce((acc, curr) => acc + (curr.peopleWaiting || 0), 0);
  const totalWaterVolume = deliveries.reduce((acc, curr) => acc + (curr.capacity || 0), 0);

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Today's Water Deliveries</h1>
          <p className="page-description">
            Official Bowser Scheduling & Live Community Water Operations
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={fetchDashboardData} title="Refresh Data">
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            Refresh
          </button>
          <button className="btn btn-primary" onClick={() => setShowScheduleModal(true)}>
            <Plus size={18} />
            Schedule Delivery
          </button>
        </div>
      </div>

      {/* Demo Walkthrough Banner */}
      <div className="demo-banner">
        <div>
          <div className="demo-title">
            <Play size={18} />
            Interactive Hackathon Demo Scenario
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Click to run automated 7-step evaluation (Siripura WB-102 delivery scheduling & status updates).
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {demoStatusMessage && (
            <span style={{ fontSize: '0.8rem', color: 'var(--status-scheduled-text)', fontWeight: '600' }}>
              {demoStatusMessage}
            </span>
          )}
          <button className="btn btn-success btn-sm" onClick={runDemoScenario}>
            <Play size={14} /> Run Demo Workflow
          </button>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Truck size={24} />
          </div>
          <div>
            <div className="stat-value">{activeDeliveriesCount}</div>
            <div className="stat-label">Active Scheduled Deliveries</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#34d399' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div className="stat-value">{availableBowsersCount}</div>
            <div className="stat-label">Available Bowsers</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="stat-value">{totalPeopleWaiting}</div>
            <div className="stat-label">Residents in Queue</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa' }}>
            <Droplet size={24} />
          </div>
          <div>
            <div className="stat-value">{(totalWaterVolume / 1000).toFixed(1)}k L</div>
            <div className="stat-label">Total Water Allocated</div>
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="toolbar">
        <div className="filter-pills">
          {['All', 'Scheduled', 'On The Way', 'Distributing', 'Completed', 'Delayed'].map(filter => (
            <button
              key={filter}
              className={`filter-pill ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter === 'All' ? 'All Deliveries' : filter}
            </button>
          ))}
        </div>

        <div className="search-input-wrapper">
          <Filter className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Filter by village or bowser..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Deliveries Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <RefreshCw size={28} className="spin" style={{ marginBottom: '0.5rem' }} />
          <div>Loading operations dashboard data...</div>
        </div>
      ) : filteredDeliveries.length === 0 ? (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px dashed var(--border-color)',
          borderRadius: '12px',
          padding: '3rem',
          textAlign: 'center'
        }}>
          <AlertCircle size={36} color="var(--text-muted)" style={{ marginBottom: '0.75rem' }} />
          <h3>No Deliveries Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            No deliveries match your active filter or search query.
          </p>
          <button 
            className="btn btn-primary" 
            style={{ marginTop: '1rem' }}
            onClick={() => setShowScheduleModal(true)}
          >
            <Plus size={16} /> Schedule First Delivery
          </button>
        </div>
      ) : (
        <div className="cards-grid">
          {filteredDeliveries.map((del) => {
            const lPerPerson = del.peopleWaiting > 0 
              ? Math.round(del.capacity / del.peopleWaiting) 
              : del.capacity;

            return (
              <div key={del._id} className="card">
                <div>
                  <div className="card-header">
                    <div>
                      <div className="card-title">{del.villageId}</div>
                      <div className="card-subtitle">{del.distributionPoint}</div>
                    </div>
                    <span className={`badge badge-${del.status.replace(/\s+/g, '-')}`}>
                      {del.status}
                    </span>
                  </div>

                  <div className="card-body">
                    <div className="info-row">
                      <span className="info-label">
                        <Truck size={15} /> Bowser ID:
                      </span>
                      <span className="info-value">🚛 {del.bowserId}</span>
                    </div>

                    <div className="info-row">
                      <span className="info-label">
                        <Clock size={15} /> Estimated Arrival:
                      </span>
                      <span className="info-value">{del.estimatedArrival}</span>
                    </div>

                    <div className="info-row">
                      <span className="info-label">
                        <Droplet size={15} /> Bowser Capacity:
                      </span>
                      <span className="info-value">{del.capacity.toLocaleString()} Liters</span>
                    </div>

                    {/* Water Demand Metric Box */}
                    <div className="demand-box">
                      <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          People Waiting: <strong style={{ color: '#fff' }}>{del.peopleWaiting}</strong>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--primary-cyan)', marginTop: '0.1rem' }}>
                          Estimated Supply Ratio
                        </div>
                      </div>
                      <div className="demand-metric">
                        <div className="demand-value">~{lPerPerson} L</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>per person</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  {/* Status Change Selector */}
                  <select
                    className="form-select"
                    style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem', width: 'auto', flex: 1 }}
                    value={del.status}
                    onChange={(e) => handleStatusChange(del._id, e.target.value)}
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="On The Way">On The Way</option>
                    <option value="Distributing">Distributing</option>
                    <option value="Completed">Completed</option>
                    <option value="Delayed">Delayed</option>
                  </select>

                  {/* Interactive Queue Buttons */}
                  <div style={{ display: 'flex', gap: '0.3rem' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      title="Join Queue (+1)"
                      onClick={() => handleQueueUpdate(del._id, 'increment')}
                    >
                      <UserPlus size={14} /> +1 Queue
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Schedule Delivery Modal */}
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
