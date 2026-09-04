import React, { useState, useEffect } from 'react';
import { reportService, bowserService } from '../services/api';
import { AlertTriangle, CheckCircle2, Calendar, RefreshCw, Eye, ShieldCheck, Users, Clock } from 'lucide-react';
import ScheduleDeliveryModal from './ScheduleDeliveryModal';

import { useDistrict } from '../context/DistrictContext';

export default function ShortageReportsPage() {
  const { selectedDistrict } = useDistrict();
  const [reports, setReports] = useState([]);
  const [bowsers, setBowsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const fetchReportsData = async () => {
    setLoading(true);
    try {
      const [rRes, bRes] = await Promise.all([
        reportService.getAll(selectedDistrict),
        bowserService.getAll(selectedDistrict)
      ]);
      setReports(rRes.data.reports || rRes.data.data || []);
      setBowsers(bRes.data.bowsers || bRes.data.data || []);
    } catch (err) {
      console.error('Error fetching shortage reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, [selectedDistrict]);

  const handleVerify = async (id) => {
    try {
      await reportService.verify(id, { status: 'Verified' });
      fetchReportsData();
    } catch (err) {
      alert('Could not verify report: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleResolve = async (id) => {
    try {
      await reportService.verify(id, { status: 'Resolved' });
      fetchReportsData();
    } catch (err) {
      alert('Could not resolve report: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleAssignDelivery = (report) => {
    setSelectedReport(report);
    setShowScheduleModal(true);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Community Water Shortage Reports</h1>
          <p className="page-description">Resident reported shortages, officer verification & delivery assignment</p>
        </div>
        <button className="btn btn-secondary" onClick={fetchReportsData}>
          <RefreshCw size={16} className={loading ? 'spin' : ''} /> Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Loading resident water shortage reports...
        </div>
      ) : (
        <div className="cards-grid">
          {reports.map((report) => (
            <div key={report._id} className="card">
              <div>
                <div className="card-header">
                  <div>
                    <div className="card-title">📍 {report.village}</div>
                    <div className="card-subtitle">Last received: {report.lastReceivedDate}</div>
                  </div>
                  <span className="badge" style={{
                    background: report.priority === 'High' ? 'rgba(244, 63, 94, 0.15)' : report.priority === 'Medium' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(52, 211, 153, 0.15)',
                    color: report.priority === 'High' ? '#fb7185' : report.priority === 'Medium' ? '#fbbf24' : '#34d399',
                    border: `1px solid ${report.priority === 'High' ? 'rgba(244, 63, 94, 0.3)' : report.priority === 'Medium' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(52, 211, 153, 0.3)'}`
                  }}>
                    {report.priority === 'High' ? '🔴 High' : report.priority === 'Medium' ? '🟠 Medium' : '🟡 Low'}
                  </span>
                </div>

                <div className="card-body">
                  <div className="info-row">
                    <span className="info-label"><Users size={15} /> People Affected:</span>
                    <span className="info-value">{report.peopleAffected} residents</span>
                  </div>

                  <div className="info-row">
                    <span className="info-label"><Clock size={15} /> Water Available:</span>
                    <span className="info-value" style={{ color: report.waterAvailable === 'Yes' ? '#34d399' : '#fb7185' }}>
                      {report.waterAvailable}
                    </span>
                  </div>

                  <div className="info-row">
                    <span className="info-label"><ShieldCheck size={15} /> Report Status:</span>
                    <span className="info-value">{report.status}</span>
                  </div>

                  <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    background: 'var(--bg-dark)',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    marginTop: '0.5rem'
                  }}>
                    "{report.description}"
                  </p>
                </div>
              </div>

              {/* Officer Action Buttons */}
              <div className="card-footer" style={{ flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.4rem', width: '100%' }}>
                  {report.status === 'Pending' && (
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => handleVerify(report._id)}
                    >
                      <ShieldCheck size={14} /> Verify
                    </button>
                  )}
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => handleAssignDelivery(report)}
                  >
                    <Calendar size={14} /> Assign Delivery
                  </button>
                </div>

                {report.status !== 'Resolved' && (
                  <button
                    className="btn btn-success btn-sm"
                    style={{ width: '100%' }}
                    onClick={() => handleResolve(report._id)}
                  >
                    <CheckCircle2 size={14} /> Mark Resolved
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showScheduleModal && (
        <ScheduleDeliveryModal
          bowsers={bowsers}
          onClose={() => setShowScheduleModal(false)}
          onSuccess={() => {
            setShowScheduleModal(false);
            if (selectedReport) {
              reportService.verify(selectedReport._id, { status: 'Assigned' });
            }
            fetchReportsData();
          }}
        />
      )}
    </div>
  );
}
