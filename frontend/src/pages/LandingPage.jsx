import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Droplet, 
  Truck, 
  Users, 
  ShieldCheck, 
  Activity, 
  ArrowRight, 
  Clock, 
  MapPin, 
  Code,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  Sun,
  Flame,
  Info
} from 'lucide-react';

export default function LandingPage() {
  const [selectedVillage, setSelectedVillage] = useState('Siripura');
  const [demoQueueCount, setDemoQueueCount] = useState(86);

  const villageData = {
    Siripura: {
      bowserId: 'WB-102',
      eta: '2:00 PM',
      capacity: 5000,
      distributionPoint: 'Siripura Temple Junction',
      status: 'On The Way',
      waiting: demoQueueCount,
      driver: 'Sarath Kumara (+94 77 123 4567)',
      tankLevel: '18% (Critical)'
    },
    Bakamuna: {
      bowserId: 'WB-105',
      eta: '3:30 PM',
      capacity: 5000,
      distributionPoint: 'Bakamuna Maha Vidyalaya',
      status: 'On The Way',
      waiting: 120,
      driver: 'Nimal Perera (+94 71 987 6543)',
      tankLevel: '42% (Low)'
    },
    Welikanda: {
      bowserId: 'WB-108',
      eta: '5:00 PM',
      capacity: 3000,
      distributionPoint: 'Welikanda Divisional Secretariat',
      status: 'Completed',
      waiting: 45,
      driver: 'Kamal Silva (+94 76 555 1234)',
      tankLevel: '65% (Normal)'
    },
    Medirigiriya: {
      bowserId: 'WB-112',
      eta: '6:15 PM',
      capacity: 6000,
      distributionPoint: 'Medirigiriya Hospital Junction',
      status: 'Scheduled',
      waiting: 95,
      driver: 'Sunil Jayasinghe (+94 70 333 4455)',
      tankLevel: '35% (Warning)'
    },
    Hingurakgoda: {
      bowserId: 'WB-115',
      eta: '7:00 PM',
      capacity: 5000,
      distributionPoint: 'Hingurakgoda Water Depot',
      status: 'Scheduled',
      waiting: 60,
      driver: 'K. Silva (+94 77 999 8888)',
      tankLevel: '78% (Normal)'
    }
  };

  const currentInfo = villageData[selectedVillage];
  const lPerPerson = Math.round(currentInfo.capacity / currentInfo.waiting);
  const isSufficient = currentInfo.capacity >= (currentInfo.waiting * 50);

  return (
    <div style={{ background: '#090d16', color: '#f8fafc', minHeight: '100vh', position: 'relative' }}>
      
      {/* Background Decorative Glow */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '1000px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(0, 242, 254, 0.12) 0%, rgba(139, 92, 246, 0.05) 50%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Navigation Header */}
      <header className="navbar">
        <div className="nav-content">
          <NavLink to="/" className="brand-logo">
            <div className="brand-icon-wrapper">
              <Droplet size={24} />
            </div>
            <div>
              <div className="brand-title">WaterWatch Polonnaruwa</div>
              <div className="brand-subtitle">El Niño Drought Response System</div>
            </div>
          </NavLink>

          <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.8rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.8rem' }}>
              <div className="pulse-dot" />
              <span style={{ color: '#34d399', fontWeight: '600' }}>Operations Active</span>
            </div>

            <NavLink to="/resident-preview" className="btn btn-secondary btn-sm">
              <Users size={15} /> Resident Queue
            </NavLink>

            <NavLink to="/login" className="btn btn-primary btn-sm glow-pulse">
              <ShieldCheck size={15} /> Officer Sign In
            </NavLink>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '4rem 1.5rem 3rem',
        maxWidth: '1280px',
        margin: '0 auto',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.55rem',
          padding: '0.45rem 1.1rem',
          borderRadius: '30px',
          background: 'rgba(244, 63, 94, 0.15)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          color: '#fb7185',
          fontSize: '0.85rem',
          fontWeight: '700',
          marginBottom: '1.75rem',
          backdropFilter: 'blur(8px)'
        }}>
          <Flame size={16} /> 🚨 EL NIÑO DROUGHT RESPONSE PLATFORM — POLONNARUWA DISTRICT
        </div>

        <h1 className="shimmer-text" style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: '900',
          lineHeight: '1.1',
          maxWidth: '960px',
          margin: '0 auto 1.5rem'
        }}>
          Intelligent Water Bowser Dispatch & Crisis Coordination
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: '#94a3b8',
          maxWidth: '780px',
          margin: '0 auto 2.5rem',
          lineHeight: '1.6'
        }}>
          Mitigating severe El Niño drought impacts across Sri Lanka's North Central Province. Coordinating emergency water tankers for Siripura, Bakamuna, Welikanda, Medirigiriya, and Hingurakgoda.
        </p>

        <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <NavLink to="/login" className="btn btn-primary glow-pulse" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}>
            <ShieldCheck size={20} /> Enter Officer Portal <ArrowRight size={18} />
          </NavLink>
          
          <NavLink to="/resident-preview" className="btn btn-secondary" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}>
            <Users size={20} /> Resident Queue & Schedule
          </NavLink>
        </div>
      </section>

      {/* Featured El Niño Crisis Banner & Photo Showcase */}
      <section style={{ maxWidth: '1280px', margin: '0 auto 4rem', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
        <div style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.6)'
        }}>
          <img 
            src="/elnino-drought.jpg" 
            alt="El Nino Drought Impact in Sri Lanka Reservoir" 
            style={{
              width: '100%',
              height: '420px',
              objectFit: 'cover',
              filter: 'brightness(0.75) contrast(1.15)'
            }}
          />

          {/* Dark Gradient Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(9, 13, 22, 0.95) 0%, rgba(9, 13, 22, 0.4) 50%, transparent 100%)',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '2.5rem'
          }}>
            <div style={{ maxWidth: '800px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(244, 63, 94, 0.25)', color: '#fb7185', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', border: '1px solid rgba(244, 63, 94, 0.4)', marginBottom: '0.75rem' }}>
                <Sun size={14} /> FIELD PHOTO: DRY RESERVOIR BED AT POLONNARUWA
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.5rem' }}>
                El Niño Climate Phenomenon Intensifies Dry Zone Crisis
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.5' }}>
                Prolonged dry spells have reduced major reservoirs in Polonnaruwa to critical levels below 20%. WaterWatch provides automated bowser scheduling to deliver clean drinking water directly to affected village junctions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Interactive Polonnaruwa Village Tracker Preview Widget */}
      <section style={{ maxWidth: '1280px', margin: '0 auto 4rem', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Activity size={22} color="#00f2fe" />
                Live Village Water Monitor
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                Select a village to preview live bowser dispatch, arrival time, and resident queue demand ratio:
              </p>
            </div>

            {/* Village Selector Pills */}
            <div className="filter-pills">
              {['Siripura', 'Bakamuna', 'Welikanda', 'Medirigiriya', 'Hingurakgoda'].map(v => (
                <button
                  key={v}
                  className={`filter-pill ${selectedVillage === v ? 'active' : ''}`}
                  onClick={() => setSelectedVillage(v)}
                >
                  📍 {v}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Village Real-time Preview Box */}
          <div style={{
            background: 'rgba(9, 13, 22, 0.85)',
            border: '1px solid rgba(0, 242, 254, 0.25)',
            borderRadius: '16px',
            padding: '1.75rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.75rem',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <span className={`badge badge-${currentInfo.status.replace(/\s+/g, '-')}`}>
                  {currentInfo.status}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  Nearby Tank: <strong style={{ color: '#fb7185' }}>{currentInfo.tankLevel}</strong>
                </span>
              </div>

              <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.75rem' }}>
                📍 {selectedVillage} — {currentInfo.distributionPoint}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.95rem' }}>
                <div className="info-row">
                  <span className="info-label"><Truck size={16} /> Bowser Tanker:</span>
                  <span className="info-value" style={{ color: '#00f2fe' }}>🚛 {currentInfo.bowserId} ({currentInfo.capacity.toLocaleString()} L)</span>
                </div>
                <div className="info-row">
                  <span className="info-label"><Clock size={16} /> Estimated Arrival:</span>
                  <span className="info-value" style={{ color: '#fbbf24' }}>{currentInfo.eta}</span>
                </div>
                <div className="info-row">
                  <span className="info-label"><Users size={16} /> Driver Contact:</span>
                  <span className="info-value">{currentInfo.driver}</span>
                </div>
              </div>
            </div>

            {/* Live Queue Demand Ratio & Interactive Action */}
            <div style={{
              background: 'rgba(18, 26, 43, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '14px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Residents in Queue</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#ffffff' }}>
                    {currentInfo.waiting} <span style={{ fontSize: '0.9rem', fontWeight: '400', color: '#94a3b8' }}>people</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Supply Ratio</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#00f2fe' }}>
                    ~{lPerPerson} L <span style={{ fontSize: '0.8rem', fontWeight: '400' }}>/ person</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(9, 13, 22, 0.6)', padding: '0.6rem 0.9rem', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Capacity Sufficiency:</span>
                <span className="badge" style={{
                  background: isSufficient ? 'rgba(52, 211, 153, 0.15)' : 'rgba(251, 113, 133, 0.15)',
                  color: isSufficient ? '#34d399' : '#fb7185',
                  border: `1px solid ${isSufficient ? 'rgba(52, 211, 153, 0.3)' : 'rgba(251, 113, 133, 0.3)'}`
                }}>
                  {isSufficient ? '🟢 DEMAND SATISFIED' : '🔴 DEFICIT RISK'}
                </span>
              </div>

              {selectedVillage === 'Siripura' && (
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.75rem' }}
                  onClick={() => setDemoQueueCount(prev => prev + 1)}
                >
                  <Users size={16} /> Test Live Queue (+1 Resident)
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* District Operations Snapshot Bar */}
      <section style={{ maxWidth: '1280px', margin: '0 auto 4rem', padding: '0 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="stat-icon" style={{ background: 'rgba(0, 242, 254, 0.15)', color: '#00f2fe' }}>
                <Truck size={24} />
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800' }}>8 Bowsers</div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Active Tanker Fleet</div>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="stat-icon" style={{ background: 'rgba(52, 211, 153, 0.15)', color: '#34d399' }}>
                <CheckCircle2 size={24} />
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800' }}>12 Deliveries</div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Scheduled Today</div>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="stat-icon" style={{ background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24' }}>
                <Droplet size={24} />
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800' }}>60,000 L</div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Total Water Allocated</div>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
                <MapPin size={24} />
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800' }}>5 Villages</div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Drought Coverage Zones</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '2.5rem 1.5rem',
        textAlign: 'center',
        background: '#090d16'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="brand-icon-wrapper" style={{ width: '32px', height: '32px' }}>
              <Droplet size={18} />
            </div>
            <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>WaterWatch Polonnaruwa</span>
          </div>

          <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Member 2: Water Bowser Fleet & Delivery Operations
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.85rem' }}>
            <NavLink to="/api-docs" style={{ color: '#00f2fe', textDecoration: 'none', fontWeight: '600' }}>
              API Specs
            </NavLink>
            <NavLink to="/login" style={{ color: '#00f2fe', textDecoration: 'none', fontWeight: '600' }}>
              Officer Sign In
            </NavLink>
          </div>
        </div>
      </footer>
    </div>
  );
}
