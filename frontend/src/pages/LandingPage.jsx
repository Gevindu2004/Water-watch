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
  Flame,
  Layers,
  Cpu,
  BarChart3,
  Compass,
  ShieldAlert,
  Server
} from 'lucide-react';
import { useDistrict } from '../context/DistrictContext';

export default function LandingPage() {
  const { selectedDistrict, setSelectedDistrict, DRY_ZONE_DISTRICTS } = useDistrict();
  const [selectedVillage, setSelectedVillage] = useState('Siripura');
  const [demoQueueCount, setDemoQueueCount] = useState(86);

  const villageData = {
    Siripura: {
      district: 'Polonnaruwa',
      bowserId: 'WB-102',
      eta: '2:00 PM',
      capacity: 5000,
      distributionPoint: 'Siripura Temple Junction',
      status: 'On The Way',
      waiting: demoQueueCount,
      driver: 'Sarath Kumara (+94 77 123 4567)',
      tankLevel: '18% (Critical)',
      tankName: 'Minneriya Tank'
    },
    Mihintale: {
      district: 'Anuradhapura',
      bowserId: 'WB-202',
      eta: '1:30 PM',
      capacity: 8000,
      distributionPoint: 'Mihintale Maha Vidyalaya Grounds',
      status: 'Distributing',
      waiting: 140,
      driver: 'Rohan Rathnayake (+94 77 999 1122)',
      tankLevel: '15% (Critical)',
      tankName: 'Nuwara Wewa'
    },
    Suriyawewa: {
      district: 'Hambantota',
      bowserId: 'WB-301',
      eta: '4:00 PM',
      capacity: 10000,
      distributionPoint: 'Suriyawewa Hospital Grounds',
      status: 'Scheduled',
      waiting: 210,
      driver: 'Jagath Rajapaksha (+94 78 222 3344)',
      tankLevel: '12% (Critical)',
      tankName: 'Ridiyagama Reservoir'
    },
    Anamaduwa: {
      district: 'Puttalam',
      bowserId: 'WB-401',
      eta: '5:15 PM',
      capacity: 7000,
      distributionPoint: 'Anamaduwa Central Junction',
      status: 'Scheduled',
      waiting: 180,
      driver: 'Chaminda Fernando (+94 75 888 7766)',
      tankLevel: '17% (Critical)',
      tankName: 'Tabbowa Tank'
    },
    Vavunathivu: {
      district: 'Batticaloa',
      bowserId: 'WB-501',
      eta: '3:45 PM',
      capacity: 9000,
      distributionPoint: 'Vavunathivu School Yard',
      status: 'On The Way',
      waiting: 195,
      driver: 'Kanthasamy Thiru (+94 77 666 5544)',
      tankLevel: '14% (Critical)',
      tankName: 'Unnichchai Tank'
    },
    Bakamuna: {
      district: 'Polonnaruwa',
      bowserId: 'WB-105',
      eta: '3:30 PM',
      capacity: 8000,
      distributionPoint: 'Bakamuna Maha Vidyalaya',
      status: 'On The Way',
      waiting: 120,
      driver: 'Nimal Perera (+94 71 987 6543)',
      tankLevel: '35% (Warning)',
      tankName: 'Kaudulla Tank'
    }
  };

  const currentVillage = villageData[selectedVillage] || villageData['Siripura'];

  return (
    <div className="landing-container" style={{ background: '#0b1120', color: '#f8fafc', minHeight: '100vh' }}>
      
      {/* Navigation Header */}
      <nav className="navbar" style={{ borderBottom: '1px solid rgba(0, 242, 254, 0.25)', background: 'rgba(11, 17, 32, 0.95)' }}>
        <div className="nav-content">
          <NavLink to="/" className="brand-logo">
            <div className="brand-icon-wrapper" style={{ background: 'linear-gradient(135deg, #00f2fe, #4facfe)' }}>
              <Droplet size={24} color="#0f172a" />
            </div>
            <div>
              <div className="brand-title" style={{ letterSpacing: '0.05em' }}>WATERWATCH SRI LANKA</div>
              <div className="brand-subtitle" style={{ color: '#00f2fe', fontWeight: '700' }}>
                National Dry Zone Water Emergency & Relief Network
              </div>
            </div>
          </NavLink>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <NavLink to="/resident-preview" className="btn btn-secondary btn-sm" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
              Resident Live Queue
            </NavLink>
            <NavLink to="/login" className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(135deg, #00f2fe, #4facfe)', color: '#0f172a', fontWeight: '800' }}>
              Officer & Admin Portal Login
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Hero Banner Section */}
      <section style={{ padding: '4rem 2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(520px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
          
          {/* Left Column Text & Controls */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <span className="badge badge-critical" style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Flame size={15} /> EL NIÑO DROUGHT ALERT • NATIONWIDE DRY ZONE COVERAGE
              </span>
              <span style={{ color: '#00f2fe', fontSize: '0.85rem', fontWeight: '700' }}>
                SRI LANKA WATER BOARD INTEGRATION
              </span>
            </div>

            <h1 className="gradient-text" style={{ fontSize: '3.25rem', fontWeight: '900', lineHeight: '1.1', marginBottom: '1.25rem' }}>
              NATIONWIDE DRY ZONE WATER DISPATCH & MONITORING SYSTEM
            </h1>

            <p style={{ color: '#cbd5e1', fontSize: '1.15rem', lineHeight: '1.65', marginBottom: '2rem' }}>
              Real-time reservoir capacity tracking, AI multi-factor priority dispatching, and resident water arrival transparency across all <strong>14 Sri Lanka Dry Zone Districts</strong>.
            </p>

            {/* Dry Zone District Selector Pills */}
            <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '2rem', border: '1px solid rgba(0, 242, 254, 0.3)', background: 'rgba(15, 23, 42, 0.8)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#00f2fe', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Compass size={16} /> ACTIVE DRY ZONE DISTRICT MONITORING SECTORS:
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {DRY_ZONE_DISTRICTS.map(d => (
                  <button 
                    key={d.id}
                    className={`btn btn-sm ${selectedDistrict === d.id ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setSelectedDistrict(d.id)}
                    style={{ 
                      fontSize: '0.75rem', 
                      padding: '0.3rem 0.65rem',
                      background: selectedDistrict === d.id ? 'linear-gradient(135deg, #00f2fe, #4facfe)' : undefined,
                      color: selectedDistrict === d.id ? '#0f172a' : undefined,
                      fontWeight: selectedDistrict === d.id ? '800' : '600'
                    }}
                  >
                    {d.name}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <NavLink to="/login" className="btn btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem', fontWeight: '800', background: 'linear-gradient(135deg, #00f2fe, #4facfe)', color: '#0f172a', border: 'none' }}>
                Launch Officer & Admin Portal <ArrowRight size={18} />
              </NavLink>
              <NavLink to="/resident-preview" className="btn btn-secondary" style={{ padding: '0.9rem 1.75rem', fontSize: '1.05rem', borderColor: 'rgba(255,255,255,0.2)' }}>
                View Resident Water Queue
              </NavLink>
            </div>
          </div>

          {/* Right Column Image Carousel / Photo Showcase */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Top Photo: Aerial View of Dry Zone Reservoir */}
            <div className="glass-card" style={{ padding: '0.75rem', border: '1px solid rgba(0, 242, 254, 0.4)', borderRadius: '1rem', overflow: 'hidden' }}>
              <div style={{ position: 'relative', borderRadius: '0.75rem', overflow: 'hidden' }}>
                <img 
                  src="/dry_zone_reservoir.jpg" 
                  alt="Ancient Sri Lanka Dry Zone Reservoir Wewa" 
                  style={{ width: '100%', height: '240px', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95), transparent)', padding: '1rem' }}>
                  <div style={{ color: '#38bdf8', fontWeight: '800', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Layers size={15} /> MONITORED DRY ZONE RESERVOIRS
                  </div>
                  <div style={{ color: '#f8fafc', fontWeight: '700', fontSize: '1rem', marginTop: '0.2rem' }}>
                    Parakrama, Minneriya, Nuwara Wewa, Ridiyagama & Tabbowa
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Grid: Bowser Truck & Drought Photo */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              
              <div className="glass-card" style={{ padding: '0.75rem', border: '1px solid rgba(59, 130, 246, 0.4)', borderRadius: '1rem', overflow: 'hidden' }}>
                <img 
                  src="/water_bowser_truck.jpg" 
                  alt="Water Bowser Truck Dispatch" 
                  style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '0.5rem', display: 'block' }}
                />
                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', fontWeight: '700', color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Truck size={14} /> Fleet Bowser Operations
                </div>
              </div>

              <div className="glass-card" style={{ padding: '0.75rem', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '1rem', overflow: 'hidden' }}>
                <img 
                  src="/elnino-drought.jpg" 
                  alt="El Nino Drought Sri Lanka" 
                  style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '0.5rem', display: 'block' }}
                />
                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', fontWeight: '700', color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <AlertTriangle size={14} /> Emergency Drought Response
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* National Metric Overview Cards */}
      <section style={{ maxWidth: '1400px', margin: '0 auto 4rem auto', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          
          <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #00f2fe' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '700' }}>
              <span>DRY ZONE DISTRICTS</span>
              <Compass size={20} color="#00f2fe" />
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#00f2fe', margin: '0.5rem 0' }}>14</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>North Central, Northern, Eastern, Southern & Uva</div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #3b82f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '700' }}>
              <span>MONITORED RESERVOIRS</span>
              <Layers size={20} color="#3b82f6" />
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#60a5fa', margin: '0.5rem 0' }}>24+</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Automated level sensors & thresholds</div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #ef4444' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '700' }}>
              <span>CRITICAL RESERVOIRS</span>
              <AlertTriangle size={20} color="#ef4444" />
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#f87171', margin: '0.5rem 0' }}>6</div>
            <div style={{ fontSize: '0.8rem', color: '#f87171', fontWeight: '600' }}>Below 20% emergency capacity</div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '700' }}>
              <span>DAILY BOWSER DELIVERIES</span>
              <Truck size={20} color="#10b981" />
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#34d399', margin: '0.5rem 0' }}>1,480+</div>
            <div style={{ fontSize: '0.8rem', color: '#34d399' }}>Liters of clean drinking water dispatched</div>
          </div>

        </div>
      </section>

      {/* Interactive Live Bowser Tracker Section */}
      <section style={{ maxWidth: '1200px', margin: '0 auto 5rem auto', padding: '0 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ color: '#00f2fe', fontWeight: '800', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            REAL-TIME DISPATCH TRACKING
          </span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#f8fafc', marginTop: '0.25rem' }}>
            Live Village Bowser Arrival Tracker ({selectedDistrict})
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Select a drought-affected village below to view real-time arrival estimates and assigned bowsers.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {Object.keys(villageData).map(v => (
            <button
              key={v}
              className={`btn ${selectedVillage === v ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedVillage(v)}
              style={{
                background: selectedVillage === v ? 'linear-gradient(135deg, #00f2fe, #4facfe)' : undefined,
                color: selectedVillage === v ? '#0f172a' : undefined,
                fontWeight: selectedVillage === v ? '800' : '600'
              }}
            >
              {v} ({villageData[v].district})
            </button>
          ))}
        </div>

        <div className="glass-card" style={{ padding: '2rem', maxWidth: '850px', margin: '0 auto', border: '1px solid rgba(0, 242, 254, 0.4)', boxShadow: '0 0 30px rgba(0, 242, 254, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-critical" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
                {currentVillage.district} District
              </span>
              <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
                {selectedVillage} Emergency Water Bowser
              </h3>
              <div style={{ fontSize: '0.95rem', color: '#00f2fe', marginTop: '0.25rem', fontWeight: '600' }}>
                📍 Distribution Point: {currentVillage.distributionPoint}
              </div>
            </div>

            <span className="badge badge-high" style={{ fontSize: '0.9rem', padding: '0.6rem 1.2rem', textTransform: 'uppercase' }}>
              STATUS: {currentVillage.status}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '600' }}>Assigned Bowser Truck</div>
              <div style={{ color: '#f8fafc', fontWeight: '800', fontSize: '1.4rem', marginTop: '0.25rem' }}>{currentVillage.bowserId}</div>
              <div style={{ fontSize: '0.75rem', color: '#00f2fe', marginTop: '0.25rem' }}>Tank Volume: {currentVillage.capacity.toLocaleString()} L</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '600' }}>Estimated Arrival ETA</div>
              <div style={{ color: '#38bdf8', fontWeight: '800', fontSize: '1.4rem', marginTop: '0.25rem' }}>{currentVillage.eta}</div>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '0.25rem' }}>Driver: {currentVillage.driver}</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '600' }}>Nearest Reservoir ({currentVillage.tankName})</div>
              <div style={{ color: '#f87171', fontWeight: '800', fontSize: '1.4rem', marginTop: '0.25rem' }}>{currentVillage.tankLevel}</div>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '0.25rem' }}>Water Shortage Active</div>
            </div>
          </div>

          <div style={{ textAlign: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <NavLink to="/resident-preview" className="btn btn-secondary btn-sm">
              Open Full Resident Transparency Portal <ArrowRight size={14} />
            </NavLink>
          </div>
        </div>
      </section>

      {/* 4 Member Architecture Showcase Grid */}
      <section style={{ maxWidth: '1400px', margin: '0 auto 6rem auto', padding: '0 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#f8fafc' }}>
            System Component Architecture
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
            Four specialized modules working together to resolve water crises nationwide.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          
          {/* Member 1 Card */}
          <div className="glass-card" style={{ padding: '1.75rem', borderTop: '4px solid #3b82f6' }}>
            <div style={{ color: '#60a5fa', fontWeight: '800', fontSize: '0.85rem', marginBottom: '0.5rem' }}>MEMBER 1</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc', marginBottom: '0.75rem' }}>
              Shared Auth & Resident Portal
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
              JWT authentication system (`role = officer`, `role = admin`) and resident shortage report submission.
            </p>
            <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: '600' }}>✓ Shared Security Middleware</div>
          </div>

          {/* Member 2 Card */}
          <div className="glass-card" style={{ padding: '1.75rem', borderTop: '4px solid #06b6d4' }}>
            <div style={{ color: '#22d3ee', fontWeight: '800', fontSize: '0.85rem', marginBottom: '0.5rem' }}>MEMBER 2</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc', marginBottom: '0.75rem' }}>
              Officer & Bowser Operations
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
              Fleet status management (`AVAILABLE`, `ON_JOB`), delivery schedules, and verified shortage queues.
            </p>
            <NavLink to="/officer/dashboard" style={{ color: '#00f2fe', fontSize: '0.85rem', fontWeight: '700', textDecoration: 'none' }}>
              View Officer Portal →
            </NavLink>
          </div>

          {/* Member 3 Card */}
          <div className="glass-card" style={{ padding: '1.75rem', borderTop: '4px solid #ec4899' }}>
            <div style={{ color: '#f472b6', fontWeight: '800', fontSize: '0.85rem', marginBottom: '0.5rem' }}>MEMBER 3</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc', marginBottom: '0.75rem' }}>
              Admin & Tank Analytics
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
              Reservoir water level updater, status threshold rules (`0-19% CRITICAL`), and Recharts 7-day trend history.
            </p>
            <NavLink to="/admin/dashboard" style={{ color: '#f472b6', fontSize: '0.85rem', fontWeight: '700', textDecoration: 'none' }}>
              View Admin Control Center →
            </NavLink>
          </div>

          {/* Member 4 Card */}
          <div className="glass-card" style={{ padding: '1.75rem', borderTop: '4px solid #00f2fe' }}>
            <div style={{ color: '#00f2fe', fontWeight: '800', fontSize: '0.85rem', marginBottom: '0.5rem' }}>MEMBER 4</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc', marginBottom: '0.75rem' }}>
              AI Priority Dispatch Engine
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
              Dynamic 0-100 score matrix, Gemini decision explanation synthesis, and 1-click bowser dispatch modal.
            </p>
            <NavLink to="/admin/smart-priority" style={{ color: '#00f2fe', fontSize: '0.85rem', fontWeight: '700', textDecoration: 'none' }}>
              View AI Dispatch Matrix →
            </NavLink>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
        <p>💧 WaterWatch Sri Lanka — National Dry Zone Emergency & Relief Platform</p>
        <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Covering Polonnaruwa, Anuradhapura, Hambantota, Puttalam, Mannar, Batticaloa, Ampara, Moneragala & all Sri Lanka Dry Zone Sectors.</p>
      </footer>

    </div>
  );
}
