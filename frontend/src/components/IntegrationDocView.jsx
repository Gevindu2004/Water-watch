import React, { useState } from 'react';
import { Database, FileText, Code2, Link, ChevronDown, ChevronUp } from 'lucide-react';

export default function IntegrationDocView() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="panel" style={{ marginTop: '2rem' }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            padding: '0.35rem',
            borderRadius: '8px',
            background: 'rgba(2, 132, 199, 0.15)'
          }}>
            <Database size={18} color="#38BDF8" />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#F8FAFC' }}>
              MERN Stack Cross-Member Integration & Schema Architecture
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Shared MongoDB Collections, Consumption Interfaces, and API Specification
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38BDF8', fontSize: '0.8rem', fontWeight: 600 }}>
          <span>{expanded ? 'Hide Architecture' : 'View Architecture'}</span>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          {/* 4-Member Architecture Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            {/* Member 1 */}
            <div style={{ background: '#0B1120', border: '1px solid #1E293B', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38BDF8', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                <Link size={14} />
                Member 1 — Shortage Reports
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
                Collection: <code>shortagereports</code>
              </div>
              <ul style={{ fontSize: '0.75rem', color: '#CBD5E1', paddingLeft: '1.2rem', lineHeight: 1.6 }}>
                <li><code>villageId</code> (String, index)</li>
                <li><code>daysWithoutWater</code> (Number, weight: 30 pts)</li>
                <li><code>affectedPeople</code> (Number, weight: 25 pts)</li>
                <li><code>alternativeWaterSource</code> ('none' | 'limited' | 'adequate')</li>
                <li><code>daysSinceLastDelivery</code> (Number, weight: 15 pts)</li>
              </ul>
            </div>

            {/* Member 2 */}
            <div style={{ background: '#0B1120', border: '1px solid #1E293B', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38BDF8', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                <Link size={14} />
                Member 2 — Bowser Fleet
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
                Collection: <code>bowsers</code>
              </div>
              <ul style={{ fontSize: '0.75rem', color: '#CBD5E1', paddingLeft: '1.2rem', lineHeight: 1.6 }}>
                <li><code>bowserId</code> (e.g. "WB-102")</li>
                <li><code>capacityLiters</code> (e.g. 5,000 L)</li>
                <li><code>status</code> ('available' | 'dispatched' | 'maintenance')</li>
                <li><code>currentLocation</code> & <code>etaMinutes</code></li>
                <li><code>assignedVillageId</code> (Updated on dispatch)</li>
              </ul>
            </div>

            {/* Member 3 */}
            <div style={{ background: '#0B1120', border: '1px solid #1E293B', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38BDF8', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                <Link size={14} />
                Member 3 — Reservoir & Tanks
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
                Collection: <code>tanks</code>
              </div>
              <ul style={{ fontSize: '0.75rem', color: '#CBD5E1', paddingLeft: '1.2rem', lineHeight: 1.6 }}>
                <li><code>tankId</code> & <code>villageId</code> (Linked relation)</li>
                <li><code>waterLevelPercentage</code> (Weight: 20 pts deficit)</li>
                <li><code>capacityLiters</code> & current volume</li>
                <li><code>status</code> ('critical' | 'warning' | 'normal')</li>
              </ul>
            </div>

            {/* Member 4 */}
            <div style={{ background: '#0B1120', border: '1px solid #3B82F6', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#60A5FA', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                <Code2 size={14} />
                Member 4 — Decision Support Engine
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
                Collections: <code>deliverylogs</code>, <code>residentnotifications</code>
              </div>
              <ul style={{ fontSize: '0.75rem', color: '#CBD5E1', paddingLeft: '1.2rem', lineHeight: 1.6 }}>
                <li><strong>Rule Engine:</strong> Transparent 100-pt formula</li>
                <li><strong>AI Engine:</strong> Operational briefing with fallback</li>
                <li><strong>Dispatch Action:</strong> Updates Bowser & Shortage status</li>
                <li><strong>Broadcast Feed:</strong> Simulated resident alerts</li>
              </ul>
            </div>
          </div>

          {/* REST Endpoints Reference */}
          <div style={{ background: '#080E1A', border: '1px solid #1B2844', borderRadius: '8px', padding: '1rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Implemented Member 4 REST API Endpoints:
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '0.5rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem'
            }}>
              <div style={{ color: '#86EFAC' }}>GET  /api/priorities</div>
              <div style={{ color: '#86EFAC' }}>GET  /api/priorities/:villageId</div>
              <div style={{ color: '#38BDF8' }}>GET  /api/ai/recommendation</div>
              <div style={{ color: '#FCD34D' }}>POST /api/ai/explanation</div>
              <div style={{ color: '#86EFAC' }}>GET  /api/ai/health</div>
              <div style={{ color: '#86EFAC' }}>GET  /api/bowsers</div>
              <div style={{ color: '#F87171' }}>POST /api/bowsers/dispatch</div>
              <div style={{ color: '#86EFAC' }}>GET  /api/notifications/resident-feed</div>
              <div style={{ color: '#FCD34D' }}>POST /api/demo/reset</div>
              <div style={{ color: '#FCD34D' }}>POST /api/demo/update-shortage</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
