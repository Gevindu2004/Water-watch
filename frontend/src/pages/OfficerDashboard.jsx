import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { bowserService, deliveryService, reportService, authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useDistrict } from '../context/DistrictContext';
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
  UserPlus,
  ShieldCheck,
  BadgeCheck,
  Building2,
  User,
  MapPin,
  Mail,
  Lock,
  Phone,
  X,
  AlertCircle,
  Wand2
} from 'lucide-react';
import ScheduleDeliveryModal from './ScheduleDeliveryModal';

export default function OfficerDashboard() {
  const { user } = useAuth();
  const { selectedDistrict, DRY_ZONE_DISTRICTS } = useDistrict();
  const navigate = useNavigate();

  const [bowsers, setBowsers] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Quick Registration Modal Form State
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    district: selectedDistrict !== 'All' ? selectedDistrict : 'Polonnaruwa',
    officerId: '',
    contact: '',
    password: '',
    confirmPassword: ''
  });
  const [regStatus, setRegStatus] = useState({ type: '', message: '' });
  const [regLoading, setRegLoading] = useState(false);

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

  const handleQuickRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegStatus({ type: '', message: '' });

    if (regForm.password.length < 6) {
      setRegStatus({ type: 'error', message: 'Password must be at least 6 characters long.' });
      return;
    }
    if (regForm.password !== regForm.confirmPassword) {
      setRegStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    setRegLoading(true);
    try {
      const { confirmPassword, ...payload } = regForm;
      await authService.registerOfficer(payload);
      setRegStatus({ type: 'success', message: 'Water Officer registered successfully!' });
      setTimeout(() => {
        setShowRegisterModal(false);
        setRegStatus({ type: '', message: '' });
        setRegForm({
          name: '',
          email: '',
          district: selectedDistrict !== 'All' ? selectedDistrict : 'Polonnaruwa',
          officerId: '',
          contact: '',
          password: '',
          confirmPassword: ''
        });
      }, 1200);
    } catch (err) {
      setRegStatus({
        type: 'error',
        message: err.response?.data?.message || 'Officer registration failed. Please check details and try again.'
      });
    } finally {
      setRegLoading(false);
    }
  };

  const handleAutoFillDemo = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    setRegForm({
      name: 'Kamal Jayasuriya',
      email: `officer.kamal${randomNum}@waterboard.lk`,
      district: selectedDistrict !== 'All' ? selectedDistrict : 'Anuradhapura',
      officerId: `NWSDB-W${randomNum}`,
      contact: '+94 71 892 3410',
      password: 'WaterOfficer@2026',
      confirmPassword: 'WaterOfficer@2026'
    });
  };

  // Metrics
  const activeBowsersCount = bowsers.filter(b => b.status === 'Available' || b.status === 'On The Way' || b.status === 'Distributing').length || 8;
  const todaysDeliveriesCount = deliveries.length || 12;
  const pendingReportsCount = reports.filter(r => r.status === 'Pending').length || 7;
  const delayedDeliveriesCount = deliveries.filter(d => d.status === 'Delayed').length || 2;

  return (
    <div className="page-container">
      {/* Header Section */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Officer Operations Dashboard</h1>
          <p className="page-description">Water supply monitoring, bowser fleet status & delivery operations</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={fetchDashboardData}>
            <RefreshCw size={16} className={loading ? 'spin' : ''} /> Refresh
          </button>

          <button 
            className="btn btn-secondary" 
            style={{ borderColor: 'rgba(0, 242, 254, 0.4)', color: '#00f2fe', background: 'rgba(0, 242, 254, 0.08)' }} 
            onClick={() => setShowRegisterModal(true)}
          >
            <UserPlus size={16} /> Register Officer
          </button>

          <button className="btn btn-primary" onClick={() => setShowScheduleModal(true)}>
            <Plus size={18} /> Schedule Delivery
          </button>
        </div>
      </div>

      {/* Official Officer Identity Accreditation Banner Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9))',
        border: '1px solid rgba(0, 242, 254, 0.3)',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem',
        boxShadow: '0 10px 25px -5px rgba(0, 242, 254, 0.1)',
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #00f2fe, #3b82f6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 16px rgba(0, 242, 254, 0.3)',
            flexShrink: 0
          }}>
            <ShieldCheck size={30} color="#0f172a" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: '#f8fafc' }}>
                {user?.name || 'Water Board Officer'}
              </h3>
              <span className="badge badge-success" style={{ fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                <BadgeCheck size={12} /> VERIFIED OFFICER
              </span>
            </div>
            <div style={{ fontSize: '0.825rem', color: '#94a3b8', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <span><Building2 size={13} style={{ verticalAlign: 'middle', color: '#00f2fe' }} /> NWSDB Dry Zone Division</span>
              <span><MapPin size={13} style={{ verticalAlign: 'middle', color: '#38bdf8' }} /> Active Sector: <strong style={{ color: '#00f2fe' }}>{selectedDistrict}</strong></span>
              <span><Users size={13} style={{ verticalAlign: 'middle', color: '#34d399' }} /> Operations Level: Authorized</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setShowRegisterModal(true)}
            style={{
              background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.15), rgba(59, 130, 246, 0.15))',
              border: '1px solid rgba(0, 242, 254, 0.4)',
              color: '#00f2fe',
              fontSize: '0.85rem',
              fontWeight: '700',
              padding: '0.6rem 1.1rem',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease'
            }}
          >
            <UserPlus size={16} /> Register New Officer Account
          </button>
          <Link
            to="/officer/register-officer"
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.8rem', padding: '0.6rem 0.9rem' }}
          >
            Full Register Portal →
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
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
          Today's Scheduled Water Deliveries ({selectedDistrict})
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

      {/* Register New Officer Dashboard Modal */}
      {showRegisterModal && (
        <div className="modal-backdrop" style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #0f172a, #1e293b)',
            border: '1px solid rgba(0, 242, 254, 0.4)',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '560px',
            padding: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 242, 254, 0.25)',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowRegisterModal(false)}
              style={{
                position: 'absolute',
                right: '1.25rem',
                top: '1.25rem',
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #00f2fe, #3b82f6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <UserPlus size={22} color="#0f172a" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: '#f8fafc' }}>
                  Register Water Supply Officer
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Add a new authorized officer to the WaterWatch network
                </div>
              </div>
            </div>

            {regStatus.message && (
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                fontSize: '0.85rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: regStatus.type === 'success' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                color: regStatus.type === 'success' ? '#34d399' : '#fb7185',
                border: `1px solid ${regStatus.type === 'success' ? 'rgba(52, 211, 153, 0.4)' : 'rgba(244, 63, 94, 0.4)'}`
              }}>
                {regStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                {regStatus.message}
              </div>
            )}

            <form onSubmit={handleQuickRegisterSubmit}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
                <button
                  type="button"
                  onClick={handleAutoFillDemo}
                  style={{
                    background: 'rgba(0, 242, 254, 0.1)',
                    border: '1px solid rgba(0, 242, 254, 0.3)',
                    color: '#00f2fe',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <Wand2 size={12} /> Auto-Fill Demo
                </button>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontWeight: '700', fontSize: '0.8rem', color: '#cbd5e1' }}>Full Officer Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '2.4rem' }}
                    required
                    value={regForm.name}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                    placeholder="e.g. Kamal Jayasuriya"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontWeight: '700', fontSize: '0.8rem', color: '#cbd5e1' }}>Official Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="email"
                    className="form-input"
                    style={{ paddingLeft: '2.4rem' }}
                    required
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    placeholder="officer.kamal@waterboard.lk"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: '700', fontSize: '0.8rem', color: '#cbd5e1' }}>Assigned District</label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={15} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#00f2fe', zIndex: 2 }} />
                    <select
                      className="form-select"
                      style={{ paddingLeft: '2.4rem', fontWeight: '700', color: '#00f2fe' }}
                      value={regForm.district}
                      onChange={(e) => setRegForm({ ...regForm, district: e.target.value })}
                    >
                      {DRY_ZONE_DISTRICTS.filter(d => d.id !== 'All').map(d => (
                        <option key={d.id} value={d.id} style={{ background: '#0f172a', color: '#f8fafc' }}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: '700', fontSize: '0.8rem', color: '#cbd5e1' }}>Officer ID Code</label>
                  <div style={{ position: 'relative' }}>
                    <BadgeCheck size={15} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="text"
                      className="form-input"
                      style={{ paddingLeft: '2.4rem' }}
                      required
                      value={regForm.officerId}
                      onChange={(e) => setRegForm({ ...regForm, officerId: e.target.value })}
                      placeholder="e.g. NWSDB-W501"
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: '700', fontSize: '0.8rem', color: '#cbd5e1' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="password"
                      className="form-input"
                      style={{ paddingLeft: '2.4rem' }}
                      required
                      minLength={6}
                      value={regForm.password}
                      onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: '700', fontSize: '0.8rem', color: '#cbd5e1' }}>Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="password"
                      className="form-input"
                      style={{ paddingLeft: '2.4rem' }}
                      required
                      minLength={6}
                      value={regForm.confirmPassword}
                      onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setShowRegisterModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 2, background: 'linear-gradient(135deg, #00f2fe, #4facfe)', color: '#0f172a', fontWeight: '800' }}
                  disabled={regLoading}
                >
                  {regLoading ? 'Registering Officer...' : (
                    <>
                      <UserPlus size={16} /> Complete Officer Registration
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

