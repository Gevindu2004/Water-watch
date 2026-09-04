import React, { useState } from 'react';
import { checkHealth, bowserService, deliveryService } from '../services/api';
import { Code, CheckCircle, Send, Copy, Server } from 'lucide-react';

export default function ApiDocsPage() {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runApiTest = async (testFn, label) => {
    setLoading(true);
    setTestResult({ label, status: 'Testing...' });
    try {
      const res = await testFn();
      setTestResult({
        label,
        status: 'SUCCESS',
        statusCode: res.status,
        data: res.data
      });
    } catch (err) {
      setTestResult({
        label,
        status: 'ERROR',
        statusCode: err.response?.status || 500,
        error: err.response?.data || err.message
      });
    } finally {
      setLoading(false);
    }
  };

  const endpoints = [
    {
      method: 'GET',
      path: '/api/bowsers',
      description: 'Fetch all water bowser tankers in fleet',
      testFn: () => bowserService.getAll()
    },
    {
      method: 'POST',
      path: '/api/bowsers',
      description: 'Register a new water bowser',
      samplePayload: JSON.stringify({
        bowserId: 'WB-120',
        registrationNumber: 'WP CP-7766',
        capacity: 5000,
        currentLocation: 'Polonnaruwa Depot',
        status: 'Available',
        driverName: 'A. Perera',
        driverContact: '+94 77 000 1122'
      }, null, 2)
    },
    {
      method: 'PATCH',
      path: '/api/bowsers/:id/status',
      description: 'Update bowser operational status',
      samplePayload: JSON.stringify({
        status: 'On The Way',
        currentLocation: 'En route to Siripura'
      }, null, 2)
    },
    {
      method: 'GET',
      path: '/api/deliveries',
      description: 'Fetch all scheduled and ongoing water deliveries',
      testFn: () => deliveryService.getAll()
    },
    {
      method: 'POST',
      path: '/api/deliveries',
      description: 'Schedule a bowser delivery to a village',
      samplePayload: JSON.stringify({
        bowserId: 'WB-102',
        villageId: 'Siripura',
        distributionPoint: 'Siripura Temple Junction',
        scheduledDate: '2026-09-04',
        estimatedArrival: '2:00 PM',
        capacity: 5000,
        peopleWaiting: 86
      }, null, 2)
    },
    {
      method: 'GET',
      path: '/api/deliveries/village/:villageId',
      description: 'Get deliveries for a specific village (Used by Member 1 Resident Portal)',
      testFn: () => deliveryService.getByVillage('Siripura')
    },
    {
      method: 'PATCH',
      path: '/api/deliveries/:id/queue',
      description: 'Increment/Decrement resident queue count safely',
      samplePayload: JSON.stringify({ action: 'increment' }, null, 2)
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">API Integration & Technical Docs</h1>
          <p className="page-description">
            Complete REST API contract for Member 1 (Resident Portal) & Team Integration
          </p>
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => runApiTest(checkHealth, 'GET /api/health')}
        >
          <Server size={16} /> Test Health Endpoint
        </button>
      </div>

      {/* Live Test Response Drawer */}
      {testResult && (
        <div style={{
          background: 'var(--bg-card)',
          border: `1px solid ${testResult.status === 'SUCCESS' ? 'var(--status-available-border)' : 'var(--status-delayed-border)'}`,
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ fontWeight: '700', color: testResult.status === 'SUCCESS' ? '#34d399' : '#fb7185' }}>
              {testResult.label} — {testResult.status} ({testResult.statusCode || 200})
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setTestResult(null)}>Close</button>
          </div>
          <div className="code-box">
            {JSON.stringify(testResult.data || testResult.error, null, 2)}
          </div>
        </div>
      )}

      {/* Endpoints List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {endpoints.map((ep, idx) => (
          <div key={idx} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="badge" style={{
                  background: ep.method === 'GET' ? 'rgba(14, 165, 233, 0.2)' : ep.method === 'POST' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                  color: ep.method === 'GET' ? '#38bdf8' : ep.method === 'POST' ? '#34d399' : '#fbbf24',
                  fontWeight: '700'
                }}>
                  {ep.method}
                </span>
                <code style={{ fontSize: '1rem', fontWeight: '700', color: '#fff' }}>{ep.path}</code>
              </div>

              {ep.testFn && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => runApiTest(ep.testFn, `${ep.method} ${ep.path}`)}
                  disabled={loading}
                >
                  <Send size={14} /> Test Live API
                </button>
              )}
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
              {ep.description}
            </p>

            {ep.samplePayload && (
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  Sample Request Body JSON:
                </div>
                <div className="code-box">
                  {ep.samplePayload}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
